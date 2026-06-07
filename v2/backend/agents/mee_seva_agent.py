from typing import List, Dict
from pydantic import BaseModel

class MeeSevaCenter(BaseModel):
    id: str
    name: str
    address: str
    phone: str
    lat: float
    lng: float
    services: List[str]

class MeeSevaAgent:
    def get_nearby_centers(self, area_id: str) -> List[MeeSevaCenter]:
        # Simulated logic - in real app query mee_seva_centers table
        return [
            MeeSevaCenter(
                id="M-01",
                name="Jubilee Hills Mee Seva",
                address="Plot 45, Road No 36, Jubilee Hills",
                phone="040-23456789",
                lat=17.4326,
                lng=78.4071,
                services=["Aadhar", "Income", "Caste", "Passport"]
            ),
            MeeSevaCenter(
                id="M-02",
                name="Banjara Hills Service Point",
                address="Road No 12, Banjara Hills",
                phone="040-98765432",
                lat=17.4165,
                lng=78.4446,
                services=["Property Tax", "Driving License"]
            )
        ]
