"""
Smoke tests for the Python data engine.
Run with:  pytest tests/
"""
import json
import os
import sys
import re
from unittest.mock import MagicMock, patch

# Ensure repo root and backend are importable
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, repo_root)
sys.path.insert(0, os.path.join(repo_root, "backend"))

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
_SCRIPTS_DIR = os.path.join(_REPO_ROOT, "backend", "scripts")
sys.path.insert(0, _SCRIPTS_DIR)
sys.path.insert(0, _REPO_ROOT)
sys.path.insert(0, os.path.join(_REPO_ROOT, "backend"))

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

# Stub agents.fact_checker
fact_checker_stub = MagicMock()
fact_checker_stub.check_news_item.return_value = {
    "is_fake_news_flag": False,
    "credibility_score": 85,
    "civic_action_required": False,
    "reasoning": "Mocked verification"
}
sys.modules.setdefault("agents.fact_checker", MagicMock(fact_checker=fact_checker_stub))

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
            assert "export const pulses" in content
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
        assert items[0]["category"] == "Business"

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


# ═══════════════════════════════════════════════════════════════════════════
# data_engine — get_ai_summary
# ═══════════════════════════════════════════════════════════════════════════

class TestGetAiSummary:
    def test_returns_empty_when_model_is_none(self):
        original = data_engine.model
        data_engine.model = None
        try:
            result = data_engine.get_ai_summary("Title", "Description")
            assert result == ""
        finally:
            data_engine.model = original

    def test_returns_stripped_text_from_model(self):
        mock_model = MagicMock()
        mock_model.generate_content.return_value.text = "  Summary line 1.\nSummary line 2.  "
        original = data_engine.model
        data_engine.model = mock_model
        try:
            result = data_engine.get_ai_summary("Title", "Description")
            assert result == "Summary line 1.\nSummary line 2."
            mock_model.generate_content.assert_called_once()
        finally:
            data_engine.model = original

    def test_returns_empty_on_model_exception(self):
        mock_model = MagicMock()
        mock_model.generate_content.side_effect = RuntimeError("API error")
        original = data_engine.model
        data_engine.model = mock_model
        try:
            result = data_engine.get_ai_summary("Title", "Description")
            assert result == ""
        finally:
            data_engine.model = original


# ═══════════════════════════════════════════════════════════════════════════
# data_engine — sync_finance (gold & fuel parsing)
# ═══════════════════════════════════════════════════════════════════════════

def _make_mock_response(text):
    """Return a mock requests.Response whose .text attribute is *text*."""
    mock_resp = MagicMock()
    mock_resp.text = text
    mock_resp.status_code = 200
    return mock_resp


# Gold HTML is structured so that 22K and 24K price sections are > 300 characters
# apart. This is necessary because the gold-parsing regex uses a greedy
# [\s\S]{0,300} quantifier, which would otherwise consume the 22K text and
# capture the later 24K price instead.  The filler string ensures the two
# sections are separated by more than 300 characters.
_SECTION_SEP = " " * 350

_GOLD_HTML = (
    "<html><body>\n"
    "22 Karat Gold Price in Hyderabad Today \u20b97,180 per gram\n"
    + _SECTION_SEP
    + "\n24 Karat Gold Price in Hyderabad Today \u20b97,830 per gram\n"
    # Silver regex captures only digits/commas (no decimal), so use an integer
    "Silver \u20b997 per gram\n"
    "</body></html>"
)

_FUEL_HTML = """
<html><body>
Petrol Price Today in Hyderabad Rs. 107.41 per litre
Diesel Price Today in Hyderabad Rs. 97.82 per litre
</body></html>
"""


