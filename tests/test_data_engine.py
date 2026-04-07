"""
Smoke tests for the Python data engine.
Run with:  pytest tests/
"""
import json
import os
import sys
import re
from unittest.mock import MagicMock, patch

# Ensure repo root is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_entry(title, link, summary=""):
    entry = MagicMock()
    entry.title = title
    entry.link = link
    entry.get = MagicMock(side_effect=lambda key, default="": summary if key == "summary" else default)
    return entry


# ---------------------------------------------------------------------------
# news_scraper tests
# ---------------------------------------------------------------------------

class TestNewsScraper:
    def _get_scraper(self):
        from scripts.news_scraper import NewsScraper
        scraper = NewsScraper()
        scraper.model = None  # disable Gemini in unit tests
        return scraper

    def test_clean_html(self):
        scraper = self._get_scraper()
        assert scraper.clean_html("<b>Hello</b> <i>World</i>") == "Hello World"
        assert scraper.clean_html("") == ""
        assert scraper.clean_html(None) == ""

    def test_region_detection_hyderabad(self):
        scraper = self._get_scraper()
        entry = _make_entry("GHMC opens new park in Hyderabad", "http://example.com/1")
        with patch("feedparser.parse") as mock_parse:
            mock_feed = MagicMock()
            mock_feed.entries = [entry]
            mock_parse.return_value = mock_feed
            # Patch FEEDS to only one source to keep it simple
            with patch.dict("scripts.news_scraper.FEEDS", {"TestFeed": "http://test.rss"}):
                results = scraper.scrape()
        assert len(results) >= 1
        assert results[0]["region"] == "Hyderabad"

    def test_region_detection_cyberabad(self):
        scraper = self._get_scraper()
        entry = _make_entry("New tech park in HITEC City", "http://example.com/2")
        with patch("feedparser.parse") as mock_parse:
            mock_feed = MagicMock()
            mock_feed.entries = [entry]
            mock_parse.return_value = mock_feed
            with patch.dict("scripts.news_scraper.FEEDS", {"TestFeed": "http://test.rss"}):
                results = scraper.scrape()
        assert results[0]["region"] == "Cyberabad"

    def test_deduplication(self):
        scraper = self._get_scraper()
        # Two entries with the same link
        e1 = _make_entry("Story One", "http://example.com/same")
        e2 = _make_entry("Story One duplicate", "http://example.com/same")
        with patch("feedparser.parse") as mock_parse:
            mock_feed = MagicMock()
            mock_feed.entries = [e1, e2]
            mock_parse.return_value = mock_feed
            with patch.dict("scripts.news_scraper.FEEDS", {"TestFeed": "http://test.rss"}):
                results = scraper.scrape()
        links = [r["link"] for r in results]
        assert len(links) == len(set(links)), "Duplicate links should be removed"

    def test_category_transit(self):
        scraper = self._get_scraper()
        entry = _make_entry("Metro train service disrupted", "http://example.com/3")
        with patch("feedparser.parse") as mock_parse:
            mock_feed = MagicMock()
            mock_feed.entries = [entry]
            mock_parse.return_value = mock_feed
            with patch.dict("scripts.news_scraper.FEEDS", {"TestFeed": "http://test.rss"}):
                results = scraper.scrape()
        assert results[0]["category"] == "Transit"

    def test_category_health(self):
        scraper = self._get_scraper()
        entry = _make_entry("New dengue cases reported in Hyderabad hospitals", "http://example.com/4")
        with patch("feedparser.parse") as mock_parse:
            mock_feed = MagicMock()
            mock_feed.entries = [entry]
            mock_parse.return_value = mock_feed
            with patch.dict("scripts.news_scraper.FEEDS", {"TestFeed": "http://test.rss"}):
                results = scraper.scrape()
        assert results[0]["category"] == "Health"

    def test_max_50_items(self):
        scraper = self._get_scraper()
        # Generate 60 unique entries
        entries = [_make_entry(f"Story {i}", f"http://example.com/{i}") for i in range(60)]
        with patch("feedparser.parse") as mock_parse:
            mock_feed = MagicMock()
            mock_feed.entries = entries
            mock_parse.return_value = mock_feed
            with patch.dict("scripts.news_scraper.FEEDS", {"TestFeed": "http://test.rss"}):
                results = scraper.scrape()
        assert len(results) <= 50


# ---------------------------------------------------------------------------
# data_engine utility tests
# ---------------------------------------------------------------------------

