import time
import os
from datetime import datetime
from dotenv import load_dotenv

# Import all agents
from agents.hmwssb_scraper import HMWSSBScraper
from agents.mandi_scraper import MandiScraper
from agents.power_scraper import PowerScraper
from agents.lad_fund_scraper import LADFundScraper
from agents.tender_scraper import TenderScraper
from agents.rainfall_scraper import RainfallScraper
from agents.bridge_agent import BridgeAgent
from agents.monitoring_tower import MonitoringTower

# Load environment
load_dotenv('.env')

class IngestionEngine:
    def __init__(self):
        self.sentry = MonitoringTower()
        self.bridge = BridgeAgent()
        
    def run_all(self):
        print(f"🚀 [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Pulse Ingestion Cycle Started")
        
        # 1. Sync Legacy Data (Bridge)
        self._execute_agent("Bridge_Agent", self.bridge.sync_news)
        self._execute_agent("Bridge_Agent_Reports", self.bridge.sync_reports)

        # 2. Run Scrapers
        hmwssb = HMWSSBScraper()
        self._execute_agent("HMWSSB_Scraper", hmwssb.scrape_reservoir_levels)
        self._execute_agent("HMWSSB_Timings", lambda: hmwssb.scrape_supply_timings("Hyderabad"))

        mandi = MandiScraper()
        self._execute_agent("Mandi_Scraper", mandi.scrape_daily_prices)

        power = PowerScraper()
        self._execute_agent("Power_Outage_Scraper", lambda: power.scrape_active_outages("Hyderabad"))

        tender = TenderScraper()
        self._execute_agent("Tender_Scraper", lambda: tender.scrape_active_tenders("Hyderabad"))

        rainfall = RainfallScraper()
        self._execute_agent("Rainfall_Safety_Agent", lambda: rainfall.scrape_current_rainfall("Hyderabad"))

        lad = LADFundScraper()
        self._execute_agent("LAD_Fund_Tracker", lad.scrape_lad_utilization)

        print(f"✨ [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Pulse Ingestion Cycle Complete.")

    def _execute_agent(self, name, func):
        start_time = time.time()
        try:
            print(f"  → Running {name}...")
            func()
            latency = int(time.time() - start_time)
            self.sentry.heart_beat(name, latency)
            # Perform AI Accuracy Audit on result (Simplified for demo)
            self.sentry.audit_agent_accuracy(name, f"Last run successful at {datetime.now()}")
        except Exception as e:
            print(f"  ❌ {name} Failed: {e}")
            # The sentry will mark this as failing in Supabase

if __name__ == "__main__":
    engine = IngestionEngine()
    # Run once
    engine.run_all()
