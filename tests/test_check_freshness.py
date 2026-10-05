"""
check_freshness.py: the daily data-freshness check (idea from ForThePeople's
verify-data cron). Each published data file is judged by its own timestamp
against how often that data should change; a stale module fails the run.

Run with:  pytest tests/test_check_freshness.py
"""
import datetime
import json
import os
import sys

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend", "scripts"))

import check_freshness as cf  # noqa: E402

NOW = datetime.datetime(2026, 10, 5, 6, 0, tzinfo=datetime.timezone.utc)


def _js(path, var, data):
    path.write_text(f"// header\nexport const {var} = {json.dumps(data)};\n", encoding="utf-8")


def test_js_module_timestamp(tmp_path):
    f = tmp_path / "fuelPrices.js"
    _js(f, "fuelPrices", {"updatedAt": "2026-10-04T21:22:24Z", "petrol": {"price": 1}})
    assert cf.read_timestamp(cf.Module("fuel", str(f), "updatedAt", 30)) == datetime.datetime(
        2026, 10, 4, 21, 22, 24, tzinfo=datetime.timezone.utc)


def test_date_only_field_counts_as_end_of_that_day_ist(tmp_path):
    f = tmp_path / "goldRates.js"
    _js(f, "goldRates", {"date": "2026-10-03"})
    ts = cf.read_timestamp(cf.Module("gold", str(f), "date", 48))
    assert ts == datetime.datetime(2026, 10, 3, 18, 29, 59, tzinfo=datetime.timezone.utc)


def test_newest_item_in_a_list(tmp_path):
    f = tmp_path / "news.json"
    f.write_text(json.dumps([
        {"published": "Sun, 04 Oct 2026 23:49:45 +0530"},
        {"published": "Fri, 02 Oct 2026 10:00:00 +0530"},
    ]), encoding="utf-8")
    ts = cf.read_timestamp(cf.Module("news", str(f), "[].published", 12))
    assert ts == datetime.datetime(2026, 10, 4, 18, 19, 45, tzinfo=datetime.timezone.utc)


def test_newest_item_in_nested_categories(tmp_path):
    f = tmp_path / "tech_pulse.json"
    f.write_text(json.dumps({"categories": {
        "safety": [{"publishedAt": "2026-10-01T10:00:00Z"}],
        "jobs": [{"publishedAt": "2026-10-03T10:00:00Z"}],
    }}), encoding="utf-8")
    ts = cf.read_timestamp(cf.Module("tech_pulse", str(f), "categories.*[].publishedAt", 96))
    assert ts == datetime.datetime(2026, 10, 3, 10, 0, tzinfo=datetime.timezone.utc)


def test_check_marks_old_and_unreadable_modules_stale(tmp_path):
    fresh = tmp_path / "a.json"
    fresh.write_text(json.dumps({"lastUpdated": "2026-10-05T04:00:00Z"}), encoding="utf-8")
    old = tmp_path / "b.json"
    old.write_text(json.dumps({"lastUpdated": "2026-07-13T09:19:09Z"}), encoding="utf-8")
    results = cf.check([
        cf.Module("fresh", str(fresh), "lastUpdated", 24),
        cf.Module("old", str(old), "lastUpdated", 48),
        cf.Module("missing", str(tmp_path / "nope.json"), "lastUpdated", 24),
    ], now=NOW)
    assert [(r.name, r.stale) for r in results] == [("fresh", False), ("old", True), ("missing", True)]
    assert results[0].age_hours == 2
    assert results[2].error


def test_main_exits_nonzero_and_writes_a_summary_when_stale(tmp_path, monkeypatch):
    old = tmp_path / "b.json"
    old.write_text(json.dumps({"lastUpdated": "2026-07-13T09:19:09Z"}), encoding="utf-8")
    summary = tmp_path / "summary.md"
    monkeypatch.setenv("GITHUB_STEP_SUMMARY", str(summary))
    monkeypatch.setattr(cf, "MODULES", [cf.Module("water_levels", str(old), "lastUpdated", 48)])
    assert cf.main(now=NOW) == 1
    text = summary.read_text(encoding="utf-8")
    assert "water_levels" in text and "STALE" in text


def test_every_configured_module_points_at_an_existing_file():
    missing = [m.name for m in cf.MODULES if not os.path.exists(m.path)]
    assert missing == []


def test_mixed_date_formats_in_a_feed_do_not_fail_the_module(tmp_path):
    # news.json mixes RSS dates with forms like "01 Oct, 2026 +0530".
    f = tmp_path / "news.json"
    f.write_text(json.dumps([
        {"published": "01 Oct, 2026 +0530"},
        {"published": "not a date"},
        {"published": "Sun, 04 Oct 2026 23:49:45 +0530"},
    ]), encoding="utf-8")
    ts = cf.read_timestamp(cf.Module("news", str(f), "[].published", 12))
    assert ts == datetime.datetime(2026, 10, 4, 18, 19, 45, tzinfo=datetime.timezone.utc)
