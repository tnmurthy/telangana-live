import feedparser
import json
import os
import re
import time
from datetime import datetime
import google.generativeai as genai

class NewsScraper:
    def __init__(self):
        self.api_key = os.environ.get("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def clean_html(self, raw_html):
        if not raw_html: return ""
        cleanr = re.compile('<.*?>')
        cleantext = re.sub(cleanr, '', raw_html)
        return cleantext.strip()

    def get_ai_summary(self, title, description):
        if not self.model: return ""
        prompt = f"Summarize this news article in exactly 2 concise lines for a civic portal. Title: {title}. Description: {description}"
        try:
            response = self.model.generate_content(prompt)
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

                    if len(all_news) < limit:
                        print(f"Generating AI Summary for: {entry.title[:30]}...")
                        item["ai_summary"] = self.get_ai_summary(item["title"], item["description"])
                        time.sleep(0.5)

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
