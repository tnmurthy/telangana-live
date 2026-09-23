"""
alert_triage.py — civic alert triage for the Google News RSS alert feed.

Replaces the previous three-layer stack in scripts/data_engine.py:

  1. eight hand-tuned regexes that assigned both `type` and `severity`
  2. a 22-keyword substring gate for "is this about Telangana"
  3. a follow-up LLM call prompted for "exactly one word: YES or NO", parsed
     with .startswith("YES") — anything else silently meant "trust the regex"

All four judgments now ride in a single TypeSafe request and come back typed.
Code keeps the policy: thresholds, severity bands and accept/reject live here,
not in the model, so they can be retuned without re-running inference.

The regex path survives as an explicit fallback tier (matching the multi-tier
resiliency idiom used elsewhere in this pipeline) so the nightly sync still
produces a feed when TYPESAFE_API_KEY is absent or the service is down.
"""
import logging
import os
import re
from dataclasses import dataclass
from typing import Optional

try:
    # Load .env here rather than relying on core.config being imported first —
    # tools/calibrate_alert_triage.py imports this module on its own.
    #
    # Both files are loaded deliberately: a bare load_dotenv() resolves relative
    # to THIS file, so it stops at backend/.env and never reaches the repo-root
    # .env where most credentials (including TYPESAFE_API_KEY) actually live.
    # backend/.env is loaded first and wins on conflicts, preserving existing
    # behaviour; the root file only fills in what it doesn't define.
    from dotenv import load_dotenv

    _BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    _REPO_ROOT = os.path.dirname(_BACKEND_DIR)
    load_dotenv(os.path.join(_BACKEND_DIR, ".env"))
    load_dotenv(os.path.join(_REPO_ROOT, ".env"), override=False)
except ImportError:  # pragma: no cover
    pass

logger = logging.getLogger(__name__)

try:
    from typesafe_sdk import Choice, Noul, Score, TypeSafeClient
except ImportError:  # pragma: no cover - exercised via _get_client() returning None
    Choice = Noul = Score = TypeSafeClient = None


# ── Vocabulary ────────────────────────────────────────────────────────────────

NO_ALERT = "none"

ALERT_TYPES = (
    "flood",
    "natural_disaster",
    "emergency",
    "weather",
    "strike",
    "road_closure",
    "power_outage",
    "water_supply",
)

SEVERITY_BANDS = ("minor", "moderate", "high", "critical")


# ── Thresholds ────────────────────────────────────────────────────────────────
# Tune these against tools/calibrate_alert_triage.py output. Changing a
# threshold does not require re-running inference on already-judged headlines.

# Calibrated 2026-09-23 against tools/calibrate_alert_triage.py (22 labelled
# headlines). Sweep results at that run:
#   type confidence   0.80 -> 12/12 positives kept, 0/10 negatives admitted
#                     0.60 -> 12/12 kept, 2/10 admitted  (Kerala/Mumbai leak in)
#   telangana prob    0.40-0.80 all -> 11/12 kept, 0/10 admitted; 0.90 -> 10/12
#   current prob      0.50 -> 12/12 kept; 0.60 -> 11/12; 0.80 -> 10/12
# is_current is kept deliberately loose: scheduled outages ("6-hour shutdown
# announced") score lower than in-progress events but must still reach the feed.
# Out-of-state headlines are rejected by the Telangana gate, not this one.
MIN_TYPE_CONFIDENCE = 0.80
MIN_TELANGANA_PROBABILITY = 0.70
MIN_CURRENT_PROBABILITY = 0.50


@dataclass(frozen=True)
class AlertVerdict:
    """Typed outcome of triaging one headline. Raw signals are retained so the
    thresholds above stay inspectable and retunable."""

    accepted: bool
    alert_type: Optional[str]  # set only when accepted
    severity: Optional[str]
    source: str  # "typesafe" | "regex"
    chosen_type: Optional[str] = None  # raw Choice, populated whether or not accepted
    rejection_reason: Optional[str] = None
    type_confidence: Optional[float] = None
    telangana_probability: Optional[float] = None
    current_probability: Optional[float] = None
    severity_score: Optional[float] = None


