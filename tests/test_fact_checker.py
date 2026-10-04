"""
TL-07: the fact check must never pass an article it did not check.

It used to return {"credibility_score": 85, "is_fake_news_flag": False} when
the model was unavailable or its reply did not parse, so unchecked articles
were published as checked with a made-up score.

Run with:  pytest tests/test_fact_checker.py
"""
import os
import sys
from unittest.mock import MagicMock, patch

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend"))
sys.path.insert(0, os.path.join(repo_root, "backend", "scripts"))

import agents.fact_checker as fc  # noqa: E402


def _llm(text):
    llm = MagicMock()
    llm.gemini_available = True
    llm.generate.return_value = {"text": text}
    return llm


def test_unavailable_model_means_unchecked_not_passed():
    with patch.object(fc, "llm", None):
        v = fc.NewsFactChecker().check_news_item("t", "d")
    assert v.checked is False
    assert v.credibility_score is None
    assert v.is_fake is None


def test_unparseable_reply_means_unchecked():
    with patch.object(fc, "llm", _llm("I think it is fine")):
        v = fc.NewsFactChecker().check_news_item("t", "d")
    assert v.checked is False and v.error


def test_out_of_range_score_means_unchecked():
    reply = '{"credibility_score": 140, "is_fake_news_flag": false, "civic_action_required": false, "reasoning": "x"}'
    with patch.object(fc, "llm", _llm(reply)):
        v = fc.NewsFactChecker().check_news_item("t", "d")
    assert v.checked is False


def test_valid_reply_is_a_typed_verdict():
    reply = '```json\n{"credibility_score": 72, "is_fake_news_flag": true, "civic_action_required": false, "reasoning": "Unsourced claim"}\n```'
    with patch.object(fc, "llm", _llm(reply)):
        v = fc.NewsFactChecker().check_news_item("t", "d")
    assert (v.checked, v.is_fake, v.credibility_score, v.civic_action_required) == (True, True, 72, False)


def test_scraper_marks_unchecked_articles_and_invents_no_score():
    import news_scraper
    unchecked = fc.FactCheckVerdict(checked=False, error="model unavailable")
    checker = MagicMock()
    checker.check_news_item.return_value = unchecked
    with patch.object(news_scraper, "fact_checker", checker):
        item = news_scraper._fact_check_article({"title": "t", "description": "d"})
    assert item["fact_checked"] is False
    assert "credibility_score" not in item


def test_scraper_drops_articles_judged_fake():
    import news_scraper
    checker = MagicMock()
    checker.check_news_item.return_value = fc.FactCheckVerdict(
        checked=True, is_fake=True, credibility_score=20, civic_action_required=False)
    with patch.object(news_scraper, "fact_checker", checker):
        assert news_scraper._fact_check_article({"title": "t", "description": "d"}) is None
