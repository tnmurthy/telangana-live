import sys
import os
import time

# Add parent directory to path to allow imports from core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.logger import logger
from core.database import db

def run_health_check():
    """
    Performs a system diagnostic check.
    Returns a status report of core systems.
    """
    report = {
        "status": "unhealthy",
        "timestamp": time.time(),
        "checks": {
            "database": "failed",
            "logger": "failed",
            "storage": "failed"
        }
    }

    try:
        # Check Logger
        logger.debug("Health check: Testing logger...")
        report["checks"]["logger"] = "pass"

        # Check Database Connection
        # Assuming db has a simple check or we can try to fetch 1 row
        try:
            db.get_activity_log(limit=1)
            report["checks"]["database"] = "pass"
        except Exception as e:
            logger.error(f"Health check: Database failed - {e}")

        # Check Storage (existence of logs)
        if os.path.exists("app.log") or os.path.exists("core/app.log"):
            report["checks"]["storage"] = "pass"

        # Final Status
        if all(v == "pass" for v in report["checks"].values()):
            report["status"] = "healthy"
            logger.info("System Health: PASS")
        else:
            logger.warning(f"System Health: PARTIAL - {report['checks']}")

    except Exception as e:
        logger.error(f"Health check: Critical failure - {e}")

    return report

if __name__ == "__main__":
    print(run_health_check())
