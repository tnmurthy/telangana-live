import feedparser
import json
import os
import re
import time
from datetime import datetime

# RSS feeds for Telangana news
FEEDS = {
    "The Hindu - Hyderabad": "https://www.thehindu.com/news/cities/Hyderabad/feeder/default.rss",
    "Deccan Chronicle": "https://www.deccanchronicle.com/rss_feed/rss/hyderabad",
    "Times of India - HYD": "https://timesofindia.indiatimes.com/rssfeeds/3903997.cms",
    "NDTV Telangana": "https://feeds.feedburner.com/ndtv/telangana",
    "Telangana Today": "https://telanganatoday.com/feed",
}

# Resolve output path relative to this file so the scraper works from any
# working directory (e.g. when invoked via subprocess from main.py).
_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(_SCRIPTS_DIR)
OUTPUT_FILE = os.path.join(_REPO_ROOT, "src", "data", "news.json")

try:
    from google import genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

class NewsScraper:
    def __init__(self):
        self.client = None
        if HAS_GENAI:
            self.api_key = os.environ.get("GOOGLE_API_KEY")
            if self.api_key:
                self.client = genai.Client(api_key=self.api_key)

    def clean_html(self, raw_html):
        if not raw_html: return ""
        return re.sub(r'<.*?>', '', raw_html).strip()

    def get_ai_summary(self, title, description, retries=2, base_delay=1.0):
        """Generate a 2-line AI summary with simple exponential back-off on failure."""
        if not self.model: return ""
        prompt = f"Summarize this news article in exactly 2 concise lines for a civic portal. Title: {title}. Description: {description}"
        delay = base_delay
        for attempt in range(retries + 1):
            try:
                response = self.model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                if attempt < retries:
                    print(f"AI Summary retry {attempt + 1}/{retries} after {delay}s: {e}")
                    time.sleep(delay)
                    delay *= 2
                else:
                    print(f"AI Summary Error (gave up after {retries} retries): {e}")
        return ""

    # Delay between API calls (seconds).  Can be overridden in the constructor
    # or set via the GEMINI_DELAY env variable to avoid rate-limit errors.
    _summary_delay: float = float(os.environ.get("GEMINI_DELAY", "0.5"))

    def scrape(self, limit=50):
    def get_ai_summary(self, title, description):
        if not self.client: return ""
        prompt = f"Summarize this news article in exactly 2 concise lines for a civic portal. Title: {title}. Description: {description}"
        try:
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt,
            )
            return response.text.strip()
        except Exception as e:
            print(f"AI Summary Error: {e}")
            return ""

    def scrape(self, limit=10):
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

                    item = {
                        "title": entry.title,
                        "link": entry.link,
                        "source": source,
                        "published": entry.get("published", datetime.now().strftime("%Y-%m-%d")),
                        "description": self.clean_html(entry.get("summary", "")),
                        "category": "General",
                        "region": "Telangana",
                        "ai_summary": "",
                        "tags": []
                    }

                    low_title = entry.title.lower()
                    if any(k in low_title for k in ["hyderabad", "ghmc", "banjara", "jubilee", "secunderabad"]):
                        item["region"] = "Hyderabad"
                    elif any(k in low_title for k in ["cyberabad", "hitec", "gachibowli", "kondapur", "madhapur"]):
                        item["region"] = "Cyberabad"
                    elif any(k in low_title for k in ["malkajgiri", "uppal", "alwal", "kapra"]):
                        item["region"] = "Malkajgiri"

                    if any(k in low_title for k in ["traffic", "metro", "rtc", "train", "road"]):
                        item["category"] = "Transit"
                    elif any(k in low_title for k in ["rain", "flood", "heat", "weather", "imd"]):
                        item["category"] = "Weather"
                    elif any(k in low_title for k in ["police", "crime", "robbery", "arrest"]):
                        item["category"] = "Safety"
                    elif any(k in low_title for k in ["school", "college", "exam", "result"]):
                        item["category"] = "Education"
                    elif any(k in low_title for k in ["gold", "silver", "stock", "market", "rupee"]):
                        item["category"] = "Finance"
                    elif any(k in low_title for k in ["hospital", "health", "covid", "dengue", "doctor"]):
                        item["category"] = "Health"

                    # Generate AI summaries for all items (with a configurable delay to avoid rate limits)
                    if self.model:
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
    news = scraper.scrape(limit=10)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(news, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(news)} items to {OUTPUT_FILE}")

if __name__ == "__main__":
    run_scraper()
