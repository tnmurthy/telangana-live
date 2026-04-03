import schedule
import time
import logging
from agents.content_monitor import ContentMonitor
from agents.content_generator import ContentGenerator
from agents.quality_checker import QualityChecker
from config import CONFIG
import subprocess
import sys
import os

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/scheduler.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def morning_maintenance():
    """
    6 AM - Monitor and analyze content
    Check what needs updating and sync real-time data
    """
    logger.info("="*70)
    logger.info("MORNING MAINTENANCE CYCLE (6:00 AM)")
    logger.info("="*70)
    
    # Sync Data
    logger.info("Syncing real-time data (Gold, Fuel, News)...")
    try:
        script_path = os.path.join(os.getcwd(), "scripts", "data_engine.py")
        subprocess.run([sys.executable, script_path], check=True)
        logger.info("✓ Data sync complete")
    except Exception as e:
        logger.error(f"✗ Data sync failed: {e}")
    
    
    monitor = ContentMonitor()
    result = monitor.run()
    
    if result:
        logger.info("✓ Morning analysis complete")
    else:
        logger.warning("✗ Morning analysis failed")
    
    logger.info("="*70 + "\n")

def evening_maintenance():
    """
    6 PM - Generate and quality check content
    Create new articles and improve existing ones
    """
    logger.info("="*70)
    logger.info("EVENING MAINTENANCE CYCLE (6:00 PM)")
    logger.info("="*70)

    # Sync Data
    logger.info("Syncing real-time data (Gold, Fuel, News)...")
    try:
        script_path = os.path.join(os.getcwd(), "scripts", "data_engine.py")
        subprocess.run([sys.executable, script_path], check=True)
        logger.info("✓ Data sync complete")
    except Exception as e:
        logger.error(f"✗ Data sync failed: {e}")
    
    
    # Generate new content
    logger.info("Generating new content...")
    generator = ContentGenerator()
    results = generator.run()
    
    for result in results:
        status = "✓" if result['status'] == 'success' else "✗"
        logger.info(f"  {status} {result['topic']} ({result['tokens']} tokens)")
    
    logger.info("✓ Evening maintenance complete")
    logger.info("="*70 + "\n")

def run_scheduler():
    """Start the scheduler and run jobs at scheduled times"""
    
    # Schedule jobs
    schedule.every().day.at(CONFIG['schedule_morning']).do(morning_maintenance)
    schedule.every().day.at(CONFIG['schedule_evening']).do(evening_maintenance)
    
    logger.info("\n" + "="*70)
    logger.info("TELANGANA.LIVE CONTENT AGENT SCHEDULER STARTED")
    logger.info("="*70)
    logger.info(f"Morning maintenance:  {CONFIG['schedule_morning']}")
    logger.info(f"Evening maintenance:  {CONFIG['schedule_evening']}")
    logger.info("="*70 + "\n")
    
    # Keep scheduler running
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == '__main__':
    try:
        run_scheduler()
    except KeyboardInterrupt:
        logger.info("Scheduler stopped by user")
