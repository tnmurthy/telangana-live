import json
import logging
import sys
import os

# Ensure providers can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from core.llm_provider import llm
except ImportError:
    llm = None
    print("Warning: llm_provider could not be imported. Fact Checker will return defaults.")

logger = logging.getLogger(__name__)

class NewsFactChecker:
    """Automated AI Fact Checking Pipeline for Civic News."""
    
    def check_news_item(self, title: str, description: str) -> dict:
        """
        Runs the content through an LLM to assess factual credibility,
        detect sensationalism, and format a civic action flag.
        """
        if not llm or not getattr(llm, "gemini_available", False):
            return self._default_pass()
            
        prompt = f"""
        You are a strict, highly analytical civic fact-checker for a government portal.
        Analyze the following news article for sensationalism, credibility, and actionable civic data (e.g., pothole reported, power grid down).
        
        Title: {title}
        Description: {description}
        
        Return ONLY valid JSON matching this schema exactly, with NO markdown formatting:
        {{
            "credibility_score": 90,
            "is_fake_news_flag": false,
            "civic_action_required": false,
            "reasoning": "Short 1-sentence explanation"
        }}
        """
        
        response = llm.generate(
            prompt=prompt,
            provider="gemini", # Best for structured reasoning on news at high speed
            model="gemini-2.0-flash",
            temperature=0.1,
            max_tokens=250
        )
        
        try:
            text = response.get("text", "") or ""
            # Strip markdown json blocks if returned
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
                
            return json.loads(text.strip())
        except Exception as e:
            logger.warning(f"Fact check parsing failed: {e}")
            return self._default_pass()

    def _default_pass(self):
        return {
            "credibility_score": 85,
            "is_fake_news_flag": False,
            "civic_action_required": False,
            "reasoning": "AI verification skipped or failed."
        }

# Singleton instance
fact_checker = NewsFactChecker()
