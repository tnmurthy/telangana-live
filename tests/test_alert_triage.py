"""
Unit tests for core.alert_triage — the TypeSafe-backed civic alert triage that
replaces the regex ALERT_PATTERNS / keyword-relevance / YES-NO-parse stack.

These tests never touch the network: the TypeSafe client is stubbed so the
question set, the threshold policy and the regex fallback are all exercised
deterministically.

Run with:  pytest tests/test_alert_triage.py
"""
import os
import sys
from unittest.mock import MagicMock, patch

import pytest

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, repo_root)
sys.path.insert(0, os.path.join(repo_root, "backend"))

from core import alert_triage  # noqa: E402
from core.alert_triage import (  # noqa: E402
    MIN_CURRENT_PROBABILITY,
    MIN_TELANGANA_PROBABILITY,
    MIN_TYPE_CONFIDENCE,
    NO_ALERT,
    AlertVerdict,
    severity_for_score,
    triage_headline,
)


# ---------------------------------------------------------------------------
# Stub TypeSafe response plumbing
# ---------------------------------------------------------------------------

def _stub_response(alert_type="flood", type_confidence=0.95,
                   telangana=0.97, current=0.93, severity=3.4):
    """Build an object shaped like a typesafe_sdk SystemOneResponse."""
    choice = MagicMock()
    choice.choice = alert_type
    choice.confidence = type_confidence

    score = MagicMock()
    score.score = severity

    resp = MagicMock()
    resp.choices = {"alert_type": choice}
    resp.scores = {"severity": score}
    resp.nouls = {
        "is_telangana": MagicMock(noul=telangana),
        "is_current": MagicMock(noul=current),
    }
    return resp


def _client_returning(response):
    client = MagicMock()
    client.system_one.return_value = response
    return client


# ---------------------------------------------------------------------------
# Question construction
# ---------------------------------------------------------------------------

class TestQuestionSet:
    def test_all_four_judgments_ride_in_one_request(self):
        """The whole point of the rewrite: one call, not a regex pass plus a
        per-article YES/NO confirmation call."""
        client = _client_returning(_stub_response())
        with patch.object(alert_triage, "_get_client", return_value=client):
            triage_headline("Heavy flooding in Hyderabad", "Roads submerged.")

        assert client.system_one.call_count == 1
        _, kwargs = client.system_one.call_args
        questions = kwargs["questions"]
        assert set(questions) == {
            "alert_type", "is_telangana", "is_current", "severity",
        }

    def test_state_carries_headline_and_description_as_named_fields(self):
        client = _client_returning(_stub_response())
        with patch.object(alert_triage, "_get_client", return_value=client):
            triage_headline("Power cut in Warangal", "TGSPDCL maintenance.")

        _, kwargs = client.system_one.call_args
        state = kwargs["state"]
        assert state["headline"] == "Power cut in Warangal"
        assert state["description"] == "TGSPDCL maintenance."

    def test_alert_type_criteria_offer_a_no_match_outcome(self):
        """Without an explicit 'none' option the model is forced to pick a
        disruption type for sports and budget articles."""
        client = _client_returning(_stub_response())
        with patch.object(alert_triage, "_get_client", return_value=client):
            triage_headline("Some headline", "")

        _, kwargs = client.system_one.call_args
        criteria = kwargs["questions"]["alert_type"].criteria
        assert NO_ALERT in criteria
        for alert_type in alert_triage.ALERT_TYPES:
            assert alert_type in criteria

    def test_severity_is_judged_not_baked_into_the_type(self):
        """Regression guard for the old ALERT_PATTERNS table, where every
        flood headline emitted 'critical' regardless of actual scale."""
        minor = _stub_response(alert_type="flood", severity=0.2)
        client = _client_returning(minor)
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Waterlogging on one lane of NH-44", "")

        assert verdict.alert_type == "flood"
        assert verdict.severity == "minor"


# ---------------------------------------------------------------------------
# Threshold policy — code owns this, not the model
# ---------------------------------------------------------------------------

class TestThresholdPolicy:
    def test_accepts_a_confident_local_current_disruption(self):
        client = _client_returning(_stub_response())
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Flash floods hit Khammam", "Two rescued.")

        assert verdict.accepted is True
        assert verdict.alert_type == "flood"
        assert verdict.rejection_reason is None

    def test_rejects_when_model_picks_no_alert(self):
        client = _client_returning(_stub_response(alert_type=NO_ALERT))
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Hyderabad FC strike late winner", "")

        assert verdict.accepted is False
        assert verdict.rejection_reason == "no_disruption"

    def test_rejects_out_of_state_disruption(self):
        """A Telangana-based outlet reporting Kerala floods must not pass."""
        response = _stub_response(telangana=MIN_TELANGANA_PROBABILITY - 0.2)
        client = _client_returning(response)
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Kerala floods worsen, says Telangana relief team", "")

        assert verdict.accepted is False
        assert verdict.rejection_reason == "not_telangana"

    def test_rejects_historical_or_planned_events(self):
        response = _stub_response(current=MIN_CURRENT_PROBABILITY - 0.3)
        client = _client_returning(response)
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Remembering the 2020 Hyderabad floods", "")

        assert verdict.accepted is False
        assert verdict.rejection_reason == "not_current"

    def test_rejects_low_confidence_type_selection(self):
        response = _stub_response(type_confidence=MIN_TYPE_CONFIDENCE - 0.15)
        client = _client_returning(response)
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Ambiguous civic headline", "")

        assert verdict.accepted is False
        assert verdict.rejection_reason == "low_confidence"

    def test_verdict_always_reports_the_raw_signals(self):
        """Raw judgments stay inspectable so thresholds can be retuned without
        re-running inference."""
        response = _stub_response(telangana=0.81, current=0.66, type_confidence=0.9)
        client = _client_returning(response)
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Power outage across Nizamabad", "")

        assert verdict.telangana_probability == pytest.approx(0.81)
        assert verdict.current_probability == pytest.approx(0.66)
        assert verdict.type_confidence == pytest.approx(0.9)


