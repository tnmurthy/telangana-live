"""
news_scraper.py — async feed fetch + batched AI summarization

Key changes vs the old version:
  • Feeds fetched concurrently via ThreadPoolExecutor (not sequentially)
  • AI summaries batched into a single LLM call (not one-per-article)
  • Uses the shared `llm` singleton — works with Groq/Gemini/any provider
  • Fact-checking runs concurrently over all articles after fetch
  • No more per-article time.sleep() delays
"""

import feedparser
import json
import os
import re
import sys
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.insert(0, _BACKEND_DIR)

try:
    from agents.fact_checker import fact_checker
except ImportError:
    fact_checker = None

from core.llm_provider import llm
from core.news_classifier import classify_article, extract_image_url
from core.clustering import cluster_articles
from core.correlation_engine import map_article_to_civic_entities

logger = logging.getLogger(__name__)

# ── Feed config ───────────────────────────────────────────────────────────────

_FEEDS_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resources", "feeds.json")

def _load_feeds() -> dict:
    try:
        with open(_FEEDS_JSON, encoding="utf-8") as f:
            data = json.load(f)
        feeds = {}
        for category in ("telangana", "districts", "national"):
            for item in data.get(category, []):
                feeds[item["source"]] = item["url"]
        return feeds
    except Exception as e:
        logger.warning("Could not load feeds.json (%s), using built-in fallbacks", e)
        return {
            "The Hindu - Hyderabad": "https://www.thehindu.com/news/cities/Hyderabad/feeder/default.rss",
            "Telangana Today": "https://telanganatoday.com/feed",
        }

FEEDS = _load_feeds()

# ── Output path ───────────────────────────────────────────────────────────────

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUTPUT_FILE = os.path.abspath(os.path.join(_REPO_ROOT, "frontend", "src", "data", "news.json"))

# ── Helpers ───────────────────────────────────────────────────────────────────

_TAG_RE = re.compile(r"<.*?>")

def _clean_html(raw: str) -> str:
    return _TAG_RE.sub("", raw).strip() if raw else ""


# ── Concurrent feed fetching ──────────────────────────────────────────────────

def _fetch_feed(source: str, url: str) -> tuple[str, list]:
    """Fetch and parse a single RSS feed. Returns (source, entries)."""
    try:
        feed = feedparser.parse(url)
        return source, feed.entries
    except Exception as e:
        logger.warning("Error fetching feed %s: %s", source, e)
        return source, []


def _fetch_all_feeds(max_workers: int = 10) -> dict[str, list]:
    """Fetch all configured feeds concurrently."""
    results: dict[str, list] = {}
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(_fetch_feed, src, url): src for src, url in FEEDS.items()}
        for future in as_completed(futures):
            source, entries = future.result()
            results[source] = entries
    return results


# ── Batched AI summarization ──────────────────────────────────────────────────

def _batch_summarize(articles: list[dict], batch_size: int = 20) -> list[str]:
    """
    Generate AI summaries for all articles in as few LLM calls as possible.

    Each batch is sent as a single prompt asking for N numbered summaries.
    Falls back to empty strings on any error so the pipeline never stalls.
    """
    summaries = [""] * len(articles)

    for batch_start in range(0, len(articles), batch_size):
        batch = articles[batch_start : batch_start + batch_size]
        numbered = "\n".join(
            f"{i + 1}. Title: {a['title']}\n   Description: {a['description'][:300]}"
            for i, a in enumerate(batch)
        )
        prompt = (
            f"You are a civic news summarizer. Below are {len(batch)} news article(s).\n"
            "For EACH article write exactly ONE 2-sentence summary suitable for a public civic portal.\n"
            "Reply ONLY with a numbered list matching the input order, e.g.:\n"
            "1. <summary>\n2. <summary>\n\n"
            f"Articles:\n{numbered}"
        )
        try:
            result = llm.generate(prompt, max_tokens=1500, temperature=0.3)
            text = result.get("text") or ""
            # Parse numbered lines out of the response
            parsed = _parse_numbered_list(text, expected=len(batch))
        except Exception as e:
            logger.warning("Batch summarization failed (batch %d): %s", batch_start, e)
            parsed = [""] * len(batch)

        for j, summary in enumerate(parsed):
            summaries[batch_start + j] = summary

    return summaries


