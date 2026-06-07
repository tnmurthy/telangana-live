from typing import List, Dict
from pydantic import BaseModel

class AreaAlert(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    message: str
    is_active: bool

class AlertsAgent:
    def __init__(self):
        import os
        from supabase import create_client
        self.sb = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))

    def broadcast_push(self, area_id: str, title: str, message: str):
        from pywebpush import webpush, WebPushException
        import json
        import os
        
        print(f"📡 Broadcasting Push Alert to Area: {area_id}...")
        
        # 1. Fetch all subscriptions for this area
        subscriptions = self.sb.table("push_subscriptions").select("subscription_json").eq("area_id", area_id).execute()
        
        if not subscriptions.data:
            print("  - No active subscriptions found for this area.")
            return

        # 2. Trigger Web Push
        private_key = os.getenv("VAPID_PRIVATE_KEY")
        email = os.getenv("VAPID_EMAIL", "admin@telangana.live")
        
        for sub in subscriptions.data:
            try:
                webpush(
                    subscription_info=sub['subscription_json'],
                    data=json.dumps({"title": title, "message": message}),
                    vapid_private_key=private_key,
                    vapid_claims={"sub": f"mailto:{email}"}
                )
                print(f"  ✅ Push triggered successfully.")
            except WebPushException as ex:
                print(f"  ❌ Push failed for a token: {ex}")
        
        print(f"🚀 Broadcast attempt complete for {len(subscriptions.data)} citizens.")

    def get_active_alerts(self, area_id: str) -> List[AreaAlert]:
        # Simulated logic for the stub
        # In real app, query Supabase WHERE area_id = area_id OR area_id IS NULL
        return [
            AreaAlert(
                id="A-101",
                type="emergency",
                severity="critical",
                title="Heavy Rain Warning",
                message="Flash flood risk in Jubilee Hills Ward 95. Avoid low-lying areas.",
                is_active=True
            ),
            AreaAlert(
                id="A-102",
                type="utility",
                severity="info",
                title="Water Supply Delay",
                message="Supply delayed by 30 mins due to main line sync.",
                is_active=True
            )
        ]
