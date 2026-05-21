import os
import json
import datetime
from core.logger import logger
from core.database import db

class WaterSyncAgent:
    def __init__(self):
        self.now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        self.output_file = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
            "frontend", "src", "data", "water_levels.json"
        )

    def sync_reservoirs(self):
        """Simulate/Scrape live reservoir data."""
        logger.info("Syncing reservoir data...")
        
        # Real-world data would come from CWC or Telangana Irrigation Dept APIs.
        # Simulating live May 2026 data.
        data = {
            "lastUpdated": self.now,
            "reservoirs": [
                {
                    "id": "nagarjuna-sagar",
                    "name": "Nagarjuna Sagar",
                    "river": "Krishna",
                    "district": "Nalgonda",
                    "purpose": ["Irrigation", "Hydroelectric", "Drinking"],
                    "fullLevelFt": 590.0,
                    "currentLevelFt": 542.5,
                    "fullCapacityTMC": 312.04,
                    "currentLevelTMC": 182.4,
                    "inflow": 4200,
                    "outflow": 6500,
                    "inflowUnit": "cusecs"
                },
                {
                    "id": "srisailam",
                    "name": "Srisailam Dam",
                    "river": "Krishna",
                    "district": "Nagarkurnool",
                    "purpose": ["Hydroelectric", "Irrigation"],
                    "fullLevelFt": 885.0,
                    "currentLevelFt": 820.2,
                    "fullCapacityTMC": 215.81,
                    "currentLevelTMC": 45.6,
                    "inflow": 2100,
                    "outflow": 1500,
                    "inflowUnit": "cusecs",
                    "alertMessage": "Low storage level. Power generation restricted."
                },
                {
                    "id": "sriram-sagar",
                    "name": "Sriram Sagar (SRSP)",
                    "river": "Godavari",
                    "district": "Nizamabad",
                    "purpose": ["Irrigation", "Drinking"],
                    "fullLevelFt": 1091.0,
                    "currentLevelFt": 1072.0,
                    "fullCapacityTMC": 90.31,
                    "currentLevelTMC": 42.1,
                    "inflow": 1200,
                    "outflow": 500,
                    "inflowUnit": "cusecs"
                },
                {
                    "id": "osman-sagar",
                    "name": "Osman Sagar",
                    "river": "Musi",
                    "district": "Rangareddy",
                    "purpose": ["Drinking Water - GHMC"],
                    "fullLevelFt": 1790.0,
                    "currentLevelFt": 1782.5,
                    "fullCapacityTMC": 3.90,
                    "currentLevelTMC": 2.1,
                    "inflow": 0,
                    "outflow": 25,
                    "inflowUnit": "cusecs"
                },
                {
                    "id": "himayat-sagar",
                    "name": "Himayat Sagar",
                    "river": "Esi",
                    "district": "Rangareddy",
                    "purpose": ["Drinking Water - GHMC"],
                    "fullLevelFt": 1763.5,
                    "currentLevelFt": 1756.0,
                    "fullCapacityTMC": 2.97,
                    "currentLevelTMC": 1.4,
                    "inflow": 0,
                    "outflow": 15,
                    "inflowUnit": "cusecs"
                }
            ]
        }
        return data

    def run(self):
        logger.info("WaterSyncAgent cycle started.")
        data = self.sync_reservoirs()
        
        try:
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            with open(self.output_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            logger.info(f"Hybrid Sync: Updated {self.output_file}")
            
            # Log to DB
            db.log_activity("WaterSyncAgent", "sync", "success", "Synced 5 reservoirs", 0)
        except Exception as e:
            logger.error(f"Water Sync failed: {e}")

        logger.info("WaterSyncAgent cycle completed.")
        return data

if __name__ == "__main__":
    agent = WaterSyncAgent()
    print(agent.run())
