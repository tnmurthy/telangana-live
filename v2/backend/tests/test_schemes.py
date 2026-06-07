import unittest
from agents.schemes_agent import SchemesAgent

class TestSchemesAgent(unittest.TestCase):
    def setUp(self):
        self.agent = SchemesAgent()

    def test_farmer_eligibility_match(self):
        user_profile = {"occupation": "farmer", "land_acres": 5}
        schemes = [{
            "id": "rythu-bandhu",
            "eligibility_json": {"occupation": "farmer", "land_acres": {"max": 50}},
            "benefits": "₹10,000/acre"
        }]
        results = self.agent.evaluate_eligibility(user_profile, schemes)
        self.assertTrue(results[0].is_eligible)
        self.assertIn("occupation", results[0].matching_criteria)
        self.assertIn("land_acres", results[0].matching_criteria)

    def test_income_failure(self):
        user_profile = {"occupation": "farmer", "annual_income": 200000}
        schemes = [{
            "id": "poverty-alleviation",
            "eligibility_json": {"annual_income": {"max": 100000}},
            "benefits": "Financial aid"
        }]
        results = self.agent.evaluate_eligibility(user_profile, schemes)
        self.assertFalse(results[0].is_eligible)
        self.assertIn("annual_income", results[0].missing_criteria)

if __name__ == '__main__':
    unittest.main()
