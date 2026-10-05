import json
import logging
import os
import sys
from dataclasses import dataclass

# Ensure providers can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from core.llm_provider import llm
except ImportError:
    llm = None

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class FactCheckVerdict:
    """Outcome of one fact check.

    checked=False means no judgment was made (model unavailable, call failed,
    reply unusable). The other fields are then None: an unchecked article has
    no credibility score, rather than the made-up 85 / "not fake" the checker
    used to return (TL-07).
    """

    checked: bool
    is_fake: bool | None = None
    credibility_score: int | None = None
    civic_action_required: bool | None = None
    reasoning: str = ""
    error: str | None = None


def _parse_verdict(text: str) -> FactCheckVerdict:
    """Validate the model's JSON reply into a verdict; unusable -> unchecked."""
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0]
    elif "```" in text:
        text = text.split("```")[1].split("```")[0]
    try:
        data = json.loads(text.strip())
    except (ValueError, TypeError) as e:
        return FactCheckVerdict(checked=False, error=f"reply is not JSON: {e}")

    score = data.get("credibility_score") if isinstance(data, dict) else None
    fake = data.get("is_fake_news_flag") if isinstance(data, dict) else None
    civic = data.get("civic_action_required") if isinstance(data, dict) else None
    if not (isinstance(score, int) and not isinstance(score, bool) and 0 <= score <= 100):
        return FactCheckVerdict(checked=False, error=f"credibility_score invalid: {score!r}")
    if not isinstance(fake, bool) or not isinstance(civic, bool):
        return FactCheckVerdict(checked=False, error="missing boolean flags")
    return FactCheckVerdict(
        checked=True,
        is_fake=fake,
        credibility_score=score,
        civic_action_required=civic,
        reasoning=str(data.get("reasoning", ""))[:300],
    )


class NewsFactChecker:
    """Automated AI Fact Checking Pipeline for Civic News."""

    def check_news_item(self, title: str, description: str) -> FactCheckVerdict:
        """
        Runs the content through an LLM to assess factual credibility,
        detect sensationalism, and format a civic action flag.
        Never raises; failures come back as checked=False with the reason.
        """
        if not llm or not getattr(llm, "gemini_available", False):
            return FactCheckVerdict(checked=False, error="fact-check model unavailable")

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

        try:
            response = llm.generate(
                prompt=prompt,
                provider="gemini",  # Best for structured reasoning on news at high speed
                model="gemini-2.0-flash",
                temperature=0.1,
                max_tokens=250,
            )
        except Exception as e:
            logger.warning("Fact check call failed: %s", e)
            return FactCheckVerdict(checked=False, error=f"model call failed: {e}")

        verdict = _parse_verdict((response or {}).get("text", "") or "")
        if not verdict.checked:
            logger.warning("Fact check unusable for %r: %s", title[:60], verdict.error)
        return verdict


# Singleton instance
fact_checker = NewsFactChecker()
