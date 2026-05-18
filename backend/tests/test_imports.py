import sys
import os
import unittest

# Ensure we can import from the backend root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class TestStructure(unittest.TestCase):
    def test_core_imports(self):
        """Verify that core modules can be imported."""
        try:
            from core.config import CONFIG
            from core.logger import logger
            self.assertIsNotNone(CONFIG)
            self.assertIsNotNone(logger)
        except ImportError as e:
            self.fail(f"Core import failed: {e}")

    def test_agent_imports(self):
        """Verify that agents can be imported with the new structure."""
        try:
            from agents.content_monitor import ContentMonitor
            from agents.content_generator import ContentGenerator
            self.assertIsNotNone(ContentMonitor)
            self.assertIsNotNone(ContentGenerator)
        except ImportError as e:
            self.fail(f"Agent import failed: {e}")

if __name__ == "__main__":
    unittest.main()