def _parse_numbered_list(text: str, expected: int) -> list[str]:
    """Extract numbered items from LLM response; pad / truncate to `expected`."""
    lines = []
    for line in text.splitlines():
        stripped = line.strip()
        # Match "1. ..." or "1) ..."
        if re.match(r"^\d+[\.\)]\s+", stripped):
            content = re.sub(r"^\d+[\.\)]\s+", "", stripped)
            lines.append(content)
    # Pad with empty strings if LLM returned fewer than expected
    while len(lines) < expected:
        lines.append("")
    return lines[:expected]


# ── Concurrent fact-checking ──────────────────────────────────────────────────

def _fact_check_article(item: dict) -> dict | None:
    """
    Run fact-checking on a single article dict.
    Returns the enriched dict, or None if the article is rejected as fake news.
    """
    if not fact_checker:
        return item
    try:
        verification = fact_checker.check_news_item(item["title"], item["description"])
        if verification.get("is_fake_news_flag", False):
            logger.info("REJECTED fake news: %s", item["title"][:60])
            return None
        item["credibility_score"] = verification.get("credibility_score", 85)
        item["civic_action_required"] = verification.get("civic_action_required", False)
        if item["civic_action_required"]:
            logger.info("Civic action flagged: %s", item["title"][:60])
    except Exception as e:
        logger.warning("Fact-check error for '%s': %s", item["title"][:40], e)
    return item


# ── Main scraper ──────────────────────────────────────────────────────────────

class NewsScraper:

    def scrape(self, limit: int = 50) -> list[dict]:
        logger.info("Starting scrape at %s", datetime.now())
        print(f"Starting scrape at {datetime.now()}...")

        # ── Phase 1: Concurrent feed fetching ─────────────────────────────────
        print(f"Fetching {len(FEEDS)} feeds concurrently...")
        all_entries = _fetch_all_feeds()

        # ── Phase 2: Parse entries, deduplicate ───────────────────────────────
        seen_links: set[str] = set()
        raw_articles: list[dict] = []

        for source, entries in all_entries.items():
            for entry in entries:
                link = getattr(entry, "link", None)
                if not link or link in seen_links:
                    continue
                seen_links.add(link)

                desc = _clean_html(entry.get("summary", ""))
                cat, reg = classify_article(entry.title, desc)
                img = extract_image_url(entry)
                correlated = map_article_to_civic_entities(entry.title, desc)

                raw_articles.append({
                    "title": entry.title,
                    "link": link,
                    "source": source,
                    "published": entry.get("published", datetime.now().strftime("%Y-%m-%d")),
                    "description": desc,
                    "category": cat,
                    "region": reg,
                    "image_url": img,
                    "ai_summary": "",
                    "tags": [],
                    "correlated_civic_entities": correlated,
                })

        print(f"Collected {len(raw_articles)} unique articles across {len(FEEDS)} feeds.")

        # ── Phase 3: Concurrent fact-checking ─────────────────────────────────
        if fact_checker:
            print("Running concurrent fact-checking...")
            checked: list[dict] = []
            with ThreadPoolExecutor(max_workers=8) as pool:
                futures = [pool.submit(_fact_check_article, a) for a in raw_articles]
                for future in as_completed(futures):
                    result = future.result()
                    if result is not None:
                        checked.append(result)
            rejected = len(raw_articles) - len(checked)
            if rejected:
                print(f"  🚨 Rejected {rejected} articles flagged as fake news.")
            raw_articles = checked

        # ── Phase 4: Batched AI summarization ─────────────────────────────────
        print(f"Generating AI summaries for {len(raw_articles)} articles (batched)...")
        summaries = _batch_summarize(raw_articles)
        for article, summary in zip(raw_articles, summaries):
            article["ai_summary"] = summary

        # ── Phase 5: Cluster and cap ───────────────────────────────────────────
        clustered = cluster_articles(raw_articles)
        return clustered[:limit]


# ── Entry point ───────────────────────────────────────────────────────────────

def run_scraper():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    scraper = NewsScraper()
    news = scraper.scrape()
    if not news:
        print("  ⚠️ No news articles fetched (network or feeds offline). Skipping write.")
        return
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(news, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved {len(news)} articles to {OUTPUT_FILE}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    run_scraper()