# ── Question set ──────────────────────────────────────────────────────────────

ALERT_TYPE_CRITERIA = {
    "flood": "Flooding, a flash flood, waterlogging or inundation is happening "
             "now or is imminent.",
    "natural_disaster": "A landslide, earthquake, or a cyclone making landfall.",
    "emergency": "A fire, building collapse, blast, explosion or gas leak.",
    "weather": "A severe weather warning or heavy rainfall advisory has been "
               "issued by IMD or the state.",
    "strike": "A bandh, strike, rasta roko, rail roko or shutdown call that "
              "disrupts movement or services.",
    "road_closure": "A road, highway or flyover is closed, or traffic is being "
                    "diverted.",
    "power_outage": "Electricity supply has been cut, has failed, or is being "
                    "shut down for maintenance.",
    "water_supply": "Piped water supply has been cut, disrupted or suspended, "
                    "or there is a water shortage.",
    NO_ALERT: "Not reporting an active local disruption at all — for example "
              "sports, a policy or budget announcement, a court case, an "
              "infrastructure project that has only been proposed or approved, "
              "or an anniversary of a past event.",
}

SEVERITY_CRITERIA = [
    "Minor — confined to a single street, building or junction, and short-lived.",
    "Moderate — affects one neighbourhood or locality, or a scheduled outage of "
    "a few hours.",
    "High — affects an entire district or a major corridor, or lasts all day.",
    "Critical — city-wide or state-wide, or there is a threat to life.",
]


def _build_questions():
    return {
        "alert_type": Choice(
            instructions="What kind of active civic disruption is `headline` "
                         "reporting? Judge only the kind of event; where it happened is asked separately.",
            criteria=ALERT_TYPE_CRITERIA,
        ),
        "is_telangana": Noul(
            instructions="Is the disruption described in `headline` physically "
                         "located in Telangana state or Hyderabad? A Telangana "
                         "outlet reporting on an event in another state does "
                         "not count as Telangana.",
        ),
        "is_current": Noul(
            instructions="Is the disruption in `headline` happening now, "
                         "imminent, or already scheduled to happen within the "
                         "next few days? A past event, an anniversary, a review "
                         "of an earlier event, or a project that has only been "
                         "proposed or approved does not count.",
        ),
        "severity": Score(
            instructions="How disruptive is this to residents of the affected "
                         "area right now?",
            criteria=SEVERITY_CRITERIA,
        ),
    }


# ── Client ────────────────────────────────────────────────────────────────────

_client = None
_client_resolved = False


def _get_client():
    """Lazily construct a shared TypeSafeClient, or None when unavailable."""
    global _client, _client_resolved
    if _client_resolved:
        return _client

    _client_resolved = True
    if TypeSafeClient is None:
        logger.info("typesafe_sdk not installed; alert triage will use regex fallback.")
    elif not os.getenv("TYPESAFE_API_KEY"):
        logger.info("TYPESAFE_API_KEY not set; alert triage will use regex fallback.")
    else:
        try:
            _client = TypeSafeClient()
        except Exception as exc:
            logger.warning("TypeSafeClient construction failed (%s); using regex fallback.", exc)
    return _client


def reset_client_cache():
    """Test hook — forces the next _get_client() call to re-resolve."""
    global _client, _client_resolved
    _client = None
    _client_resolved = False


# ── Severity mapping ──────────────────────────────────────────────────────────

def severity_for_score(score: float) -> str:
    """Map an expected Score (probability-weighted level) onto a severity band."""
    index = int(round(score))
    index = max(0, min(index, len(SEVERITY_BANDS) - 1))
    return SEVERITY_BANDS[index]


# ── Primary path ──────────────────────────────────────────────────────────────

def triage_headline(headline: str, description: str = "") -> AlertVerdict:
    """Judge one RSS headline and decide whether it belongs in the alerts feed."""
    client = _get_client()
    if client is None:
        return _regex_verdict(headline, description)

    try:
        result = client.system_one(
            state={"headline": headline, "description": description or ""},
            questions=_build_questions(),
        )
    except Exception as exc:
        logger.warning("TypeSafe triage failed for %r (%s); falling back to regex.",
                       headline[:60], exc)
        return _regex_verdict(headline, description)

    return _apply_policy(result)


