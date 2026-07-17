from fastapi import APIRouter, HTTPException, Query
import os
import json
import sys

# Ensure backend/scripts is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts")))

from news_scraper import run_scraper
from emergency_alerts import fetch_latest_alerts

router = APIRouter(prefix="/api/civic", tags=["Civic Gateway"])

# Paths
REO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
NEWS_FILE = os.path.join(REO_ROOT, "frontend", "src", "data", "news.json")
ALERTS_FILE = os.path.join(REO_ROOT, "frontend", "public", "data", "alerts.json")

@router.get("/news")
def get_news(district: str = Query(None, description="Filter news by district (e.g. Hyderabad, Medchal)")):
    """Returns the latest aggregated news for Telangana, with optional district filtering."""
    if not os.path.exists(NEWS_FILE):
        # Trigger scraper if file doesn't exist (MVP behavior)
        try:
            run_scraper()
        except Exception as e:
             raise HTTPException(status_code=500, detail=f"Failed to run scraper: {str(e)}")

    try:
        with open(NEWS_FILE, "r", encoding="utf-8") as f:
            news = json.load(f)
        
        if district:
            # Simple substring match for district in region or description
            news = [n for n in news if district.lower() in (n.get("region") or "").lower() or district.lower() in n.get("description", "").lower()]
            
        return news
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts")
def get_alerts(district: str = Query(None, description="Filter alerts by district")):
    """Returns real-time emergency alerts (power, water, weather)."""
    # For MVP, we fetch fresh alerts via AI if possible, or fall back to cached file
    try:
        alerts = fetch_latest_alerts()
        if not alerts and os.path.exists(ALERTS_FILE):
            with open(ALERTS_FILE, "r", encoding="utf-8") as f:
                alerts = json.load(f)
        
        if district:
            alerts = [a for a in alerts if district.lower() in (a.get("district") or "").lower()]
            
        return alerts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/services")
def get_services(district: str = Query(None)):
    """Returns a registry of government services available in the specified district."""
    # Placeholder service registry
    services = [
        {"id": "ghmc-tax", "name": "GHMC Property Tax", "category": "Utility", "url": "https://www.ghmc.gov.in/"},
        {"id": "hmwssb-bill", "name": "Water Bill Payment", "category": "Utility", "url": "https://www.hyderabadwater.gov.in/"},
        {"id": "tsspdcl-power", "name": "Electricity Services", "category": "Utility", "url": "https://www.tssouthernpower.com/"},
        {"id": "e-seva", "name": "Meeseva / e-Seva", "category": "Government", "url": "https://ts.meeseva.telangana.gov.in/"}
    ]
    return services
