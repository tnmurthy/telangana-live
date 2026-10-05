"""
Unit tests for core.alert_feed — the single schema written to alerts.json.

Two families of frontend components read that file:
  * AlertsBanner / AlertsPage   -> title, description, severity, type, region,
                                   createdAt / publishedAt, sourceLink
  * BreakingNewsBanner           -> message, time, severity
and civic_gateway filters on `district`. Every record must satisfy all of them.

Run with:  pytest tests/test_alert_feed.py
"""
import datetime
import os
import sys

import pytest

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend"))

from core.alert_feed import (  # noqa: E402
    FRONTEND_SEVERITIES,
    build_alert_record,
    build_official_record,
    format_ist,
    is_fresh,
    partition_existing,
)

NOW = datetime.datetime(2026, 10, 1, 9, 30, tzinfo=datetime.timezone.utc)


def _record(**overrides):
    args = dict(
        title="Flash floods hit Khammam - Telangana Today",
        description="Low-lying colonies submerged after overnight rain.",
        alert_type="flood",
        severity="high",
        district="Khammam",
        link="https://news.example/khammam-floods",
        source="Telangana Today",
        published=None,
        now=NOW,
    )
    args.update(overrides)
    return build_alert_record(**args)


class TestSchema:
    def test_has_every_field_any_consumer_reads(self):
        rec = _record()
        for field in (
            "id", "title", "description", "type", "severity",          # AlertsPage
            "region", "createdAt", "publishedAt", "sourceLink",        # AlertsPage
            "message", "time",                                         # BreakingNewsBanner
            "district", "link", "source",                              # civic_gateway / legacy
        ):
            assert field in rec, field

    def test_aliases_stay_in_sync(self):
        rec = _record()
        assert rec["message"] == rec["title"]
        assert rec["region"] == rec["district"] == "Khammam"
        assert rec["sourceLink"] == rec["link"]

    def test_severity_uses_the_frontend_vocabulary(self):
        assert set(FRONTEND_SEVERITIES) == {"low", "medium", "high", "critical"}
        assert _record(severity="critical")["severity"] == "critical"

    def test_unknown_severity_is_rejected_loudly(self):
        with pytest.raises(ValueError):
            _record(severity="moderate")

    def test_created_at_is_iso_utc(self):
        assert _record()["createdAt"] == "2026-10-01T09:30:00Z"

    def test_time_is_an_absolute_ist_stamp_not_a_relative_claim(self):
        """The old feed hardcoded '15 mins ago', which stayed '15 mins ago' for
        two weeks. An absolute timestamp cannot go stale like that."""
        assert _record()["time"] == "1 Oct, 3:00 PM IST"

    def test_published_date_from_the_feed_is_preferred(self):
        published = (2026, 9, 30, 18, 0, 0, 0, 0, 0)  # feedparser struct_time shape
        rec = _record(published=published)
        assert rec["publishedAt"] == "2026-09-30T18:00:00Z"
        assert rec["createdAt"] == "2026-10-01T09:30:00Z"

    def test_expires_is_written_only_when_given(self):
        assert "expiresAt" not in _record()
        until = datetime.datetime(2026, 10, 1, 12, 0, tzinfo=datetime.timezone.utc)
        assert _record(expires=until)["expiresAt"] == "2026-10-01T12:00:00Z"

    def test_district_defaults_to_telangana(self):
        assert _record(district=None)["district"] == "Telangana"

    def test_id_is_stable_for_the_same_link(self):
        """Positional ids collided once old alerts expired out of the list."""
        assert _record()["id"] == _record()["id"]
        assert _record()["id"] != _record(link="https://news.example/other")["id"]


class TestFormatIst:
    @pytest.mark.parametrize(
        "utc,expected",
        [
            (datetime.datetime(2026, 10, 1, 0, 0, tzinfo=datetime.timezone.utc), "1 Oct, 5:30 AM IST"),
            (datetime.datetime(2026, 10, 1, 18, 45, tzinfo=datetime.timezone.utc), "2 Oct, 12:15 AM IST"),
        ],
    )
    def test_converts_utc_to_ist(self, utc, expected):
        assert format_ist(utc) == expected


class TestIsFresh:
    """Google News search happily returns articles from 2024. A headline like
    'Hyderabad suffers 2-hour power cuts a day' reads as current regardless of
    when it was written, so age is enforced in code from the feed's own date."""

    def test_recent_article_is_fresh(self):
        assert is_fresh((2026, 9, 30, 12, 0, 0), now=NOW, max_age_days=3)

    def test_old_article_is_not(self):
        assert not is_fresh((2024, 1, 29, 12, 0, 0), now=NOW, max_age_days=3)

    def test_boundary_is_exclusive(self):
        assert not is_fresh((2026, 9, 28, 9, 30, 0), now=NOW, max_age_days=3)

    def test_missing_date_is_treated_as_not_fresh(self):
        """Without a date we cannot show it is current; the feed prefers silence
        over a possibly years-old 'alert'."""
        assert not is_fresh(None, now=NOW, max_age_days=3)


