import os
import google.generativeai as genai
from pydantic import BaseModel
from typing import Dict

class ClassificationResult(BaseModel):
    category: str
    sentiment: str
    priority: str
    department: str
    reasoning: str

from core.models import ModelRegistry

class GrievanceAgent:
    def __init__(self):
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model = ModelRegistry.get_generative_model("LOW_COST")

    def classify_report(self, title: str, description: str) -> ClassificationResult:
        prompt = f"""
        Analyze the following civic complaint and categorize it.
        
        Title: {title}
        Description: {description}
        
        Return a JSON object with:
        - category: (Roads, Water, Waste, Streetlights, Health, Education, Other)
        - sentiment: (Critical, Frustrated, Suggestion, Neutral)
        - priority: (low, medium, high, emergency)
        - department: The specific municipal department it should be routed to.
        - reasoning: 1-sentence explanation.
        """
        
        # Use structured output if supported or parse JSON
        response = self.model.generate_content(prompt)
        # For brevity in this stub, we simulate the parsed result
        # In production, we use response_mime_type="application/json"
        
        return ClassificationResult(
            category="Roads",
            sentiment="Frustrated",
            priority="high",
            department="MA&UD - Roads Division",
            reasoning="Complaint describes a dangerous pothole affecting peak hour traffic."
        )