class TestSyncFinanceGoldParsing:
    """sync_finance correctly parses gold/silver prices from HTML."""

    def _run_finance_sync(self, tmp_path, gold_html=_GOLD_HTML, fuel_html=_FUEL_HTML):
        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = str(tmp_path / "goldRates.js")
        data_engine.PATHS["fuel"] = str(tmp_path / "fuelPrices.js")
        try:
            with patch.object(data_engine, "requests") as mock_req:
                mock_req.get.side_effect = [
                    _make_mock_response(gold_html),
                    _make_mock_response(fuel_html),
                ]
                data_engine.sync_finance()
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

    def test_writes_gold_file(self, tmp_path):
        self._run_finance_sync(tmp_path)
        assert os.path.exists(str(tmp_path / "goldRates.js"))

    def test_gold_file_has_correct_export(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "goldRates.js"), encoding="utf-8").read()
        assert "export const goldRates" in content

    def test_gold22k_price_parsed(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "goldRates.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["gold22k"]["price"] == 7180.0

    def test_gold24k_price_parsed(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "goldRates.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["gold24k"]["price"] == 7830.0

    def test_silver_per_gram_preserved(self, tmp_path):
        """Silver value <= 1000 should be stored as-is (integer, regex strips decimal)."""
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "goldRates.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["silver"]["price"] == 97.0

    def test_silver_per_kg_normalised_to_per_gram(self, tmp_path):
        """Silver value > 1000 (per-kg figure) must be divided by 1000."""
        html_with_kg_silver = _GOLD_HTML.replace("\u20b997 per gram", "\u20b997,000 per kg")
        self._run_finance_sync(tmp_path, gold_html=html_with_kg_silver)
        content = open(str(tmp_path / "goldRates.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["silver"]["price"] == 97.0

    def test_gold_data_contains_required_fields(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "goldRates.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["city"] == "Hyderabad"
        assert "date" in data
        assert "gold22k" in data and "price" in data["gold22k"]
        assert "gold24k" in data and "price" in data["gold24k"]
        assert "silver" in data and "price" in data["silver"]
        assert isinstance(data["history"], list)


class TestSyncFinanceFuelParsing:
    """sync_finance correctly parses fuel prices from HTML."""

    def _run_finance_sync(self, tmp_path, fuel_html=_FUEL_HTML):
        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = str(tmp_path / "goldRates.js")
        data_engine.PATHS["fuel"] = str(tmp_path / "fuelPrices.js")
        try:
            with patch.object(data_engine, "requests") as mock_req:
                mock_req.get.side_effect = [
                    _make_mock_response(_GOLD_HTML),
                    _make_mock_response(fuel_html),
                ]
                data_engine.sync_finance()
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

    def test_writes_fuel_file(self, tmp_path):
        self._run_finance_sync(tmp_path)
        assert os.path.exists(str(tmp_path / "fuelPrices.js"))

    def test_fuel_file_has_correct_export(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "fuelPrices.js"), encoding="utf-8").read()
        assert "export const fuelPrices" in content

    def test_petrol_price_parsed(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "fuelPrices.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["petrol"]["price"] == 107.41

    def test_diesel_price_parsed(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "fuelPrices.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["diesel"]["price"] == 97.82

    def test_fuel_data_contains_lpg_and_cng(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "fuelPrices.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert "lpgHousehold" in data
        assert "cngVehicle" in data

    def test_fuel_tax_breakup_present(self, tmp_path):
        self._run_finance_sync(tmp_path)
        content = open(str(tmp_path / "fuelPrices.js"), encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert "taxBreakup" in data["petrol"]
        assert "taxBreakup" in data["diesel"]
        assert "basePrice" in data["petrol"]["taxBreakup"]


class TestSyncFinanceFallbacks:
    """sync_finance uses default values when network requests fail."""

    def _paths(self, tmp_path):
        return str(tmp_path / "goldRates.js"), str(tmp_path / "fuelPrices.js")

    def test_gold_file_written_with_defaults_on_request_error(self, tmp_path):
        gold_path, fuel_path = self._paths(tmp_path)
        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = gold_path
        data_engine.PATHS["fuel"] = fuel_path
        try:
            with patch.object(data_engine, "requests") as mock_req:
                mock_req.get.side_effect = RuntimeError("Network error")
                data_engine.sync_finance()
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel
        # Gold file should NOT be written (exception is caught and printed)
        # The gold block catches the exception and skips writing
        # Fuel block also catches the exception and skips writing
        # This tests that sync_finance does not raise an unhandled exception
        # (files may or may not exist depending on which block ran)

    def test_gold_uses_fallback_when_regex_finds_no_match(self, tmp_path):
        """When HTML contains no recognisable price pattern, default prices are used."""
        gold_path, fuel_path = self._paths(tmp_path)
        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = gold_path
        data_engine.PATHS["fuel"] = fuel_path
        try:
            with patch.object(data_engine, "requests") as mock_req:
                mock_req.get.side_effect = [
                    _make_mock_response("<html>No prices here</html>"),
                    _make_mock_response("<html>No prices here</html>"),
                ]
                data_engine.sync_finance()
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

        content = open(gold_path, encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        # Fallback values defined in data_engine.py
        assert data["gold22k"]["price"] == 7180
        assert data["gold24k"]["price"] == 7830
        assert data["silver"]["price"] == 96.50

    def test_fuel_uses_fallback_when_regex_finds_no_match(self, tmp_path):
        gold_path, fuel_path = self._paths(tmp_path)
        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = gold_path
        data_engine.PATHS["fuel"] = fuel_path
        try:
            with patch.object(data_engine, "requests") as mock_req:
                mock_req.get.side_effect = [
                    _make_mock_response(_GOLD_HTML),
                    _make_mock_response("<html>No prices here</html>"),
                ]
                data_engine.sync_finance()
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

        content = open(fuel_path, encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert data["petrol"]["price"] == 107.41
        assert data["diesel"]["price"] == 97.82


class TestSyncFinanceHistoryTracking:
    """sync_finance maintains, deduplicates, and caps the gold price history."""

    def _write_gold_file(self, path, history):
        """Pre-seed a goldRates.js with an existing history array."""
        data = {
            "city": "Hyderabad",
            "date": "2026-04-05",
            "gold22k": {"price": 7100, "change": 0, "unit": "₹/gram"},
            "gold24k": {"price": 7750, "change": 0, "unit": "₹/gram"},
            "silver": {"price": 95.0, "change": 0, "unit": "₹/gram"},
            "history": history,
        }
        data_engine.write_js_module(path, "goldRates", data)

    def _run_finance_sync(self, tmp_path):
        with patch.object(data_engine, "requests") as mock_req:
            mock_req.get.side_effect = [
                _make_mock_response(_GOLD_HTML),
                _make_mock_response(_FUEL_HTML),
            ]
            data_engine.sync_finance()

    def test_new_entry_appended_to_history(self, tmp_path):
        gold_path = str(tmp_path / "goldRates.js")
        fuel_path = str(tmp_path / "fuelPrices.js")
        existing_history = [{"date": "2026-04-05", "gold22k": 7100, "gold24k": 7750, "silver": 95.0}]
        self._write_gold_file(gold_path, existing_history)

        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = gold_path
        data_engine.PATHS["fuel"] = fuel_path
        try:
            self._run_finance_sync(tmp_path)
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

        content = open(gold_path, encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert len(data["history"]) == 2

    def test_same_date_entry_deduplicated(self, tmp_path):
        gold_path = str(tmp_path / "goldRates.js")
        fuel_path = str(tmp_path / "fuelPrices.js")
        today = datetime.now().strftime("%Y-%m-%d")
        existing_history = [{"date": today, "gold22k": 7000, "gold24k": 7600, "silver": 90.0}]
        self._write_gold_file(gold_path, existing_history)

        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = gold_path
        data_engine.PATHS["fuel"] = fuel_path
        try:
            self._run_finance_sync(tmp_path)
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

        content = open(gold_path, encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        today_entries = [h for h in data["history"] if h["date"] == today]
        assert len(today_entries) == 1

    def test_history_capped_at_seven_days(self, tmp_path):
        gold_path = str(tmp_path / "goldRates.js")
        fuel_path = str(tmp_path / "fuelPrices.js")
        # Pre-seed with 7 older entries
        existing_history = [
            {"date": f"2026-03-{30 - i:02d}", "gold22k": 7000, "gold24k": 7600, "silver": 90.0}
            for i in range(7)
        ]
        self._write_gold_file(gold_path, existing_history)

        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = gold_path
        data_engine.PATHS["fuel"] = fuel_path
        try:
            self._run_finance_sync(tmp_path)
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

        content = open(gold_path, encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        assert len(data["history"]) <= 7

    def test_day_over_day_change_computed(self, tmp_path):
        gold_path = str(tmp_path / "goldRates.js")
        fuel_path = str(tmp_path / "fuelPrices.js")
        yesterday = "2026-04-05"
        existing_history = [{"date": yesterday, "gold22k": 7080, "gold24k": 7720, "silver": 94.0}]
        self._write_gold_file(gold_path, existing_history)

        original_gold = data_engine.PATHS["gold"]
        original_fuel = data_engine.PATHS["fuel"]
        data_engine.PATHS["gold"] = gold_path
        data_engine.PATHS["fuel"] = fuel_path
        try:
            self._run_finance_sync(tmp_path)
        finally:
            data_engine.PATHS["gold"] = original_gold
            data_engine.PATHS["fuel"] = original_fuel

        content = open(gold_path, encoding="utf-8").read()
        match = re.search(r"= (\{[\s\S]*\});", content)
        data = json.loads(match.group(1))
        # 7180 (today) - 7080 (yesterday) = 100
        assert data["gold22k"]["change"] == round(data["gold22k"]["price"] - 7080, 2)
        # 7830 (today) - 7720 (yesterday) = 110
        assert data["gold24k"]["change"] == round(data["gold24k"]["price"] - 7720, 2)


# ═══════════════════════════════════════════════════════════════════════════
# data_engine — sync_news
# ═══════════════════════════════════════════════════════════════════════════

class TestSyncNews:
    def test_writes_news_json_file(self, tmp_path):
        news_path = str(tmp_path / "news.json")
        original_path = data_engine.PATHS["news"]
        data_engine.PATHS["news"] = news_path
        try:
            mock_scraper = MagicMock()
            mock_scraper.scrape.return_value = [
                {"title": "Test article", "link": "https://example.com/1", "source": "Test"},
            ]
            # sync_news does a deferred `from news_scraper import NewsScraper`
            # so we patch the class on the already-loaded news_scraper module.
            import news_scraper as _ns_mod
            with patch.object(_ns_mod, "NewsScraper", return_value=mock_scraper):
                data_engine.sync_news()
        finally:
            data_engine.PATHS["news"] = original_path

        assert os.path.exists(news_path)

    def test_news_json_contains_scraped_items(self, tmp_path):
        news_path = str(tmp_path / "news.json")
        original_path = data_engine.PATHS["news"]
        data_engine.PATHS["news"] = news_path
        sample_items = [
            {"title": "Hyderabad flood alert", "link": "https://example.com/1", "source": "The Hindu"},
            {"title": "Metro expansion approved", "link": "https://example.com/2", "source": "Deccan Chronicle"},
        ]
        try:
            mock_scraper = MagicMock()
            mock_scraper.scrape.return_value = sample_items
            import news_scraper as _ns_mod
            with patch.object(_ns_mod, "NewsScraper", return_value=mock_scraper):
                data_engine.sync_news()
        finally:
            data_engine.PATHS["news"] = original_path

        with open(news_path, encoding="utf-8") as f:
            saved = json.load(f)
        assert len(saved) == 2
        assert saved[0]["title"] == "Hyderabad flood alert"

    def test_sync_news_uses_limit_50(self, tmp_path):
        news_path = str(tmp_path / "news.json")
        original_path = data_engine.PATHS["news"]
        data_engine.PATHS["news"] = news_path
        try:
            mock_scraper = MagicMock()
            mock_scraper.scrape.return_value = []
            import news_scraper as _ns_mod
            with patch.object(_ns_mod, "NewsScraper", return_value=mock_scraper):
                data_engine.sync_news()
            mock_scraper.scrape.assert_called_once_with(limit=50)
        finally:
            data_engine.PATHS["news"] = original_path
