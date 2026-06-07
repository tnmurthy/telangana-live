from typing import List, Dict
from pydantic import BaseModel

class JobPosting(BaseModel):
    id: str
    title: str
    company: str
    category: str
    salary: str
    location: str
    match_score: int

class JobsAgent:
    def get_matched_jobs(self, area_id: str, user_prefs: Dict) -> List[JobPosting]:
        # Simulated matching logic
        # In real app, query Supabase and calculate score based on user_prefs
        return [
            JobPosting(
                id="J-01",
                title="Junior Software Engineer",
                company="T-Hub Startup",
                category="it",
                salary="₹6L - ₹8L",
                location="Cyberabad / Hitech City",
                match_score=95
            ),
            JobPosting(
                id="J-02",
                title="Ward Revenue Officer",
                company="Govt of Telangana",
                category="government",
                salary="₹4L - ₹6L",
                location=area_id,
                match_score=88
            )
        ]
