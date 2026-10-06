"""
tech_pulse.py: Tech & AI Pulse feed for a civic portal.

Shared byte for byte by telangana.live and vizag.live (see
docs/DATA_STANDARDS.md); the region is a parameter, never a fork. Keep the
two copies identical: change one, copy it to the other.

What it publishes, per region, in three categories:

  safety  AI scams, cyber fraud and digital-safety warnings
  govt    government AI / digital programmes, policy, investment
  jobs    tech and AI jobs, hiring and skilling

Every item is a real, dated article: title, outlet, link and the feed's own
publication time. Nothing is generated or summarised, and nothing older than
MAX_AGE_DAYS is kept. An empty category is published as empty, and the page
says so.

Judgment vs rules, following core/alert_triage.py:
  * rules in code: freshness, de-duplication, caps, thresholds
  * judgment via TypeSafe: which category (if any) and whether the story is
    actually about the region. Google News answers "Telangana AI" queries
    with national stories, so a keyword hit is not enough.
  * keyword fallback when TYPESAFE_API_KEY is absent or the call fails.
    Each item records which method admitted it.

Usage:
  python backend/scripts/tech_pulse.py --region telangana
  python backend/scripts/tech_pulse.py --region vizag --out path/to/tech_pulse.json
"""
import argparse
import datetime
import hashlib
import json
import logging
import os
import re
import sys
import urllib.parse
from collections.abc import Callable
from dataclasses import dataclass

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_SCRIPTS_DIR)
_REPO_ROOT = os.path.dirname(_BACKEND_DIR)

try:
    # backend/.env first (wins on conflicts), then the repo-root .env fills gaps.
    from dotenv import load_dotenv

    load_dotenv(os.path.join(_BACKEND_DIR, ".env"))
    load_dotenv(os.path.join(_REPO_ROOT, ".env"), override=False)
except ImportError:  # pragma: no cover
    pass

try:
    from typesafe_sdk import Choice, Noul, TypeSafeClient
except ImportError:  # pragma: no cover - exercised via _get_client() returning None
    Choice = Noul = TypeSafeClient = None

logger = logging.getLogger(__name__)


# ── Policy ────────────────────────────────────────────────────────────────────

MAX_AGE_DAYS = 14
MAX_ITEMS_PER_CATEGORY = 6
ENTRIES_PER_QUERY = 10

# Calibrated against tools/calibrate_tech_pulse.py; see that file for the run.
MIN_CATEGORY_CONFIDENCE = 0.70
MIN_REGION_PROBABILITY = 0.60
# One event is reported by several outlets in different words ("Telangana to
# bring AI into driving tests" / "...plans AI-powered cameras for driving
# tests" share 3 of 13 words), so sameness is judged, not string-matched.
MIN_SAME_STORY_PROBABILITY = 0.70

CATEGORIES = ("safety", "govt", "jobs")
NOT_RELEVANT = "none"

DEFAULT_OUT = os.path.join(_REPO_ROOT, "frontend", "public", "data", "tech_pulse.json")

_GOOGLE_NEWS = "https://news.google.com/rss/search?q={q}&hl=en-IN&gl=IN&ceid=IN:en"
_ISO = "%Y-%m-%dT%H:%M:%SZ"


# ── Regions ───────────────────────────────────────────────────────────────────

REGIONS = {
    "telangana": {
        "name": "Telangana",
        "scope": "Telangana state or Hyderabad",
        "keywords": (
            "telangana", "hyderabad", "cyberabad", "secunderabad", "warangal",
            "karimnagar", "khammam", "nizamabad", "rachakonda", "t-hub", "t hub",
            "tgcsb", "iiit hyderabad", "iiit-h", "hitec", "revanth",
        ),
        "queries": {
            "safety": ("Hyderabad cyber fraud AI voice clone",
                       "Telangana cyber crime deepfake scam",
                       "Cyberabad cyber crime advisory",
                       "TGCSB cyber security bureau Telangana"),
            "govt": ("Telangana AI policy",
                     "Telangana IT department AI",
                     "T-Hub Hyderabad",
                     "IndiaAI mission Telangana"),
            "jobs": ("Hyderabad AI jobs hiring",
                     "Telangana AI skilling TASK",
                     "IIIT Hyderabad AI",
                     "Hyderabad GCC tech jobs",
                     "Young India Skills University",
                     "Hyderabad IT layoffs freshers hiring"),
        },
    },
    "vizag": {
        "name": "Visakhapatnam",
        # Vizag-only safety news is thin; scam cases elsewhere in Andhra Pradesh
        # are the same scams reaching Vizag residents, so the state is in scope.
        "scope": "Visakhapatnam (Vizag) or Andhra Pradesh: an event in Vizag, "
                 "a state programme or policy, or a scam or cyber-crime case "
                 "anywhere in the state that people in Vizag should know about",
        "keywords": (
            "visakhapatnam", "vizag", "andhra pradesh", "andhra", "gvmc",
            "anakapalli", "vmrda", "andhra university", "rtgs", "lokesh",
            "chandrababu", "naidu",
        ),
        "queries": {
            "safety": ("Visakhapatnam cyber crime",
                       "Vizag cyber fraud",
                       "Andhra Pradesh cyber crime police advisory",
                       "Andhra Pradesh digital arrest scam"),
            "govt": ("Visakhapatnam AI data centre",
                     "Andhra Pradesh AI policy",
                     "Vizag IT hub",
                     "Andhra Pradesh RTGS AI governance"),
            "jobs": ("Visakhapatnam IT jobs",
                     "Vizag tech jobs hiring",
                     "Andhra Pradesh AI skilling",
                     "Andhra University AI",
                     "Andhra Pradesh IT jobs",
                     "APSSDC skill development AI"),
        },
    },
}


