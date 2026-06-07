import os
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Dict

class ClassifiedNews(BaseModel):
    title: str
    summary: str
    category: str
    relevance_score: int
    sentiment: str
    is_civic: bool

class NewsAgent:
    def __init__(self):
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def classify_article(self, title: str, content: str, district: str) -> ClassifiedNews:
        prompt = f"""
        Analyze this news article for the district: {district}
        
        Title: {title}
        Content: {content}
        
        Return a valid JSON object strictly with these fields:
        - summary: A concise 1-sentence summary for a mobile dashboard.
        - category: Exactly one of (civic, politics, crime, development, weather, other).
        - relevance_score: An integer 0-100 indicating how directly this affects local citizens' daily life (e.g. road closures = 100, general political statements = 20).
        - sentiment: One of (positive, negative, neutral).
        - is_civic: Boolean, true if it involves public services, infrastructure, or local government action.
        """
        
        try:
            response = self.model.generate_content(prompt)
            # In production, we'd use response_mime_type="application/json"
            # For this agent stub, we simulate the parsed intelligence
            import json
            # Simulate parsing logic
            return ClassifiedNews(
                title=title,
                summary=f"New updates regarding {district} development projects.",
                category="civic",
                relevance_score=85,
                sentiment="positive",
                is_civic=True
            )
        except Exception as e:
            return ClassifiedNews(
                title=title,
                summary="AI classification failed.",
                category="other",
                relevance_score=0,
                sentiment="neutral",
                is_civic=False
            )

    def aggregate_feed(self, area_id: str) -> List[Dict]:
        # Logic to fetch from sources and classify
        return []
