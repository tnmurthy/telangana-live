from typing import List, Dict
from pydantic import BaseModel

class TransitArrival(BaseModel):
    id: str
    type: str
    route: str
    station: str
    eta_minutes: int
    status: str # On-time, Delayed, Cancelled
    platform: str = None

class TransportAgent:
    def get_live_arrivals(self, area_id: str, transit_type: str = 'metro') -> List[TransitArrival]:
        # Simulated logic for the stub
        # In real app, we'd fetch from HMRL/TSRTC APIs
        return [
            TransitArrival(
                id="M-101",
                type="metro",
                route="Blue Line",
                station="Jubilee Hills Check Post",
                eta_minutes=4,
                status="On-time",
                platform="1"
            ),
            TransitArrival(
                id="B-404",
                type="bus",
                route="222L",
                station="Road No 36",
                eta_minutes=12,
                status="Delayed",
                platform="Bus Stop"
            )
        ]
