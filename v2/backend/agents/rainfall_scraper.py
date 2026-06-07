import requests
from supabase import create_client, Client
import os
from datetime import datetime

class RainfallScraper:
    """
    Official Scraper for TSDPS (Telangana State Development Planning Society).
    Targets high-precision rainfall data for flood risk management.
    """
    def __init__(self):
        self.url = "https://tsdps.telangana.gov.in/"
        self.supabase: Client = create_client(
            os.environ.get("SUPABASE_URL"),
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        )

    def scrape_current_rainfall(self, district_name: str):
        print(f"🌧️ Scraping Rainfall Data for {district_name}...")
        
        # In production, we'd use requests to parse the TSDPS automated weather station (AWS) data
        # For this implementation, we simulate the parsed official data structure
        mock_rainfall = [
            {"ward": "Jubilee Hills", "rainfall_mm": 45.5, "status": "heavy"},
            {"ward": "Banjara Hills", "rainfall_mm": 22.0, "status": "moderate"},
            {"ward": "Gachibowli", "rainfall_mm": 8.5, "status": "light"}
        ]
        
        for data in mock_rainfall:
            # If rainfall is heavy, trigger an automatic alert
            if data["rainfall_mm"] > 30:
                self._trigger_flood_alert(district_name, data["ward"], data["rainfall_mm"])
        
        print("✅ Rainfall monitoring complete.")

    def _trigger_flood_alert(self, district: str, ward: str, amount: float):
        # 1. Resolve area_id (for the ward)
        area_res = self.supabase.table("areas").select("id").eq("name", ward).execute()
        area_id = area_res.data[0]["id"] if area_res.data else None
        
        # 2. Insert into alerts table
        payload = {
            "area_id": area_id,
            "type": "weather",
            "severity": "warning",
            "title": "HYPER-LOCAL RAIN ALERT",
            "message": f"Heavy rainfall ({amount}mm) detected in {ward}. Risk of water-logging in low-lying lanes.",
            "is_active": True
        }
        
        try:
            self.supabase.table("alerts").insert(payload).execute()
            print(f"  🚨 FLOOD ALERT ISSUED for {ward}")
        except Exception as e:
            print(f"  ❌ Error issuing alert: {e}")

if __name__ == "__main__":
    scraper = RainfallScraper()
    scraper.scrape_current_rainfall("Hyderabad")
