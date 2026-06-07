import unittest
from datetime import datetime, timedelta
from agents.water_agent import WaterAgent

class TestWaterAgent(unittest.TestCase):
    def setUp(self):
        self.agent = WaterAgent()

    def test_next_window_calculation(self):
        area_id = "ghmc-95"
        # Mock schedule: Everyday at 4 PM
        schedules = [
            {"day_of_week": i, "start_time": "16:00:00", "duration_minutes": 120}
            for i in range(7)
        ]
        
        window = self.agent.get_next_window(area_id, schedules)
        self.assertIsNotNone(window)
        self.assertEqual(window.duration_minutes, 120)
        self.assertIsInstance(window.next_start, datetime)

if __name__ == '__main__':
    unittest.main()