# ── Verdicts ──────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class Verdict:
    accepted: bool
    category: str | None
    method: str  # "typesafe" | "keyword"
    rejection_reason: str | None = None
    confidence: float | None = None
    region_probability: float | None = None


class FeedUnavailable(RuntimeError):
    """Every query failed: publishing would wrongly replace the feed with nothing."""


# ── Keyword fallback ──────────────────────────────────────────────────────────

_CATEGORY_KEYWORDS = {
    "safety": ("scam", "fraud", "cyber", "deepfake", "phishing", "digital arrest",
               "voice clone", "hacker", "hacked", "ransomware", "sextortion",
               "otp", "data breach", "fake app", "loan app"),
    "govt": ("policy", "mission", "government", "govt", "minister", "mou",
             "data centre", "data center", "it department", "e-governance",
             "rtgs", "initiative", "t-hub", "ai city", "investment"),
    "jobs": ("jobs", "job ", "hiring", "recruit", "skilling", "skill",
             "internship", "layoff", "gcc", "placement", "careers", "workforce",
             "training"),
}


def _matches(text: str, words) -> bool:
    return any(w in text for w in words)


def keyword_verdict(headline: str, query_category: str, region: str) -> Verdict:
    """Explicitly imprecise fallback: region keyword plus category keyword."""
    text = f" {(headline or '').lower()} "
    if not _matches(text, REGIONS[region]["keywords"]):
        return Verdict(False, None, "keyword", rejection_reason="not_region")

    order = (query_category,) + tuple(c for c in CATEGORIES if c != query_category)
    for category in order:
        if _matches(text, _CATEGORY_KEYWORDS[category]):
            return Verdict(True, category, "keyword")
    return Verdict(False, None, "keyword", rejection_reason="off_topic")


# ── TypeSafe judgment ─────────────────────────────────────────────────────────

CATEGORY_CRITERIA = {
    "safety": "A scam, fraud, cyber crime, deepfake, data breach, or a "
              "digital-safety warning or arrest that residents should know about.",
    "govt": "A government technology or AI programme, policy, partnership, "
            "investment, data centre, public digital service, or a state-backed "
            "incubator or innovation hub such as T-Hub.",
    "jobs": "Tech or AI jobs, hiring, layoffs, skilling or training "
            "programmes, internships, or campus placements.",
    NOT_RELEVANT: "None of these: for example general politics, crime with no "
                  "technology angle, entertainment, sports, gadget reviews, or "
                  "share-price news.",
}


def _build_questions(region: str):
    scope = REGIONS[region]["scope"]
    return {
        "category": Choice(
            instructions="Which section of a local Tech & AI news page does "
                         "`headline` belong in? Judge only the topic; where it "
                         "happened is asked separately.",
            criteria=CATEGORY_CRITERIA,
        ),
        "is_region": Noul(
            instructions=f"Is `headline` about {scope}? It counts when the event "
                         "happens there or the announcement specifically "
                         "targets people or institutions there. National or "
                         "international news that only mentions the place in "
                         "passing does not count.",
        ),
    }


_client = None
_client_resolved = False


