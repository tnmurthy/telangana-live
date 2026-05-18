import os
import json
import datetime
import random
from core.logger import logger
from core.database import db

class TransitSyncAgent:
    def __init__(self):
        self.now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        self.output_file = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
            "frontend", "src", "src", "data", "transit_status.json"
        )

    def sync_transit(self):
        """Simulate/Scrape live transit data."""
        logger.info("Syncing transit data...")
        
        # Simulating live May 2026 data.
        # This would normally pull from Hyderabad Metro API, TSRTC Gamyam, and Google Maps Traffic API.
        
        rtc_routes = [
            {"route": "65G (Miyapur - MGBS)", "flow": random.randint(70, 95), "status": ""},
            {"route": "218 (LBN - Sec)", "flow": random.randint(30, 60), "status": ""},
            {"route": "127K (KPHB - Cyberabad)", "flow": random.randint(80, 100), "status": ""},
            {"route": "10H (Sec - Kondapur)", "flow": random.randint(50, 85), "status": ""}
        ]
        
        for route in rtc_routes:
            if route["flow"] > 85:
                route["status"] = "Severe"
            elif route["flow"] > 65:
                route["status"] = "Overcrowded"
            else:
                route["status"] = "Normal"

        data = {
            "lastUpdated": self.now,
            "rtc_flow": rtc_routes,
            "alerts": [
                {
                    "type": "maintenance",
                    "title": "Maintenance Notice",
                    "description": "MMTS Secunderabad - Bolarum line restricted between 11 PM - 4 AM this weekend."
                },
                {
                    "type": "new_route",
                    "title": "New Route Launch",
                    "description": "Metro Phase 2 trial runs confirmed for Old City stretch starting April 2026."
                },
                {
                    "type": "traffic",
                    "title": "Heavy Traffic Alert",
                    "description": "Panjagutta flyover experiencing 20 min delays due to waterlogging."
                }
            ]
        }
        return data

    def run(self):
        logger.info("TransitSyncAgent cycle started.")
        data = self.sync_transit()
        
        try:
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            with open(self.output_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            logger.info(f"Hybrid Sync: Updated {self.output_file}")
            
            # Log to DB
            db.log_activity("TransitSyncAgent", "sync", "success", "Synced transit alerts", 0)
        except Exception as e:
            logger.error(f"Transit Sync failed: {e}")

        logger.info("TransitSyncAgent cycle completed.")
        return data

if __name__ == "__main__":
    agent = TransitSyncAgent()
    print(agent.run())
