import unittest
from unittest.mock import MagicMock, patch
from agents.news_agent import NewsAgent

class TestNewsAgent(unittest.TestCase):
    @patch('google.generativeai.GenerativeModel')
    def test_news_classification_structure(self, mock_model):
        # Mock the Gemini response
        mock_response = MagicMock()
        mock_response.text = '{"summary": "Test summary", "category": "civic", "relevance_score": 90, "sentiment": "positive", "is_civic": true}'
        mock_model.return_value.generate_content.return_value = mock_response
        
        agent = NewsAgent()
        title = "Pipeline leak causes water shortage in Gachibowli"
        content = "A major pipeline burst near DLF has disrupted supply for 48 hours."
        district = "Hyderabad"
        
        classification = agent.classify_article(title, content, district)
        
        # Verify the classified object structure
        self.assertEqual(classification.title, title)
        self.assertIsInstance(classification.relevance_score, int)
        # Even if the mock text isn't parsed yet (due to the agent stub), 
        # the agent should hit the 'try' block and return the success model.
        self.assertTrue(classification.is_civic)
        self.assertIn(classification.category, ["civic", "politics", "crime", "development", "weather", "other"])

if __name__ == '__main__':
    unittest.main()