def _get_client():
    """Lazily construct a shared TypeSafeClient, or None when unavailable."""
    global _client, _client_resolved
    if _client_resolved:
        return _client
    _client_resolved = True
    if TypeSafeClient is None:
        logger.info("typesafe_sdk not installed; using keyword fallback.")
    elif not os.getenv("TYPESAFE_API_KEY"):
        logger.info("TYPESAFE_API_KEY not set; using keyword fallback.")
    else:
        try:
            _client = TypeSafeClient()
        except Exception as exc:
            logger.warning("TypeSafeClient construction failed (%s); using keyword fallback.", exc)
    return _client


def apply_policy(result) -> Verdict:
    """Accept or reject from raw judgments. Pure code: retune without inference."""
    answer = result.choices["category"]
    region_p = result.nouls["is_region"].noul
    signals = {"confidence": answer.confidence, "region_probability": region_p}

    def reject(reason):
        return Verdict(False, None, "typesafe", rejection_reason=reason, **signals)

    if answer.choice == NOT_RELEVANT:
        return reject("off_topic")
    if answer.confidence < MIN_CATEGORY_CONFIDENCE:
        return reject("low_confidence")
    if region_p < MIN_REGION_PROBABILITY:
        return reject("not_region")
    return Verdict(True, answer.choice, "typesafe", **signals)


def judge_headline(headline: str, query_category: str, region: str) -> Verdict:
    client = _get_client()
    if client is None:
        return keyword_verdict(headline, query_category, region)
    try:
        result = client.system_one(state={"headline": headline},
                                   questions=_build_questions(region))
    except Exception as exc:
        logger.warning("TypeSafe failed for %r (%s); using keyword fallback.", headline[:60], exc)
        return keyword_verdict(headline, query_category, region)
    return apply_policy(result)


_STOPWORDS = frozenset(
    ["the", "and", "for", "with", "from", "that", "this", "into", "over", "after", "amid", "says", "will", "about", "plans", "their", "have", "been", "more", "than", "news"])


def _content_words(text: str) -> set:
    return {w for w in re.findall(r"[a-z0-9]+", text.lower())
            if len(w) > 3 and w not in _STOPWORDS}


def overlap_same_story(headline: str, kept: list) -> bool:
    """Fallback: most of the shorter headline's content words reappear."""
    words = _content_words(headline)
    for other in kept:
        other_words = _content_words(other)
        shared = len(words & other_words)
        smaller = min(len(words), len(other_words))
        # Three shared words at least: "Infosys hiring in Hyderabad" and
        # "Wipro hiring in Hyderabad" are different stories.
        if shared >= 3 and shared / smaller >= 0.6:
            return True
    return False


def same_story(headline: str, kept: list) -> bool:
    """Is `headline` another outlet's report of an event already listed?"""
    if not kept:
        return False
    client = _get_client()
    if client is None:
        return overlap_same_story(headline, kept)
    try:
        result = client.system_one(
            state={"headline": headline, "already_listed": "\n".join(kept)},
            questions={"same_story": Noul(
                instructions="Does `headline` report the same news event as one "
                             "of the headlines in `already_listed`? Different "
                             "outlets' wording of one event counts as the same. "
                             "A different event on a similar topic does not.")},
        )
    except Exception as exc:
        logger.warning("TypeSafe same-story check failed (%s); using word overlap.", exc)
        return overlap_same_story(headline, kept)
    return result.nouls["same_story"].noul >= MIN_SAME_STORY_PROBABILITY


# ── Feed helpers ──────────────────────────────────────────────────────────────

_IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30), "IST")
_MONTHS = ("Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")


def format_ist(moment: datetime.datetime) -> str:
    """'1 Oct, 3:00 PM IST', built by hand: strftime padding flags differ by OS."""
    local = moment.astimezone(_IST)
    hour = local.hour % 12 or 12
    meridiem = "AM" if local.hour < 12 else "PM"
    return f"{local.day} {_MONTHS[local.month - 1]}, {hour}:{local.minute:02d} {meridiem} IST"


def split_title(title: str):
    """Google News titles end in ' - Outlet'. Return (headline, outlet or None)."""
    match = re.match(r"^(.*\S)\s+-\s+([^-]+)$", (title or "").strip())
    if not match:
        return (title or "").strip(), None
    return match.group(1), match.group(2).strip()


def _published(entry) -> datetime.datetime | None:
    parsed = entry.get("published_parsed")
    if not parsed:
        return None
    try:
        return datetime.datetime(*tuple(parsed)[:6], tzinfo=datetime.timezone.utc)
    except (TypeError, ValueError):
        return None


def _entry_source(entry) -> str | None:
    source = entry.get("source")
    if isinstance(source, dict):
        return source.get("title")
    return getattr(source, "title", None)


