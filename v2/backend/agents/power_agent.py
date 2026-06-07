from datetime import datetime, timedelta
from typing import List, Dict
from pydantic import BaseModel

class PowerAlert(BaseModel):
    id: str
    type: str
    status: str
    start_time: datetime
    eta_restoration: datetime
    reason: str
    affected_customers: int

class PowerAgent:
    def get_active_alerts(self, area_id: str) -> List[PowerAlert]:
        # Simulated logic for the stub
        return [
            PowerAlert(
                id="OUT-991",
                type="unplanned",
                status="active",
                start_time=datetime.now() - timedelta(minutes=45),
                eta_restoration=datetime.now() + timedelta(minutes=90),
                reason="Transformer breakdown near Sector 4",
                affected_customers=120
            )
        ]

    def get_planned_maintenance(self, area_id: str) -> List[Dict]:
        return [
            {
                "date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
                "time": "10:00 AM - 02:00 PM",
                "reason": "Grid upgrade work",
                "status": "planned"
            }
        ]
