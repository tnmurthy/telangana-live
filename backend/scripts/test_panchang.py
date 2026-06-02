import unittest
from datetime import datetime
from unittest.mock import patch, MagicMock
from panchang import get_vikram_samvat, answer_muhurat_query

class TestPanchang(unittest.TestCase):
    def test_get_vikram_samvat_default(self):
        # Test without specifying datetime, should use current time
        result = get_vikram_samvat()
        self.assertIn('year', result)
        self.assertIn('month', result)
        self.assertIn('tithi', result)
        self.assertIn('sunrise', result)
        self.assertIn('nakshatra', result)

    def test_get_vikram_samvat_fixed_date(self):
        # Use a fixed date to test consistent output
        dt = datetime(2023, 1, 1, 12, 0, 0)
        result = get_vikram_samvat(dt)
        self.assertEqual(result['year'], 2079)  # Check Samvat offset
        self.assertTrue(isinstance(result['tithi'], str))
        self.assertTrue(isinstance(result['nakshatra'], str))

    @patch('panchang.llm')
    def test_answer_muhurat_query_vehicle(self, mock_llm):
        mock_llm.generate.return_value = {
            "text": '{"decision": "Wait", "explanation": "Wait for a solid Muhurat."}',
            "tokens": 50
        }
        result = answer_muhurat_query("Is it a good day to buy a vehicle?")
        self.assertEqual(result['decision'], "Wait")
        self.assertIn("Wait for a solid Muhurat", result['explanation'])

    @patch('panchang.llm')
    def test_answer_muhurat_query_business(self, mock_llm):
        mock_llm.generate.return_value = {
            "text": '{"decision": "Yes", "explanation": "Today is favorable for new beginnings."}',
            "tokens": 60
        }
        result = answer_muhurat_query("Starting a new business today")
        self.assertEqual(result['decision'], "Yes")
        self.assertIn("favorable for new beginnings", result['explanation'])

    def test_answer_muhurat_query_invalid(self):
        result = answer_muhurat_query("")
        self.assertEqual(result['decision'], "Error")
        self.assertIn("Please provide a valid query", result['explanation'])
        
        result_none = answer_muhurat_query(None)
        self.assertEqual(result_none['decision'], "Error")

if __name__ == '__main__':
    unittest.main()
