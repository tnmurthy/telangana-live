"""
TL-10: batched AI summaries must never land on the wrong article.

_batch_summarize asks the model for a numbered list of N summaries. The parser
used to keep lines in reply order and ignore their numbers, so a reply that
skipped item 3 attached summary 4 to article 3 and shifted every later one.
A batch whose numbering is not exactly 1..N is now discarded (no summary is
better than another article's summary).

Run with:  pytest tests/test_news_summaries.py
"""
import os
import sys

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend"))
sys.path.insert(0, os.path.join(repo_root, "backend", "scripts"))

from news_scraper import _parse_numbered_list  # noqa: E402


def _reply(numbers):
    return "\n".join(f"{n}. Summary for article {n}." for n in numbers)


def test_complete_reply_maps_each_summary_to_its_number():
    assert _parse_numbered_list(_reply([1, 2, 3]), expected=3) == [
        "Summary for article 1.", "Summary for article 2.", "Summary for article 3."]


def test_out_of_order_reply_is_placed_by_number():
    assert _parse_numbered_list(_reply([2, 1, 3]), expected=3) == [
        "Summary for article 1.", "Summary for article 2.", "Summary for article 3."]


def test_reply_missing_one_item_discards_the_batch():
    numbers = [n for n in range(1, 21) if n != 7]  # 19 of 20
    assert _parse_numbered_list(_reply(numbers), expected=20) == [""] * 20


def test_reply_with_extra_or_repeated_numbers_discards_the_batch():
    assert _parse_numbered_list(_reply([1, 2, 2]), expected=3) == [""] * 3
    assert _parse_numbered_list(_reply([1, 2, 3, 4]), expected=3) == [""] * 3


def test_parenthesised_numbers_are_accepted():
    text = "1) First.\n2) Second."
    assert _parse_numbered_list(text, expected=2) == ["First.", "Second."]