def _apply_policy(result) -> AlertVerdict:
    """Turn four raw judgments into an accept/reject decision. Pure code — no
    model involvement, so thresholds can change without new inference."""
    type_answer = result.choices["alert_type"]
    telangana = result.nouls["is_telangana"].noul
    current = result.nouls["is_current"].noul
    severity_score = result.scores["severity"].score

    signals = {
        "chosen_type": type_answer.choice,
        "type_confidence": type_answer.confidence,
        "telangana_probability": telangana,
        "current_probability": current,
        "severity_score": severity_score,
    }

    def reject(reason):
        return AlertVerdict(
            accepted=False,
            alert_type=None,
            severity=None,
            source="typesafe",
            rejection_reason=reason,
            **signals,
        )

    if type_answer.choice == NO_ALERT:
        return reject("no_disruption")
    if type_answer.confidence < MIN_TYPE_CONFIDENCE:
        return reject("low_confidence")
    if telangana < MIN_TELANGANA_PROBABILITY:
        return reject("not_telangana")
    if current < MIN_CURRENT_PROBABILITY:
        return reject("not_current")

    return AlertVerdict(
        accepted=True,
        alert_type=type_answer.choice,
        severity=severity_for_score(severity_score),
        source="typesafe",
        **signals,
    )


# ── Fallback path ─────────────────────────────────────────────────────────────
# Retained verbatim from the pre-TypeSafe implementation so the nightly sync
# degrades instead of stalling. Known to be imprecise — see the module docstring.

_FALLBACK_PATTERNS = [
    ("flood", "critical",
     r"\bflood(ing|ed)?\b|flash flood|water ?log(ging|ged)?|inundat"),
    ("natural_disaster", "critical",
     r"land ?slide|earth ?quake|cyclone.*(landfall|warning)"),
    ("emergency", "critical",
     r"fire accident|building collaps|blast\b|explosion|gas leak"),
    ("weather", "high",
     r"heavy rain(fall)?|imd.*(red|orange) alert|rainfall warning|thunderstorm warning"),
    ("strike", "high",
     r"\bbandh\b|\bstrike\b|rasta roko|shutdown call|rail roko"),
    ("road_closure", "moderate",
     r"road (block|clos)|highway clos|traffic diversion|route diversion|flyover clos"),
    ("power_outage", "moderate",
     r"power cut|power outage|electricity (failure|shutdown)|"
     r"ts spdcl.*(outage|shutdown|maintenance)|tsspdcl.*(outage|shutdown|maintenance)|"
     r"tgspdcl.*(outage|shutdown|maintenance)"),
    ("water_supply", "moderate",
     r"water supply.*(cut|disrupt|suspend)|water shortage|hmwssb.*(shutdown|maintenance)"),
]

_FALLBACK_TELANGANA_KEYWORDS = (
    "telangana", "hyderabad", "cyberabad", "secunderabad", "warangal",
    "karimnagar", "khammam", "nizamabad", "malkajgiri", "rangareddy",
    "medchal", "adilabad", "nalgonda", "mahbubnagar", "siddipet",
    "ghmc", "hmda", "tsspdcl", "tgspdcl", "hmwssb", "revanth reddy",
)


def _regex_verdict(headline: str, description: str = "") -> AlertVerdict:
    text = (headline or "").lower()

    if not any(k in text for k in _FALLBACK_TELANGANA_KEYWORDS):
        return AlertVerdict(accepted=False, alert_type=None, severity=None,
                            source="regex", rejection_reason="not_telangana")

    for alert_type, severity, pattern in _FALLBACK_PATTERNS:
        if re.search(pattern, text, re.I):
            return AlertVerdict(accepted=True, alert_type=alert_type,
                                severity=severity, source="regex",
                                chosen_type=alert_type)

    return AlertVerdict(accepted=False, alert_type=None, severity=None,
                        source="regex", chosen_type=NO_ALERT,
                        rejection_reason="no_disruption")