class TestDataEngineUtils:
    def test_clean_html(self):
        from scripts.data_engine import clean_html
        assert clean_html("<p>Hello <b>World</b></p>") == "Hello World"
        assert clean_html("") == ""
        assert clean_html(None) == ""

    def test_write_js_module(self, tmp_path):
        from scripts.data_engine import write_js_module
        out = tmp_path / "test_output.js"
        data = {"key": "value", "num": 42}
        write_js_module(str(out), "testVar", data)
        content = out.read_text()
        assert "export const testVar" in content
        assert '"key": "value"' in content
        assert '"num": 42' in content


# ---------------------------------------------------------------------------
# Gold / fuel regex sanity check
# ---------------------------------------------------------------------------

class TestGoldFuelParsing:
    """Verify that the regex patterns used to extract prices would match
    realistic GoodReturns page text."""

    def test_gold22k_regex(self):
        sample = "22 K Gold Rate Today Rs. 7,180 per gram"
        m = re.search(r"22\s*K[\s\S]{0,100}Rs\.?\s*([\d,]+)", sample, re.I)
        assert m is not None
        assert float(m.group(1).replace(",", "")) == 7180

    def test_petrol_regex(self):
        sample = "Petrol Price Today Rs. 107.41 per litre"
        m = re.search(r"Petrol[\s\S]*?Rs\.\s*([\d.]+)", sample, re.I)
        assert m is not None
        assert float(m.group(1)) == 107.41


# ---------------------------------------------------------------------------
# news.json schema test
# ---------------------------------------------------------------------------

class TestNewsJsonSchema:
    def test_news_json_valid(self):
        news_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "src", "data", "news.json",
        )
        if not os.path.exists(news_path):
            return  # skip if file hasn't been generated yet
        with open(news_path, encoding="utf-8") as f:
            items = json.load(f)
        assert isinstance(items, list), "news.json should be a JSON array"
        for item in items[:5]:
            assert "title" in item
            assert "link" in item
            assert "source" in item
            assert "category" in item
            assert "region" in item
