import unittest
from agents.bridge_agent import BridgeAgent

class TestBridgeAgent(unittest.TestCase):
    def setUp(self):
        # We don't initialize real Supabase client for logic test
        # We test the private mapping methods
        self.agent = BridgeAgent.__new__(BridgeAgent)

    def test_category_mapping(self):
        self.assertEqual(self.agent._map_category("News"), "civic")
        self.assertEqual(self.agent._map_category("Scheme"), "civic")
        self.assertEqual(self.agent._map_category("Emergency"), "weather")
        self.assertEqual(self.agent._map_category("Unknown"), "other")

if __name__ == '__main__':
    unittest.main()
