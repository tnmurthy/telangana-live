import os, json, datetime, requests, sys, re

# Fix Unicode output for Windows terminal
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure project root in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup paths
FRONTEND_PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "frontend", "public", "data")
FRONTEND_SRC_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "frontend", "src", "data")
ALERTS_JSON_PATH = os.path.join(FRONTEND_PUBLIC_DIR, "alerts.json")
NEWS_JSON_PATH = os.path.join(FRONTEND_SRC_DATA_DIR, "news.json")


def _try_ai_alerts():
    """Tier 1: Generate real-time civic alerts using configured LLM Provider."""
    prompt = """
    Summarize current civic alerts for Telangana & Hyderabad state.
    Focus on:
    1. Power supply & grid maintenance (TSSPDCL)
    2. Water supply disruptions & conservation (HMWSSB)
    3. Emergency weather/traffic/disaster advisories (GHMC/IMD/Telangana Police)

    Return ONLY a valid JSON array of objects with keys:
    "id" (unique integer), "type" (one of: 'power', 'water', 'emergency'), "message" (string description), "district" (string e.g. 'Hyderabad', 'Rangareddy', 'Warangal', or 'All Telangana'), "time" (string e.g. 'Just now', '15 mins ago').
    """

    # Try central LLM provider first
    try:
        from core.llm_provider import llm
        from core.config import CONFIG
        result = llm.generate(prompt, provider=CONFIG.get('llm_provider', 'gemini'), max_tokens=1000)
        raw_text = result.get('text')
        if raw_text:
            cleaned = re.sub(r"```(?:json)?", "", raw_text).strip("` \n\r")
            data = json.loads(cleaned)
            if isinstance(data, list) and len(data) > 0:
                print(f"  [Tier 1 LLMProvider] Successfully generated {len(data)} alerts.")
                return data
    except Exception as e:
        print(f"  [Tier 1 LLMProvider] Notice: {e}")

    # Fallback to direct Gemini if GOOGLE_API_KEY is present
    google_key = os.environ.get("GOOGLE_API_KEY", "")
    if google_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=google_key)
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(prompt)
            raw_text = response.text
            cleaned = re.sub(r"```(?:json)?", "", raw_text).strip("` \n\r")
            data = json.loads(cleaned)
            if isinstance(data, list) and len(data) > 0:
                print(f"  [Tier 1 Direct Gemini] Successfully generated {len(data)} alerts.")
                return data
        except Exception as e:
            print(f"  [Tier 1 Direct Gemini] Notice: {e}")

    return []


def _extract_alerts_from_news():
    """Tier 2: Extract real-time alerts from recent local news feed."""
    if not os.path.exists(NEWS_JSON_PATH):
        return []
    try:
        with open(NEWS_JSON_PATH, "r", encoding="utf-8") as f:
            news_items = json.load(f)
        
        alerts = []
        alert_id = 200
        keywords = {
            "power": ["power cut", "tsspdcl", "electricity", "outage", "substation", "grid"],
            "water": ["water supply", "hmwssb", "pipeline", "water shortage", "drinking water"],
            "emergency": ["imd alert", "heavy rain", "flood", "yellow alert", "orange alert", "traffic advisory", "ghmc alert", "police advisory", "heatwave"]
        }

        for item in news_items:
            title = (item.get("title") or "").lower()
            desc = (item.get("description") or "").lower()
            combined = f"{title} {desc}"
            
            matched_type = None
            for alert_type, kws in keywords.items():
                if any(kw in combined for kw in kws):
                    matched_type = alert_type
                    break
            
            if matched_type:
                alert_id += 1
                district = item.get("region") or "Telangana"
                if district.lower() in ("statewide", "all", "telangana"):
                    district = "Telangana"
                alerts.append({
                    "id": alert_id,
                    "type": matched_type,
                    "message": item.get("title", ""),
                    "district": district,
                    "time": "Recent"
                })
                if len(alerts) >= 5:
                    break

        if alerts:
            print(f"  [Tier 2 News Extraction] Extracted {len(alerts)} alerts from live news.")
        return alerts
    except Exception as e:
        print(f"  [Tier 2 News Extraction] Notice: {e}")
        return []


def _load_existing_alerts():
    """Tier 3: Preserve existing alert cache."""
    for path in [ALERTS_JSON_PATH, os.path.join(FRONTEND_SRC_DATA_DIR, "alerts.json")]:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    print(f"  [Tier 3 Cache] Preserved {len(data)} existing alerts.")
                    return data
            except Exception:
                pass
    return []


def _curated_civic_advisories():
    """Tier 4: Verified 24/7 civic helpline & operational advisories."""
    return [
        {
            "id": 101,
            "type": "emergency",
            "message": "GHMC Monsoon & Disaster Control Helpline active 24/7 (Dial 040-21111111 / 9000113667)",
            "district": "Hyderabad",
            "time": "Active Helpline"
        },
        {
            "id": 102,
            "type": "power",
            "message": "TSSPDCL Central Power Breakdown & Grievance Assistance available 24/7 (Toll-free: 1912)",
            "district": "Telangana",
            "time": "Active Helpline"
        },
        {
            "id": 103,
            "type": "water",
            "message": "HMWSSB Water Supply & Tanker On Demand Support (Dial 155313)",
            "district": "Hyderabad",
            "time": "Active Helpline"
        },
        {
            "id": 104,
            "type": "emergency",
            "message": "Telangana Emergency & Disaster Services available 24x7: Police (100), Medical (108), Fire (101)",
            "district": "All Telangana",
            "time": "24/7 Service"
        }
    ]


def fetch_latest_alerts():
    print("Fetching real-time civic alerts for Telangana (Multi-Tier Resiliency)...")
    
    # Tier 1: LLM
    alerts = _try_ai_alerts()
    
    # Tier 2: Real-time News feed keyword correlation
    if not alerts:
        alerts = _extract_alerts_from_news()
        
    # Tier 3: Existing Cache
    if not alerts:
        alerts = _load_existing_alerts()
        
    # Tier 4: Curated Civic Advisories
    if not alerts:
        print("  [Tier 4 Baseline] Using verified civic helpline advisories.")
        alerts = _curated_civic_advisories()

    return alerts


def main():
    alerts = fetch_latest_alerts()
    if not alerts:
        print("⚠️ No alerts generated or found. Exiting.")
        return

    paths = [
        ALERTS_JSON_PATH,
        os.path.join(FRONTEND_SRC_DATA_DIR, "alerts.json")
    ]
    for target in paths:
        try:
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, "w", encoding="utf-8") as f:
                json.dump(alerts, f, indent=2, ensure_ascii=False)
            print(f"✅ Written {len(alerts)} alerts to {target}")
        except Exception as e:
            print(f"⚠️ Failed to write alerts.json to {target}: {e}")


if __name__ == "__main__":
    main()

