import os
import re
import requests
import datetime
import json
from bs4 import BeautifulSoup
from core.config import CONFIG
from core.database import db
from core.logger import logger
from core.llm_provider import llm

class PriceSyncAgent:
    def __init__(self):
        self.now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        self.city = "Hyderabad"
        self.output_file = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "src", "data", "prices.json"))

    def _http_get(self, url):
        return requests.get(
            url,
            timeout=20,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            },
        )

    def sync_gold(self):
        """Mock/Scrape gold rates for Hyderabad."""
        logger.info("Syncing gold rates...")
        # Hyderabad May 6th, 2026 approx rates
        rates = {
            "24k": 78300.0, # per 10g
            "22k": 71800.0
        }
        return rates

    def sync_fuel(self):
        """Mock/Scrape Fuel prices for Hyderabad."""
        logger.info("Syncing fuel prices...")
        # Hyderabad May 6th, 2026 approx rates
        rates = {
            "petrol": 107.41,
            "diesel": 95.64
        }
        return rates

    def sync_mandi(self):
        """Mock/Scrape Mandi prices for major Telangana commodities."""
        logger.info("Syncing mandi prices...")
        # In a real scenario, we'd scrape ename.gov.in or similar. 
        # Using realistic local rates for Telangana (May 6th) as initial data.
        commodities = {
            "Paddy (Common)": 2183,
            "Cotton": 7020,
            "Red Chillies": 18500,
            "Maize": 2090
        }
        return commodities

    def run(self):
        logger.info("PriceSyncAgent cycle started.")
        gold = self.sync_gold()
        fuel = self.sync_fuel()
        mandi = self.sync_mandi()
        
        # Hybrid Sync: Export to JSON
        price_data = {
            "last_updated": self.now,
            "gold": gold,
            "fuel": fuel,
            "mandi": mandi,
            "city": self.city
        }
        
        try:
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            with open(self.output_file, "w", encoding="utf-8") as f:
                json.dump(price_data, f, indent=2)
            logger.info(f"Hybrid Sync: Updated {self.output_file}")
        except Exception as e:
            logger.error(f"Hybrid Sync failed: {e}")

        logger.info("PriceSyncAgent cycle completed.")
        return price_data

if __name__ == "__main__":
    agent = PriceSyncAgent()
    print(agent.run())