Unit tests for scripts/data_engine.py and scripts/news_scraper.py.
Run with: python -m pytest tests/test_data_engine.py -v
"""

import json
import os
import re
import sys
import tempfile
from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest

# ── Ensure scripts directory is on sys.path so we can import the modules ──
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_SCRIPTS_DIR = os.path.join(_REPO_ROOT, "scripts")
sys.path.insert(0, _SCRIPTS_DIR)
sys.path.insert(0, _REPO_ROOT)

# ── Stub optional heavy dependencies before importing the modules ──────────

# Stub feedparser so data_engine / news_scraper can be imported without it
feedparser_stub = MagicMock()
feedparser_stub.parse.return_value = MagicMock(entries=[])
sys.modules.setdefault("feedparser", feedparser_stub)

# Stub google-generativeai
genai_stub = MagicMock()
sys.modules.setdefault("google", MagicMock())
sys.modules.setdefault("google.generativeai", genai_stub)

# Stub anthropic
sys.modules.setdefault("anthropic", MagicMock())

# Stub supabase
sys.modules.setdefault("supabase", MagicMock())

# Stub schedule
sys.modules.setdefault("schedule", MagicMock())

# Stub python-dateutil
sys.modules.setdefault("dateutil", MagicMock())
sys.modules.setdefault("dateutil.parser", MagicMock())

# ── Now import the modules under test ─────────────────────────────────────
import data_engine
from news_scraper import NewsScraper


# ═══════════════════════════════════════════════════════════════════════════
# data_engine — write_js_module
# ═══════════════════════════════════════════════════════════════════════════

class TestWriteJsModule:
    def test_creates_file_with_correct_export(self, tmp_path):
        path = str(tmp_path / "output.js")
        data = {"key": "value", "count": 42}
        data_engine.write_js_module(path, "testData", data)

        content = open(path, encoding="utf-8").read()
        assert "export const testData" in content
        assert '"key": "value"' in content
        assert '"count": 42' in content

    def test_file_starts_with_generated_comment(self, tmp_path):
        path = str(tmp_path / "output.js")
        data_engine.write_js_module(path, "myVar", {})

        content = open(path, encoding="utf-8").read()
        assert content.startswith("// Automatically generated by data_engine.py at")

    def test_output_is_valid_json_inside_js(self, tmp_path):
        path = str(tmp_path / "output.js")
        data = {"city": "Hyderabad", "price": 107.41, "items": [1, 2, 3]}
        data_engine.write_js_module(path, "prices", data)

        content = open(path, encoding="utf-8").read()
        # Extract the JSON portion after "= " and before the trailing ";\n"
        match = re.search(r"= (\{[\s\S]*\});", content)
        assert match, "Could not find JSON block in output"
        parsed = json.loads(match.group(1))
        assert parsed["city"] == "Hyderabad"
        assert parsed["price"] == 107.41

    def test_handles_unicode_content(self, tmp_path):
        path = str(tmp_path / "output.js")
        data = {"district": "హైదరాబాద్"}  # Telugu script
        data_engine.write_js_module(path, "districtData", data)

        content = open(path, encoding="utf-8").read()
        assert "హైదరాబాద్" in content

    def test_overwrites_existing_file(self, tmp_path):
        path = str(tmp_path / "output.js")
        data_engine.write_js_module(path, "v1", {"version": 1})
        data_engine.write_js_module(path, "v2", {"version": 2})

        content = open(path, encoding="utf-8").read()
        assert '"version": 2' in content
        assert '"version": 1' not in content


# ═══════════════════════════════════════════════════════════════════════════
# data_engine — clean_html
# ═══════════════════════════════════════════════════════════════════════════

class TestCleanHtml:
    def test_strips_html_tags(self):
        assert data_engine.clean_html("<p>Hello <b>World</b></p>") == "Hello World"

    def test_returns_empty_string_for_none(self):
        assert data_engine.clean_html(None) == ""

    def test_returns_empty_string_for_empty_string(self):
        assert data_engine.clean_html("") == ""

    def test_strips_self_closing_tags(self):
        result = data_engine.clean_html("Line one<br/>Line two")
        assert "<br/>" not in result
        assert "Line one" in result

    def test_preserves_plain_text(self):
        assert data_engine.clean_html("No tags here") == "No tags here"

    def test_strips_anchor_tags(self):
        result = data_engine.clean_html('<a href="https://example.com">Click here</a>')
        assert result == "Click here"

    def test_strips_div_nesting(self):
        result = data_engine.clean_html("<div><span>Inner text</span></div>")
        assert result == "Inner text"

    def test_strips_script_tags_but_leaves_content(self):
        # clean_html uses a simple regex that strips tag brackets only —
        # the content between tags (including script bodies) is preserved.
        result = data_engine.clean_html("<script>alert('xss')</script>Safe text")
        assert "<script>" not in result
        assert "</script>" not in result
        assert "Safe text" in result


# ═══════════════════════════════════════════════════════════════════════════
# data_engine — sync_pulses
# ═══════════════════════════════════════════════════════════════════════════

class TestSyncPulses:
    def test_writes_pulses_file(self, tmp_path):
        original_path = data_engine.PATHS["pulses"]
        data_engine.PATHS["pulses"] = str(tmp_path / "pulses.js")
        try:
            data_engine.sync_pulses()
            content = open(data_engine.PATHS["pulses"], encoding="utf-8").read()
            assert "export const pulsesData" in content
            assert "Toor Dal" in content
        finally:
            data_engine.PATHS["pulses"] = original_path

    def test_pulses_contain_required_fields(self, tmp_path):
        original_path = data_engine.PATHS["pulses"]
        data_engine.PATHS["pulses"] = str(tmp_path / "pulses.js")
        try:
            data_engine.sync_pulses()
            content = open(data_engine.PATHS["pulses"], encoding="utf-8").read()
            match = re.search(r"= (\{[\s\S]*\});", content)
            assert match, "Could not find JSON in output"
            data = json.loads(match.group(1))
            assert data["city"] == "Hyderabad"
            assert "date" in data
            assert isinstance(data["commodities"], list)
            assert len(data["commodities"]) > 0
        finally:
            data_engine.PATHS["pulses"] = original_path

    def test_pulses_date_is_today(self, tmp_path):
        original_path = data_engine.PATHS["pulses"]
        data_engine.PATHS["pulses"] = str(tmp_path / "pulses.js")
        try:
            data_engine.sync_pulses()
            content = open(data_engine.PATHS["pulses"], encoding="utf-8").read()
            today = datetime.now().strftime("%Y-%m-%d")
            assert today in content
        finally:
            data_engine.PATHS["pulses"] = original_path


# ═══════════════════════════════════════════════════════════════════════════
# news_scraper — NewsScraper.clean_html
# ═══════════════════════════════════════════════════════════════════════════

class TestNewsScraperCleanHtml:
    def setup_method(self):
        self.scraper = NewsScraper()

    def test_strips_tags(self):
        assert self.scraper.clean_html("<p>Hello</p>") == "Hello"

    def test_returns_empty_for_none(self):
        assert self.scraper.clean_html(None) == ""

    def test_returns_empty_for_empty_string(self):
        assert self.scraper.clean_html("") == ""

    def test_strips_nested_tags(self):
        result = self.scraper.clean_html("<div><p><b>Nested</b> text</p></div>")
        assert result == "Nested text"

    def test_preserves_plain_text(self):
        assert self.scraper.clean_html("Plain text") == "Plain text"


# ═══════════════════════════════════════════════════════════════════════════
# news_scraper — region and category classification
# ═══════════════════════════════════════════════════════════════════════════

class TestNewsScraperClassification:
    def setup_method(self):
        self.scraper = NewsScraper()

    def _scrape_single(self, title, summary=""):
        """Helper: run scrape with a single synthetic feed entry."""
        entry = MagicMock()
        entry.title = title
        entry.link = "https://example.com/article"
        entry.get = lambda key, default="": {
            "published": "2026-04-06",
            "summary": summary,
        }.get(key, default)

        feed_mock = MagicMock()
        feed_mock.entries = [entry]
        with patch("feedparser.parse", return_value=feed_mock):
            return self.scraper.scrape(limit=1)

    def test_region_hyderabad(self):
        items = self._scrape_single("GHMC launches new project in Hyderabad")
        assert items[0]["region"] == "Hyderabad"

    def test_region_cyberabad(self):
        items = self._scrape_single("Cyberabad police nab suspect")
        assert items[0]["region"] == "Cyberabad"

    def test_region_malkajgiri(self):
        items = self._scrape_single("Malkajgiri water supply disrupted")
        assert items[0]["region"] == "Malkajgiri"

    def test_region_defaults_to_telangana(self):
        items = self._scrape_single("State cabinet meets today")
        assert items[0]["region"] == "Telangana"

    def test_category_transit(self):
        items = self._scrape_single("TSRTC bus strike affects traffic")
        assert items[0]["category"] == "Transit"

    def test_category_weather(self):
        items = self._scrape_single("IMD predicts heavy rain in Telangana")
        assert items[0]["category"] == "Weather"

    def test_category_safety(self):
        items = self._scrape_single("Police arrest gang in robbery case")
        assert items[0]["category"] == "Safety"

    def test_category_education(self):
        items = self._scrape_single("School exam results announced today")
        assert items[0]["category"] == "Education"

    def test_category_finance(self):
        items = self._scrape_single("Gold market sees record highs")
        assert items[0]["category"] == "Finance"

    def test_category_health(self):
        items = self._scrape_single("Dengue cases rise in Hyderabad hospital")
        assert items[0]["category"] == "Health"

    def test_category_defaults_to_general(self):
        items = self._scrape_single("A completely unrelated random story")
        assert items[0]["category"] == "General"


# ═══════════════════════════════════════════════════════════════════════════
# news_scraper — deduplication
# ═══════════════════════════════════════════════════════════════════════════

class TestNewsScraperDeduplication:
    def setup_method(self):
        self.scraper = NewsScraper()

    def test_duplicate_links_are_excluded(self):
        entry1 = MagicMock()
        entry1.title = "First article"
        entry1.link = "https://example.com/same"
        entry1.get = lambda key, default="": {
            "published": "2026-04-06", "summary": ""
        }.get(key, default)

        entry2 = MagicMock()
        entry2.title = "Duplicate article"
        entry2.link = "https://example.com/same"  # same URL
        entry2.get = lambda key, default="": {
            "published": "2026-04-06", "summary": ""
        }.get(key, default)

        feed_mock = MagicMock()
        feed_mock.entries = [entry1, entry2]

        with patch("feedparser.parse", return_value=feed_mock):
            items = self.scraper.scrape(limit=10)

        links = [item["link"] for item in items]
        assert links.count("https://example.com/same") == 1

    def test_error_from_one_feed_does_not_stop_scraping(self):
        """scrape() should skip a failing feed and continue with others."""
        good_entry = MagicMock()
        good_entry.title = "Good article"
        good_entry.link = "https://example.com/good"
        good_entry.get = lambda key, default="": {
            "published": "2026-04-06", "summary": ""
        }.get(key, default)

        good_feed = MagicMock()
        good_feed.entries = [good_entry]

        call_count = [0]

        def side_effect(url):
            call_count[0] += 1
            if call_count[0] == 1:
                raise RuntimeError("Feed 1 failed")
            return good_feed

        with patch("feedparser.parse", side_effect=side_effect):
            items = self.scraper.scrape(limit=10)

        # Should have at least one item from the non-failing feed
        assert any(item["link"] == "https://example.com/good" for item in items)
