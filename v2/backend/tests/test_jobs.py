import unittest
from agents.jobs_agent import JobsAgent

class TestJobsAgent(unittest.TestCase):
    def setUp(self):
        self.agent = JobsAgent()

    def test_job_matching_logic(self):
        area_id = "ghmc-95"
        user_prefs = {"category": "it"}
        jobs = self.agent.get_matched_jobs(area_id, user_prefs)
        
        # Verify IT job is returned and has high match score
        it_jobs = [j for j in jobs if j.category == "it"]
        self.assertGreater(len(it_jobs), 0)
        self.assertGreaterEqual(it_jobs[0].match_score, 90)

    def test_local_job_prioritization(self):
        area_id = "ghmc-95"
        jobs = self.agent.get_matched_jobs(area_id, {})
        
        # Verify local job is present
        local_jobs = [j for j in jobs if j.location == area_id]
        self.assertGreater(len(local_jobs), 0)

if __name__ == '__main__':
    unittest.main()
