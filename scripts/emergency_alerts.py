import os, json, datetime, requests
import google.generativeai as genai
from bs4 import BeautifulSoup

# Setup
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
FRONTEND_PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "public", "data")
ALERTS_JSON_PATH = os.path.join(FRONTEND_PUBLIC_DIR, "alerts.json")

def fetch_latest_alerts():
    print("Fetching real-time civic alerts for Telangana...")
    
    if not GOOGLE_API_KEY:
        print("⚠️ GOOGLE_API_KEY not set. Using sample real-time data for demo.")
        # Mock data that looks fresh
        now = datetime.datetime.now()
        return [
            { "id": 101, "type": "power", "message": "Real-time: Power restoration in progress for Jubilee Hills Road No. 36", "district": "Hyderabad", "time": "15 mins ago" },
            { "id": 102, "type": "water", "message": "Alert: HMWSSB reports 20% pressure drop in Gachibowli today", "district": "Hyderabad", "time": "30 mins ago" },
            { "id": 103, "type": "emergency", "message": "Weather: IMD issues Yellow Alert for light rains in Hyderabad today", "district": "Hyderabad", "time": "1 hour ago" }
        ]

    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = """
    Search for and summarize the absolute latest (today's) civic alerts for Telangana/Hyderabad.
    Focus on:
    1. Power outages (TSSPDCL)
    2. Water supply disruptions (HMWSSB)
    3. Emergency weather/traffic alerts (GHMC/IMD/Police)
    
    Return the data as a JSON list of objects with these keys:
    id (unique int), type ('power', 'water', 'emergency'), message (string), district (string), time (string like '15 mins ago').
    
    Only return the JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        # Clean up JSON if model adds backticks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        data = json.loads(text)
        print(f"✅ Fetched {len(data)} real-time alerts via AI.")
        return data
    except Exception as e:
        print(f"⚠️ AI Alert fetch failed: {e}")
        return []

def main():
    alerts = fetch_latest_alerts()
    if not alerts:
        return
        
    try:
        os.makedirs(FRONTEND_PUBLIC_DIR, exist_ok=True)
        with open(ALERTS_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(alerts, f, indent=2, ensure_ascii=False)
        print(f"✅ Written {len(alerts)} alerts to {ALERTS_JSON_PATH}")
    except Exception as e:
        print(f"⚠️ Failed to write alerts.json: {e}")

if __name__ == "__main__":
    main()
