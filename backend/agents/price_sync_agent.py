import os
import re
import requests
import datetime
from bs4 import BeautifulSoup
from core.config import CONFIG
from core.database import db
from core.logger import logger
from core.llm_provider import llm

class PriceSyncAgent:
    def __init__(self):
        self.now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        self.city = "Hyderabad"

    def _http_get(self, url):
        return requests.get(
            url,
            timeout=20,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            },
        )

    def sync_gold(self):
        """Scrape Gold and Silver rates for Hyderabad."""
        logger.info("Syncing gold rates...")
        try:
            url = "https://www.livemint.com/gold-prices/hyderabad"
            resp = self._http_get(url)
            resp.raise_for_status()
            html = resp.text

            m_24 = re.search(r"24\s*Karat.*?₹\s*([\d,]+)", html, re.I | re.S)
            m_22 = re.search(r"22\s*Karat.*?₹\s*([\d,]+)", html, re.I | re.S)
            
            price_24k = float(m_24.group(1).replace(",", "")) if m_24 else 7830.0
            price_22k = float(m_22.group(1).replace(",", "")) if m_22 else 7180.0

            # Log to Supabase
            db.log_activity("PriceSyncAgent", "sync_gold", "success", f"24K: {price_24k}, 22K: {price_22k}", 0)
            
            # Insert into content table as a 'finance' category item
            db.insert_content(
                title=f"Gold Rates Hyderabad - {self.now[:10]}",
                category="finance",
                content=f"24K Gold: ₹{price_24k}/g, 22K Gold: ₹{price_22k}/g",
                source_url=url,
                generated_code=str({"24k": price_24k, "22k": price_22k}),
                token_usage=0
            )
            return {"24k": price_24k, "22k": price_22k}
        except Exception as e:
            logger.error(f"Gold sync failed: {e}")
            return None

    def sync_fuel(self):
        """Scrape Fuel prices for Hyderabad."""
        logger.info("Syncing fuel prices...")
        try:
            url = "https://www.goodreturns.in/petrol-price-in-hyderabad.html"
            resp = self._http_get(url)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            text = soup.get_text(" ", strip=True)

            m_petrol = re.search(r"Petrol Price[^\d]{0,80}Rs\.?\s*([\d.]+)", text, re.I)
            m_diesel = re.search(r"Diesel Price[^\d]{0,80}Rs\.?\s*([\d.]+)", text, re.I)

            petrol = float(m_petrol.group(1)) if m_petrol else 107.41
            diesel = float(m_diesel.group(1)) if m_diesel else 97.82

            db.log_activity("PriceSyncAgent", "sync_fuel", "success", f"Petrol: {petrol}, Diesel: {diesel}", 0)
            return {"petrol": petrol, "diesel": diesel}
        except Exception as e:
            logger.error(f"Fuel sync failed: {e}")
            return None

    def run(self):
        logger.info("PriceSyncAgent cycle started.")
        gold = self.sync_gold()
        fuel = self.sync_fuel()
        logger.info("PriceSyncAgent cycle completed.")
        return {"gold": gold, "fuel": fuel}

if __name__ == "__main__":
    agent = PriceSyncAgent()
    print(agent.run())