def fetch_google_news(query: str) -> list:
    """Default fetcher. Raises when the feed could not be read at all."""
    import feedparser

    feed = feedparser.parse(_GOOGLE_NEWS.format(q=urllib.parse.quote(query)))
    if not feed.entries and getattr(feed, "bozo", False):
        raise OSError(f"feed unreadable: {getattr(feed, 'bozo_exception', 'unknown error')}")
    return list(feed.entries)


def _item_id(link: str, headline: str) -> str:
    return "tp-" + hashlib.sha1((link or headline).encode("utf-8"), usedforsecurity=False).hexdigest()[:12]


# ── Build ─────────────────────────────────────────────────────────────────────

def build_feed(region: str, *, fetch: Callable[[str], list] = fetch_google_news,
               judge: Callable[[str, str], Verdict] | None = None,
               is_same_story: Callable[[str, list], bool] | None = None,
               now: datetime.datetime | None = None) -> dict:
    config = REGIONS[region]  # KeyError for an unknown region, by design
    now = now or datetime.datetime.now(datetime.timezone.utc)
    judge = judge or (lambda headline, category: judge_headline(headline, category, region))
    is_same_story = is_same_story or same_story
    cutoff = now - datetime.timedelta(days=MAX_AGE_DAYS)

    buckets = {c: [] for c in CATEGORIES}
    seen = set()
    queries = [(c, q) for c in CATEGORIES for q in config["queries"][c]]
    failures = 0
    stats = {"stale": 0, "rejected": 0, "duplicate": 0}

    for query_category, query in queries:
        try:
            entries = fetch(query)
        except Exception as exc:
            failures += 1
            logger.warning("Query failed (%r): %s", query, exc)
            continue

        for entry in entries[:ENTRIES_PER_QUERY]:
            headline, outlet = split_title(entry.get("title", ""))
            link = entry.get("link", "")
            key = link or headline.lower()
            if not headline or key in seen:
                continue
            seen.add(key)  # the same story often answers several queries

            published = _published(entry)
            # The feed's own date decides age; a headline reads the same at any age.
            if published is None or published < cutoff:
                stats["stale"] += 1
                continue

            verdict = judge(headline, query_category)
            if not verdict.accepted:
                stats["rejected"] += 1
                continue

            buckets[verdict.category].append({
                "id": _item_id(link, headline),
                "category": verdict.category,
                "title": headline,
                "source": outlet or _entry_source(entry) or "Google News",
                "link": link,
                "publishedAt": published.strftime(_ISO),
                "time": format_ist(published),
                "method": verdict.method,
            })

    if queries and failures == len(queries):
        raise FeedUnavailable(f"all {failures} queries failed for {region}")

    for category in CATEGORIES:
        # Newest first, then keep each event once (its newest report) up to the cap.
        kept = []
        for item in sorted(buckets[category], key=lambda i: i["publishedAt"], reverse=True):
            if len(kept) == MAX_ITEMS_PER_CATEGORY:
                break
            if is_same_story(item["title"], [k["title"] for k in kept]):
                stats["duplicate"] += 1
                continue
            kept.append(item)
        buckets[category] = kept

    logger.info("%s: %s kept, %d stale, %d rejected, %d duplicate, %d/%d queries failed",
                region, {c: len(v) for c, v in buckets.items()}, stats["stale"],
                stats["rejected"], stats["duplicate"], failures, len(queries))

    return {
        "region": region,
        "regionName": config["name"],
        "generatedAt": now.strftime(_ISO),
        "maxAgeDays": MAX_AGE_DAYS,
        "categories": buckets,
    }


def write_if_changed(feed: dict, path: str) -> bool:
    """Write only when the items differ, so an unchanged run commits nothing.

    generatedAt alone changing is not a change (DATA_STANDARDS: no churn).
    """
    try:
        with open(path, encoding="utf-8") as fh:
            existing = json.load(fh)
    except (OSError, ValueError):
        existing = None

    def comparable(doc):
        return {k: v for k, v in doc.items() if k != "generatedAt"} if doc else None

    if comparable(existing) == comparable(feed):
        return False

    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(feed, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    return True


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    parser.add_argument("--region", required=True, choices=sorted(REGIONS))
    parser.add_argument("--out", default=DEFAULT_OUT)
    args = parser.parse_args(argv)
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    try:
        feed = build_feed(args.region)
    except FeedUnavailable as exc:
        logger.error("%s; leaving %s unchanged.", exc, args.out)
        return 1

    changed = write_if_changed(feed, args.out)
    logger.info("%s %s", "Wrote" if changed else "No change to", args.out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
