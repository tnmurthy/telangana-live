import os
import logging
from datetime import datetime, timedelta

# Note: You will need to install the package if not already installed:
# pip install google-analytics-data
try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
    )
    HAS_GA = True
except ImportError:
    HAS_GA = False

logger = logging.getLogger(__name__)

class BusinessAnalyst:
    def __init__(self):
        self.property_id = os.environ.get("GA_PROPERTY_ID")
        self.credentials_path = os.path.join(os.getcwd(), "ga_credentials.json")

    def get_yesterdays_page_hits(self):
        """Fetch yesterday's page hits from Google Analytics 4."""
        if not HAS_GA:
            logger.error("google-analytics-data library not installed. Run: pip install google-analytics-data")
            return {"error": "Missing google-analytics-data package", "hits": 0}

        if not self.property_id:
            logger.warning("GA_PROPERTY_ID is not set in environment variables.")
            return {"error": "Missing GA_PROPERTY_ID", "hits": 0}

        if not os.path.exists(self.credentials_path):
            logger.warning(f"Google Analytics credentials not found at {self.credentials_path}.")
            return {"error": "Missing ga_credentials.json", "hits": 0}

        try:
            # Set environment variable so the Google Client uses this service account JSON
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = self.credentials_path

            client = BetaAnalyticsDataClient()
            
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                dimensions=[Dimension(name="pagePath")],
                metrics=[Metric(name="screenPageViews")],
                date_ranges=[DateRange(start_date="yesterday", end_date="yesterday")],
            )
            
            response = client.run_report(request)
            
            total_hits = 0
            details = []
            
            for row in response.rows:
                page_path = row.dimension_values[0].value
                views = int(row.metric_values[0].value)
                total_hits += views
                details.append({"path": page_path, "views": views})
                
            return {
                "status": "success",
                "total_hits": total_hits,
                "breakdown": details,
                "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            }
            
        except Exception as e:
            logger.error(f"Failed to fetch GA data: {e}")
            return {"error": str(e), "hits": 0}

    def run(self):
        logger.info("Business Analyst starting report generation...")
        report = self.get_yesterdays_page_hits()
        logger.info(f"Report generated: {report}")
        return report

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    analyst = BusinessAnalyst()
    print(analyst.run())
