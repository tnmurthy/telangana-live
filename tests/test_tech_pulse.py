"""
Unit tests for tech_pulse — the Tech & AI Pulse generator shared, byte for
byte, by telangana.live and vizag.live (docs/DATA_STANDARDS.md).

No network and no TypeSafe calls: feeds and judgments are stubbed.

Run with:  pytest tests/test_tech_pulse.py
"""
import datetime
import json
import os
import sys
from types import SimpleNamespace

import pytest

_here = os.path.dirname(os.path.abspath(__file__))
_scripts = next(p for p in (os.path.join(_here, "..", "backend", "scripts"),
                            os.path.join(_here, "..", "scripts"))
                if os.path.isfile(os.path.join(p, "tech_pulse.py")))
sys.path.insert(0, os.path.abspath(_scripts))

import tech_pulse as tp  # noqa: E402

NOW = datetime.datetime(2026, 10, 4, 6, 0, tzinfo=datetime.timezone.utc)


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    """Never reach TypeSafe from tests, even when a key is in .env."""
    monkeypatch.setattr(tp, "_get_client", lambda: None)


def _parsed(days_ago):
    return (NOW - datetime.timedelta(days=days_ago)).timetuple()


def _entry(title, days_ago=1, link=None):
    return {"title": title, "link": link or f"https://news.example/{abs(hash(title))}",
            "published_parsed": _parsed(days_ago) if days_ago is not None else None,
            "source": {"title": "The Hindu"}}


def _keyword_judge(region):
    return lambda headline, query_category: tp.keyword_verdict(headline, query_category, region)


# ── Regions ───────────────────────────────────────────────────────────────────

@pytest.mark.parametrize("region", sorted(tp.REGIONS))
def test_every_region_has_queries_for_every_category(region):
    queries = tp.REGIONS[region]["queries"]
    assert set(queries) == set(tp.CATEGORIES)
    assert all(queries[c] for c in tp.CATEGORIES)


def test_unknown_region_is_rejected():
    with pytest.raises(KeyError):
        tp.build_feed("mumbai", fetch=lambda q: [], judge=None, now=NOW)


# ── Headline cleanup ──────────────────────────────────────────────────────────

def test_source_suffix_is_split_from_google_news_title():
    assert tp.split_title("Cyber fraud ring busted in Hyderabad - The Hindu") == (
        "Cyber fraud ring busted in Hyderabad", "The Hindu")


def test_title_without_suffix_is_kept_whole():
    assert tp.split_title("T-Hub launches AI cohort") == ("T-Hub launches AI cohort", None)


# ── Keyword fallback ──────────────────────────────────────────────────────────

def test_keyword_fallback_accepts_local_matching_headline():
    v = tp.keyword_verdict("Hyderabad police warn of AI voice clone scam", "safety", "telangana")
    assert v.accepted and v.category == "safety" and v.method == "keyword"


def test_keyword_fallback_rejects_headline_outside_region():
    v = tp.keyword_verdict("Mumbai police warn of AI voice clone scam", "safety", "telangana")
    assert not v.accepted and v.rejection_reason == "not_region"


def test_keyword_fallback_rejects_off_topic_headline():
    v = tp.keyword_verdict("Hyderabad biryani festival draws crowds", "jobs", "telangana")
    assert not v.accepted and v.rejection_reason == "off_topic"


# ── TypeSafe policy (pure code over raw judgments) ────────────────────────────

def _result(category, confidence, region_p):
    return SimpleNamespace(
        choices={"category": SimpleNamespace(choice=category, confidence=confidence)},
        nouls={"is_region": SimpleNamespace(noul=region_p)},
    )


def test_policy_accepts_confident_local_item():
    v = tp.apply_policy(_result("govt", 0.95, 0.9))
    assert v.accepted and v.category == "govt" and v.method == "typesafe"


@pytest.mark.parametrize("result,reason", [
    (_result(tp.NOT_RELEVANT, 0.99, 0.99), "off_topic"),
    (_result("jobs", tp.MIN_CATEGORY_CONFIDENCE - 0.01, 0.99), "low_confidence"),
    (_result("jobs", 0.99, tp.MIN_REGION_PROBABILITY - 0.01), "not_region"),
])
def test_policy_rejections(result, reason):
    v = tp.apply_policy(result)
    assert not v.accepted and v.rejection_reason == reason


def test_typesafe_failure_falls_back_to_keywords(monkeypatch):
    class Boom:
        def system_one(self, **_):
            raise RuntimeError("service down")
    monkeypatch.setattr(tp, "_get_client", lambda: Boom())
    v = tp.judge_headline("Hyderabad police warn of deepfake scam", "safety", "telangana")
    assert v.method == "keyword" and v.accepted


# ── Feed assembly ─────────────────────────────────────────────────────────────

def test_stale_and_undated_items_are_dropped():
    entries = [_entry("Hyderabad cyber crime police bust fraud ring", 2),
               _entry("Hyderabad cyber crime police old story", tp.MAX_AGE_DAYS + 1),
               _entry("Hyderabad cyber crime police undated", None)]
    feed = tp.build_feed("telangana", fetch=lambda q: entries,
                         judge=_keyword_judge("telangana"), now=NOW)
    titles = [i["title"] for i in feed["categories"]["safety"]]
    assert titles == ["Hyderabad cyber crime police bust fraud ring"]


