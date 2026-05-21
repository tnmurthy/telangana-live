import feedparser
import json
import os
import re
import collections
import time
from datetime import datetime
import sys

_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.insert(0, _BACKEND_DIR)
try:
    from agents.fact_checker import fact_checker
except ImportError:
    fact_checker = None

from core.news_classifier import classify_article, extract_image_url


# Load feeds from shared feeds.json (telangana + national only for scraper)
_FEEDS_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resources", "feeds.json")

def _load_feeds():
    try:
        with open(_FEEDS_JSON, encoding="utf-8") as f:
            data = json.load(f)
        feeds = {}
        # Prioritise telangana then national feeds for the news page
        for category in ("telangana", "national"):
            for item in data.get(category, []):
                feeds[item["source"]] = item["url"]
        return feeds
    except Exception as e:
        print(f"  ⚠️ Could not load feeds.json ({e}), using built-in fallbacks")
        return {
            "The Hindu - Hyderabad": "https://www.thehindu.com/news/cities/Hyderabad/feeder/default.rss",
            "Telangana Today": "https://telanganatoday.com/feed",
        }

FEEDS = _load_feeds()

# Resolve output path — write to the frontend data directory the React app reads
_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.abspath(os.path.join(_SCRIPTS_DIR, "..", ".."))
OUTPUT_FILE = os.path.abspath(os.path.join(_REPO_ROOT, "frontend", "src", "data", "news.json"))
# Fallback: old location
_LEGACY_FILE = OUTPUT_FILE


try:
    from google import genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False


class NewsScraper:
    # Delay between API calls (seconds).  Can be overridden via the
    # GEMINI_DELAY environment variable to avoid rate-limit errors.
    _summary_delay: float = float(os.environ.get("GEMINI_DELAY", "0.5"))

    def __init__(self):
        self.client = None
        if HAS_GENAI:
            self.api_key = os.environ.get("GOOGLE_API_KEY")
            if self.api_key:
                self.client = genai.Client(api_key=self.api_key)

    def clean_html(self, raw_html):
        if not raw_html:
            return ""
        return re.sub(r'<.*?>', '', raw_html).strip()

    def get_ai_summary(self, title, description, retries=2, base_delay=1.0):
        """Generate a 2-line AI summary with simple exponential back-off on failure."""
        if not self.client:
            return ""
        prompt = (
            "Summarize this news article in exactly 2 concise lines for a civic portal. "
            f"Title: {title}. Description: {description}"
        )
        delay = base_delay
        for attempt in range(retries + 1):
            try:
                response = self.client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=prompt,
                )
                return response.text.strip()
            except Exception as e:
                if attempt < retries:
                    print(f"AI Summary retry {attempt + 1}/{retries} after {delay}s: {e}")
                    time.sleep(delay)
                    delay *= 2
                else:
                    print(f"AI Summary Error (gave up after {retries} retries): {e}")
        return ""

    def scrape(self, limit=50):
        all_news = []
        seen_links = set()

        print(f"Starting scrape at {datetime.now()}...")

        for source, url in FEEDS.items():
            print(f"Fetching from {source}...")
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries:
                    if entry.link in seen_links:
                        continue

                    desc = self.clean_html(entry.get("summary", ""))
                    cat, reg = classify_article(entry.title, desc)
                    img = extract_image_url(entry)

                    item = {
                        "title": entry.title,
                        "link": entry.link,
                        "source": source,
                        "published": entry.get("published", datetime.now().strftime("%Y-%m-%d")),
                        "description": desc,
                        "category": cat,
                        "region": reg,
                        "image_url": img,
                        "ai_summary": "",
                        "tags": []
                    }

                    # Step 1: Execute Fact Checking Pipeline
                    if fact_checker:
                        print(f"Fact-checking: {entry.title[:40]}...")
                        verification = fact_checker.check_news_item(item["title"], item["description"])
                        
                        if verification.get("is_fake_news_flag", False):
                            print(f"🚨 REJECTED FAKE NEWS: {entry.title[:30]}... Reason: {verification.get('reasoning')}")
                            continue # Kill the item before it hits the DB
                        
                        item["credibility_score"] = verification.get("credibility_score", 85)
                        item["civic_action_required"] = verification.get("civic_action_required", False)
                        
                        if item["civic_action_required"]:
                            print(f"⚠️ CIVIC ACTION IDENTIFIED: Routing to Dashboards!")
                    
                    # Step 2: Generate AI summaries for all items
                    if self.client:
                        print(f"Generating AI Summary for: {entry.title[:40]}...")
                        item["ai_summary"] = self.get_ai_summary(item["title"], item["description"])
                        time.sleep(self._summary_delay)

                    all_news.append(item)
                    seen_links.add(entry.link)
            except Exception as e:
                print(f"Error fetching from {source}: {e}")

        return all_news[:50]


def run_scraper():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    scraper = NewsScraper()
    news = scraper.scrape()
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(news, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(news)} items to {OUTPUT_FILE}")
    # Also write to the legacy location if it exists
    try:
        if os.path.exists(os.path.dirname(_LEGACY_FILE)):
            os.makedirs(os.path.dirname(_LEGACY_FILE), exist_ok=True)
            with open(_LEGACY_FILE, "w", encoding="utf-8") as f:
                json.dump(news, f, indent=2, ensure_ascii=False)
    except Exception:
        pass


if __name__ == "__main__":
    run_scraper()

