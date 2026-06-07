from typing import List, Dict
from pydantic import BaseModel

class HealthFacility(BaseModel):
    id: str
    name: str
    type: str
    address: str
    phone: str
    timings: str

class HealthcareAgent:
    def get_nearby_facilities(self, area_id: str) -> List[HealthFacility]:
        # Simulated logic - in real app query healthcare_facilities
        return [
            HealthFacility(
                id="H-01",
                name="Jubilee Hills Basthi Dawakhana",
                type="Basthi Dawakhana",
                address="Near Road No 45, Jubilee Hills",
                phone="040-12345678",
                timings="09:00 AM - 04:00 PM"
            ),
            HealthFacility(
                id="H-02",
                name="Banjara Hills Wellness Center",
                type="Wellness Center",
                address="Lane 12, Banjara Hills",
                phone="040-87654321",
                timings="08:00 AM - 08:00 PM"
            )
        ]
