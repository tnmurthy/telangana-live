from typing import List, Dict, Optional
from pydantic import BaseModel

class AgriAdvisory(BaseModel):
    crop: str
    text: str
    urgency: str

class ParkInfo(BaseModel):
    name: str
    type: str
    crowd_status: str
    timings: str

class RationShop(BaseModel):
    shop_number: str
    dealer: str
    phone: str
    quota: int

class FeatureParityAgent:
    """
    Handles all the migrated 'Directory' features from V1.
    """
    def get_nearby_parks(self, area_id: str) -> List[ParkInfo]:
        return [
            ParkInfo(name="KBR National Park", type="National Park", crowd_status="Moderate", timings="06:00 - 18:00"),
            ParkInfo(name="Lumbini Park", type="Lakeside", crowd_status="Light", timings="09:00 - 21:00")
        ]

    def get_nearby_ration_shops(self, area_id: str) -> List[RationShop]:
        return [
            RationShop(shop_number="HYD-001", dealer="K. Ramaiah", phone="040-23456781", quota=85)
        ]

    def get_crop_advisories(self) -> List[AgriAdvisory]:
        return [
            AgriAdvisory(crop="Paddy", text="Prepare nursery beds from mid-April.", urgency="medium"),
            AgriAdvisory(crop="Cotton", text="Begin deep ploughing for Kharif.", urgency="high")
        ]

    def get_daily_shloka(self) -> Dict:
        return {
            "sanskrit": "धर्मो रक्षति रक्षितः",
            "telugu": "ధర్మో రక్షతి రక్షితః",
            "meaning": "Dharma protects those who protect it."
        }
