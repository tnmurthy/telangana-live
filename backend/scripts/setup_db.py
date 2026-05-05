import sys
import os

# Add parent directory to path to allow imports from core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import db
from core.logger import logger

def verify_and_setup():
    """
    Verifies if Supabase tables exist and provides instructions if not.
    """
    logger.info("Checking Supabase connection and schema...")
    
    try:
        # Test connection by trying to fetch content
        logger.info(f"Connecting to: {db.url}")
        
        # Check 'content' table
        try:
            db.client.table('content').select('id').limit(1).execute()
            logger.info("Table 'content' exists.")
        except Exception:
            logger.error("Table 'content' NOT FOUND. Please run supabase-schema.sql in the Supabase SQL Editor.")

        # Check 'activity_log' table
        try:
            db.client.table('activity_log').select('id').limit(1).execute()
            logger.info("Table 'activity_log' exists.")
        except Exception:
            logger.error("Table 'activity_log' NOT FOUND. Please run supabase-schema.sql in the Supabase SQL Editor.")

        logger.info("Database verification complete.")
        
    except Exception as e:
        logger.critical(f"Failed to connect to Supabase: {e}")
        print("\n[!] CRITICAL: Could not connect to Supabase.")
        print("Check your .env file and ensure SUPABASE_URL and SUPABASE_KEY are correct.")

if __name__ == "__main__":
    verify_and_setup()