class TestPartitionExisting:
    def test_keeps_recent_alerts_and_drops_expired(self):
        existing = [
            {"title": "fresh", "createdAt": "2026-09-30T09:30:00Z"},
            {"title": "stale", "createdAt": "2026-09-20T09:30:00Z"},
        ]
        kept, seen = partition_existing(existing, now=NOW, expiry_days=3)
        assert [a["title"] for a in kept] == ["fresh"]
        assert seen == {"fresh", "stale"}

    def test_expiry_uses_publication_date_not_ingestion_date(self):
        """An old article ingested today must not stay live for three days."""
        existing = [{"title": "old news", "createdAt": "2026-10-01T09:00:00Z",
                     "publishedAt": "2024-01-29T00:00:00Z"}]
        kept, _ = partition_existing(existing, now=NOW, expiry_days=3)
        assert kept == []

    def test_official_alert_drops_at_its_own_expiry(self):
        """SACHET alerts carry an expiry (a lightning nowcast lasts an hour)."""
        existing = [
            {"title": "over", "publishedAt": "2026-10-01T08:00:00Z",
             "expiresAt": "2026-10-01T09:00:00Z"},
            {"title": "running", "publishedAt": "2026-10-01T08:00:00Z",
             "expiresAt": "2026-10-01T12:00:00Z"},
        ]
        kept, _ = partition_existing(existing, now=NOW, expiry_days=3)
        assert [a["title"] for a in kept] == ["running"]

    def test_tolerates_the_legacy_schema(self):
        """The live file currently holds emergency_alerts.py records, which have
        no title or createdAt. The old code did a["title"] and would KeyError."""
        legacy = [{"id": 201, "type": "water", "message": "x", "time": "Recent"}]
        kept, seen = partition_existing(legacy, now=NOW, expiry_days=3)
        assert kept == []
        assert seen == set()


class TestOfficialRecord:
    """SACHET (NDMA CAP) alerts become ordinary alerts.json records."""

    def _alert(self, **overrides):
        from core.sachet import SachetAlert
        ist = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
        args = dict(
            identifier="IN-1_1", sender="Telangana-SDMA",
            sent=datetime.datetime(2026, 10, 1, 14, 0, tzinfo=ist),
            event="Heavy Rain", cap_severity="Severe", urgency="Expected",
            certainty="Likely", headline="Heavy rain likely over Nirmal",
            description=None, instruction="Avoid low-lying areas.",
            area="Nirmal, Adilabad districts of Telangana",
            effective=None,
            expires=datetime.datetime(2026, 10, 1, 20, 0, tzinfo=ist),
            link="https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1",
        )
        args.update(overrides)
        return SachetAlert(**args)

    def test_maps_fields(self):
        rec = build_official_record(self._alert(), now=NOW)
        assert rec["title"] == "Heavy rain likely over Nirmal"
        assert rec["type"] == "weather"
        assert rec["severity"] == "high"
        assert rec["source"] == "NDMA SACHET (Telangana-SDMA)"
        assert rec["link"].startswith("https://sachet.ndma.gov.in/")
        assert rec["publishedAt"] == "2026-10-01T08:30:00Z"
        assert rec["expiresAt"] == "2026-10-01T14:30:00Z"
        assert "Nirmal, Adilabad" in rec["description"]
        assert "Avoid low-lying areas." in rec["description"]

    def test_falls_back_to_event_when_no_headline(self):
        rec = build_official_record(self._alert(headline=None), now=NOW)
        assert rec["title"] == "Heavy Rain: Nirmal, Adilabad districts of Telangana"


class TestEmergencyAlertsShim:
    """civic_gateway imports fetch_latest_alerts(); it must read the published
    feed rather than regenerate it on every API request."""

    def _module(self):
        sys.path.insert(0, os.path.join(repo_root, "backend", "scripts"))
        import emergency_alerts
        return emergency_alerts

    def test_returns_the_published_feed(self, tmp_path, monkeypatch):
        mod = self._module()
        feed = tmp_path / "alerts.json"
        feed.write_text('[{"id": "alert-1", "title": "x"}]', encoding="utf-8")
        monkeypatch.setattr(mod, "PUBLIC_ALERTS_PATH", str(feed))
        assert mod.fetch_latest_alerts() == [{"id": "alert-1", "title": "x"}]

    def test_missing_or_corrupt_feed_returns_empty(self, tmp_path, monkeypatch):
        mod = self._module()
        monkeypatch.setattr(mod, "PUBLIC_ALERTS_PATH", str(tmp_path / "absent.json"))
        assert mod.fetch_latest_alerts() == []
        bad = tmp_path / "bad.json"
        bad.write_text("{not json", encoding="utf-8")
        monkeypatch.setattr(mod, "PUBLIC_ALERTS_PATH", str(bad))
        assert mod.fetch_latest_alerts() == []

    def test_no_longer_generates_alerts_without_sources(self):
        mod = self._module()
        assert not hasattr(mod, "_try_ai_alerts")
        assert not hasattr(mod, "_extract_alerts_from_news")
