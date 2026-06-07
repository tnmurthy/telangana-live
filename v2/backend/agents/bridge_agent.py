import os
from supabase import create_client, Client
from datetime import datetime
from typing import List, Dict

class BridgeAgent:
    """
    Bridges data from V1 (legacy) tables to V2 (Pulse) schema.
    This allows V2 features to use live data from V1 scrapers.
    """
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get("SUPABASE_URL"),
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        )

    def sync_news(self):
        """Syncs from V1 'content' table to V2 'public.news'"""
        # Fetch active content from V1
        v1_news = self.supabase.table("content").select("*").eq("status", "active").execute()
        
        for item in v1_news.data:
            # Transform to V2 schema
            v2_payload = {
                "title": item["title"],
                "content": item["content"],
                "source_url": item["source_url"],
                "category": self._map_category(item["category"]),
                "ai_relevance_score": 0, # Initial score, will be updated by NewsAgent
                "published_at": item["created_at"]
            }
            
            # Upsert into V2 news table
            self.supabase.table("news").upsert(v2_payload, on_conflict="source_url").execute()

    def sync_reports(self):
        """Syncs from V1 'citizen_reports' to V2 'public.citizen_reports'"""
        v1_reports = self.supabase.table("citizen_reports").select("*").execute()
        
        for item in v1_reports.data:
            v2_payload = {
                "title": f"V1 Report: {item['category']}",
                "description": item["description"],
                "category": item["category"],
                "status": "pending", # Re-validate in V2
                "created_at": item["created_at"]
            }
            # Note: Mapping ward/corporation to V2 area_id would happen here
            self.supabase.table("citizen_reports").insert(v2_payload).execute()

    def sync_power_alerts(self):
        """Syncs from V1 'power_alerts' to V2 'public.power_outages'"""
        v1_alerts = self.supabase.table("power_alerts").select("*").execute()
        
        for item in v1_alerts.data:
            v2_payload = {
                "type": "unplanned",
                "status": "active",
                "reason": item["reason"],
                "created_at": item["created_at"]
            }
            # Note: In real app, map 'area' text to area_id
            self.supabase.table("power_outages").insert(v2_payload).execute()

    def _map_category(self, v1_cat: str) -> str:
        mapping = {
            "News": "civic",
            "Scheme": "civic",
            "Emergency": "weather"
        }
        return mapping.get(v1_cat, "other")

if __name__ == "__main__":
    bridge = BridgeAgent()
    print("🚀 Starting V1 -> V2 Data Sync...")
    bridge.sync_news()
    print("✅ News Synced.")
    bridge.sync_reports()
    print("✅ Reports Synced.")