def test_every_item_carries_source_link_and_publication_time():
    feed = tp.build_feed("telangana", fetch=lambda q: [_entry("Hyderabad AI jobs hiring surge - Mint", 3)],
                         judge=_keyword_judge("telangana"), now=NOW)
    item = feed["categories"]["jobs"][0]
    assert item["source"] == "Mint"
    assert item["link"].startswith("https://")
    assert item["publishedAt"] == (NOW - datetime.timedelta(days=3)).strftime("%Y-%m-%dT%H:%M:%SZ")
    assert item["time"].endswith("IST")
    assert item["method"] == "keyword"


def test_story_answering_several_queries_appears_once():
    same = _entry("Telangana AI policy unveiled at T-Hub", 1, link="https://x/1")
    feed = tp.build_feed("telangana", fetch=lambda q: [same],
                         judge=_keyword_judge("telangana"), now=NOW)
    all_items = [i for items in feed["categories"].values() for i in items]
    assert len(all_items) == 1


def test_items_sorted_newest_first_and_capped():
    employers = ("Infosys", "Wipro", "Microsoft", "Google", "Amazon", "Deloitte", "Accenture",
                 "Qualcomm", "Novartis", "Salesforce")
    entries = [_entry(f"{name} hiring in Hyderabad", n % tp.MAX_AGE_DAYS)
               for n, name in enumerate(employers)]
    feed = tp.build_feed("telangana", fetch=lambda q: entries,
                         judge=_keyword_judge("telangana"), now=NOW)
    items = feed["categories"]["jobs"]
    assert len(items) == tp.MAX_ITEMS_PER_CATEGORY
    stamps = [i["publishedAt"] for i in items]
    assert stamps == sorted(stamps, reverse=True)


def test_feed_header_records_region_window_and_method():
    feed = tp.build_feed("vizag", fetch=lambda q: [], judge=_keyword_judge("vizag"), now=NOW)
    assert feed["region"] == "vizag"
    assert feed["maxAgeDays"] == tp.MAX_AGE_DAYS
    assert feed["generatedAt"] == "2026-10-04T06:00:00Z"
    assert feed["categories"] == {c: [] for c in tp.CATEGORIES}


def test_all_queries_failing_raises_instead_of_writing_empty_feed():
    def broken(_):
        raise OSError("offline")
    with pytest.raises(tp.FeedUnavailable):
        tp.build_feed("telangana", fetch=broken, judge=_keyword_judge("telangana"), now=NOW)


# ── Writing ───────────────────────────────────────────────────────────────────

def test_write_skips_when_only_generated_at_changed(tmp_path):
    out = tmp_path / "tech_pulse.json"
    feed = tp.build_feed("telangana", fetch=lambda q: [_entry("Hyderabad AI jobs hiring", 1)],
                         judge=_keyword_judge("telangana"), now=NOW)
    assert tp.write_if_changed(feed, str(out)) is True
    later = dict(feed, generatedAt="2026-10-04T07:00:00Z")
    assert tp.write_if_changed(later, str(out)) is False
    assert json.loads(out.read_text(encoding="utf-8"))["generatedAt"] == feed["generatedAt"]


def test_write_happens_when_items_change(tmp_path):
    out = tmp_path / "tech_pulse.json"
    feed = tp.build_feed("telangana", fetch=lambda q: [], judge=_keyword_judge("telangana"), now=NOW)
    tp.write_if_changed(feed, str(out))
    changed = tp.build_feed("telangana", fetch=lambda q: [_entry("Hyderabad AI jobs hiring", 1)],
                            judge=_keyword_judge("telangana"), now=NOW)
    assert tp.write_if_changed(changed, str(out)) is True


# ── Same story, different outlets ─────────────────────────────────────────────

def test_one_event_from_several_outlets_is_listed_once_newest_kept():
    entries = [_entry("Telangana cyber safety month begins with night walk - The Hindu", 3),
               _entry("Cyber safety month begins in Telangana with a night walk - Deccan Chronicle", 1),
               _entry("Hyderabad police bust loan app fraud gang - Times of India", 2)]
    feed = tp.build_feed("telangana", fetch=lambda q: entries,
                         judge=_keyword_judge("telangana"), now=NOW)
    titles = [i["title"] for i in feed["categories"]["safety"]]
    assert titles == ["Cyber safety month begins in Telangana with a night walk",
                      "Hyderabad police bust loan app fraud gang"]


def test_overlap_fallback_keeps_different_events_on_one_topic():
    assert not tp.overlap_same_story("Hyderabad police bust loan app fraud gang",
                                     ["Telangana cyber safety month begins with night walk"])


def test_same_story_uses_typesafe_judgment_when_available(monkeypatch):
    class Client:
        def system_one(self, state, questions):
            assert "already_listed" in state
            return SimpleNamespace(nouls={"same_story": SimpleNamespace(noul=0.9)})
    monkeypatch.setattr(tp, "_get_client", lambda: Client())
    assert tp.same_story("Telangana to bring AI into driving tests",
                         ["Telangana plans AI-powered cameras for driving tests"])


def test_same_story_with_nothing_listed_is_false():
    assert tp.same_story("anything", []) is False