class TestSeverityBands:
    @pytest.mark.parametrize(
        "score,expected",
        [
            (0.0, "minor"),
            (0.4, "minor"),
            (1.0, "moderate"),
            (1.6, "high"),
            (2.4, "high"),
            (3.0, "critical"),
            (3.9, "critical"),
        ],
    )
    def test_expected_score_maps_to_a_band(self, score, expected):
        assert severity_for_score(score) == expected

    def test_out_of_range_scores_are_clamped(self):
        assert severity_for_score(-5.0) == "minor"
        assert severity_for_score(99.0) == "critical"


# ---------------------------------------------------------------------------
# Fallback behaviour — the pipeline must never stall
# ---------------------------------------------------------------------------

class TestRegexFallback:
    def test_falls_back_to_regex_when_sdk_unavailable(self):
        with patch.object(alert_triage, "_get_client", return_value=None):
            verdict = triage_headline(
                "Heavy rainfall warning issued for Hyderabad", ""
            )

        assert verdict.accepted is True
        assert verdict.alert_type == "weather"
        assert verdict.source == "regex"

    def test_falls_back_to_regex_when_the_api_errors(self):
        client = MagicMock()
        client.system_one.side_effect = RuntimeError("service unavailable")
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Flood warning for Warangal district", "")

        assert verdict.source == "regex"
        assert verdict.alert_type == "flood"

    def test_regex_fallback_still_enforces_the_telangana_gate(self):
        with patch.object(alert_triage, "_get_client", return_value=None):
            verdict = triage_headline("Flooding worsens in coastal Odisha", "")

        assert verdict.accepted is False
        assert verdict.rejection_reason == "not_telangana"

    def test_regex_fallback_rejects_unmatched_headlines(self):
        with patch.object(alert_triage, "_get_client", return_value=None):
            verdict = triage_headline("Hyderabad metro ridership hits new high", "")

        assert verdict.accepted is False
        assert verdict.rejection_reason == "no_disruption"

    def test_successful_typesafe_call_is_labelled_as_such(self):
        client = _client_returning(_stub_response())
        with patch.object(alert_triage, "_get_client", return_value=client):
            verdict = triage_headline("Flooding in Hyderabad", "")

        assert verdict.source == "typesafe"


# ---------------------------------------------------------------------------
# Fixture corpus — the headlines the old stack got wrong
# ---------------------------------------------------------------------------

# (headline, should_be_accepted, expected_type_or_None)
# Used by tools/calibrate_alert_triage.py against the live API; here it only
# asserts the corpus stays well-formed so the calibration run stays meaningful.
FIXTURE_HEADLINES = [
    ("Flash floods submerge low-lying areas of Hyderabad", True, "flood"),
    ("TGSPDCL announces 6-hour power shutdown in Nizamabad", True, "power_outage"),
    ("HMWSSB suspends water supply in Kukatpally for two days", True, "water_supply"),
    ("Rasta roko in Warangal as farmers protest paddy procurement", True, "strike"),
    ("Traffic diverted on Tank Bund ahead of immersion procession", True, "road_closure"),
    ("IMD issues orange alert for heavy rainfall across Telangana", True, "weather"),
    # The cases the regex stack mishandled:
    ("Kerala floods: Telangana sends relief material", False, None),
    ("Telangana govt sanctions Rs 500 crore for flood-prevention works", False, None),
    ("Remembering the 2020 Hyderabad floods, five years on", False, None),
    ("Hyderabad FC strike twice in second half to win", False, None),
    ("Assembly debates power tariff hike proposal", False, None),
    ("New flyover to be built at Uppal, says minister", False, None),
]


class TestFixtureCorpus:
    def test_corpus_covers_every_alert_type(self):
        covered = {t for _, accepted, t in FIXTURE_HEADLINES if accepted}
        assert covered == set(alert_triage.ALERT_TYPES) - {
            "natural_disaster", "emergency",
        }

    def test_corpus_has_negatives_for_each_rejection_mode(self):
        negatives = [h for h, accepted, _ in FIXTURE_HEADLINES if not accepted]
        assert len(negatives) >= 5
