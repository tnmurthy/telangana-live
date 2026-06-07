from typing import List, Dict, Optional
from pydantic import BaseModel

class ODOPItem(BaseModel):
    id: str
    product_name: str
    category: str
    description: str
    image_url: Optional[str]
    buy_url: Optional[str]

class BudgetItem(BaseModel):
    category: str
    allocation_cr: float
    percentage: float

class ODOPAgent:
    def get_district_product(self, area_id: str) -> Optional[ODOPItem]:
        # Simulated logic - in real app query odop_data table
        # Seeded data for Hyderabad and Siddipet
        products = {
            "Hyderabad": ODOPItem(
                id="1", 
                product_name="Lac Bangles & Pearls", 
                category="Handicrafts", 
                description="Exquisite traditional bangles from Lad Bazaar and world-famous pearls.",
                buy_url="https://lepakshihandicrafts.gov.in"
            ),
            "Siddipet": ODOPItem(
                id="2", 
                product_name="Gollabhama Sarees", 
                category="Textiles", 
                description="GI-tagged traditional handloom sarees featuring the milkmaid motif.",
                buy_url="https://tshandloom.com"
            )
        }
        # In real app, we'd lookup by area_id. For demo, we match by simple name logic if passed.
        return products.get("Hyderabad") # Default for stub

class BudgetAgent:
    def get_budget_breakdown(self, area_id: Optional[str] = None) -> List[BudgetItem]:
        # Simulated state-wide or district budget
        return [
            BudgetItem(category="Education", allocation_cr=25000, percentage=25.0),
            BudgetItem(category="Health & Wellness", allocation_cr=15000, percentage=15.0),
            BudgetItem(category="Agriculture", allocation_cr=20000, percentage=20.0),
            BudgetItem(category="Infrastructure", allocation_cr=30000, percentage=30.0),
            BudgetItem(category="Others", allocation_cr=10000, percentage=10.0)
        ]
