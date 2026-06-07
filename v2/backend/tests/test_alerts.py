import unittest
from agents.alerts_agent import AlertsAgent

class TestAlertsAgent(unittest.TestCase):
    def setUp(self):
        self.agent = AlertsAgent()

    def test_active_alerts_retrieval(self):
        area_id = "ghmc-95"
        alerts = self.agent.get_active_alerts(area_id)
        
        self.assertGreater(len(alerts), 0)
        self.assertEqual(alerts[0].is_active, True)
        # Verify geofencing simulation (should contain area-specific alert)
        self.assertTrue(any("Jubilee Hills" in a.message for a in alerts))

if __name__ == '__main__':
    unittest.main()
