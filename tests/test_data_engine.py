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
