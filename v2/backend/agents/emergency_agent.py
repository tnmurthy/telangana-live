from typing import List, Dict
from pydantic import BaseModel

class Contact(BaseModel):
    id: str
    category: str
    name: str
    phone: str
    is_local: bool

class EmergencyAgent:
    def get_contacts(self, area_id: str, category: str = None) -> List[Contact]:
        # Simulated logic for the stub
        # In real app, we'd query Supabase:
        # WHERE area_id = area_id OR area_id IS NULL
        return [
            Contact(id="1", category="medical", name="Ambulance", phone="108", is_local=False),
            Contact(id="2", category="police", name="Police Control Room", phone="100", is_local=False),
            Contact(id="3", category="medical", name="Jubilee Hills Clinic", phone="040-23456789", is_local=True),
        ]
