import feedparser
import json
import os
import re
import time
from datetime import datetime
import google.generativeai as genai

# Setup Gemini - expects GOOGLE_API_KEY environment variable
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# Aggregation Config
FEEDS = {
    "The Hindu (Hyderabad)": "https://www.thehindu.com/news/cities/feeder/default.rss",
    "Times of India (Telangana)": "https://timesofindia.indiatimes.com/rssfeeds/7951253.cms",
    "Times of India (Hyderabad)": "https://timesofindia.indiatimes.com/rssfeeds/-2128816474.cms",
    "Eenadu (General)": "https://www.eenadu.net/feed",
    "Sakshi (General)": "https://www.sakshi.com/feed"
}

OUTPUT_FILE = "src/data/news.json"

def clean_html(raw_html):
    """Remove HTML tags from summary/description."""
    if not raw_html: return ""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext.strip()

def get_ai_summary(title, description):
    """Generate a 2-line summary using Gemini."""
    if not os.environ.get("GOOGLE_API_KEY"):
        return ""
    
    prompt = f"Summarize this news article in exactly 2 concise lines for a civic portal. Title: {title}. Description: {description}"
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"AI Summary Error: {e}")
        return ""

def scrape_feeds():
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
                
                # Basic Metadata
                item = {
                    "title": entry.title,
                    "link": entry.link,
                    "source": source,
                    "published": entry.get("published", datetime.now().strftime("%Y-%m-%d")),
                    "description": clean_html(entry.get("summary", "")),
                    "category": "General", # Default, refined by AI/NLP later
                    "region": "Telangana", # Default
                    "ai_summary": "", # Placeholder for Gemini
                    "tags": []
                }
                
                # Region detection (Simple Keyword Match)
                low_title = entry.title.lower()
                if any(k in low_title for k in ["hyderabad", "ghmc", "banjara", "jubilee", "secunderabad"]):
                    item["region"] = "Hyderabad"
                elif any(k in low_title for k in ["cyberabad", "hitec", "gachibowli", "kondapur", "madhapur"]):
                    item["region"] = "Cyberabad"
                elif any(k in low_title for k in ["malkajgiri", "uppal", "alwal", "kapra"]):
                    item["region"] = "Malkajgiri"

                # Category detection
                if any(k in low_title for k in ["traffic", "metro", "rtc", "train", "road"]):
                    item["category"] = "Transit"
                elif any(k in low_title for k in ["rain", "flood", "heat", "weather", "imd"]):
                    item["category"] = "Weather"
                elif any(k in low_title for k in ["police", "crime", "robbery", "arrest"]):
                    item["category"] = "Safety"
                elif any(k in low_title for k in ["school", "college", "exam", "result"]):
                    item["category"] = "Education"

                # Get AI Summary (Limited for cost/quota during run)
                # In production, we'd only do this for new items
                if len(all_news) < 10: # Just for the most recent few
                    print(f"Generating AI Summary for: {entry.title[:30]}...")
                    item["ai_summary"] = get_ai_summary(item["title"], item["description"])
                    time.sleep(1) # Rate limit friendly

                all_news.append(item)
                seen_links.add(entry.link)
        except Exception as e:
            print(f"Error fetching from {source}: {e}")

    # Sort by date (if available) - Simple descending order
    # In a full impl, we'd parse the date string properly
    all_news = all_news[:50] # Keep top 50 for performance

    # Save to JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_news, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully saved {len(all_news)} items to {OUTPUT_FILE}")

if __name__ == "__main__":
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    scrape_feeds()
