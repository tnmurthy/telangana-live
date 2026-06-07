import unittest
from agents.works_agent import WorksAgent

class TestWorksAgent(unittest.TestCase):
    def setUp(self):
        self.agent = WorksAgent()

    def test_milestone_progress_calculation(self):
        project = {
            "id": "1",
            "title": "Drainage Work",
            "status": "in_progress",
            "total_budget": 1000000,
            "spent_budget": 500000,
            "milestones": [
                {"label": "Step 1", "status": "completed"},
                {"label": "Step 2", "status": "completed"},
                {"label": "Step 3", "status": "pending"},
                {"label": "Step 4", "status": "pending"}
            ]
        }
        analysis = self.agent.analyze_project(project)
        self.assertEqual(analysis.progress_percentage, 50.0)
        self.assertEqual(analysis.health_status, "On track")

    def test_over_budget_detection(self):
        project = {
            "id": "2",
            "title": "Road Repair",
            "status": "in_progress",
            "total_budget": 100000,
            "spent_budget": 150000,
            "milestones": []
        }
        analysis = self.agent.analyze_project(project)
        self.assertEqual(analysis.health_status, "Over budget")

if __name__ == '__main__':
    unittest.main()
