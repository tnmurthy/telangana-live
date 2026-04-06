import schedule
import time
import logging
import os
import sys
import subprocess
from agents.content_monitor import ContentMonitor
from agents.content_generator import ContentGenerator
from agents.quality_checker import QualityChecker
from config import CONFIG

# ── Ensure logs directory exists before the FileHandler is created ────────────
os.makedirs('logs', exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/scheduler.log'),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger(__name__)


def _run_script(script_path: str, *extra_args: str):
    """Run a Python script in a subprocess, logging success/failure."""
    try:
        subprocess.run([sys.executable, script_path, *extra_args], check=True)
        logger.info(f"✓ {os.path.basename(script_path)} {' '.join(extra_args)} complete")
    except Exception as e:
        logger.error(f"✗ {os.path.basename(script_path)} failed: {e}")


def _data_engine_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts', 'data_engine.py')


def _weather_scraper_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts', 'weather_scraper.py')


# ── Tier 1 – ~1 hour: News & Weather ─────────────────────────────────────────

def sync_news():
    """Hourly: refresh news feed."""
    logger.info("── Hourly: syncing news ──")
    _run_script(_data_engine_path(), '--task', 'news')


def sync_weather():
    """Hourly: refresh weather data for all Telangana districts."""
    logger.info("── Hourly: syncing weather ──")
    _run_script(_weather_scraper_path())


# ── Tier 2 – ~6 hours: Fuel, Commodities, AI Pulse ───────────────────────────

def sync_secondary():
    """Every 6 hours: refresh fuel prices, commodity prices, and AI pulse."""
    logger.info("── 6-hour: syncing fuel / pulses / AI pulse ──")
    _run_script(_data_engine_path(), '--task', 'fuel')
    _run_script(_data_engine_path(), '--task', 'pulses')
    _run_script(_data_engine_path(), '--task', 'ai_pulse')


# ── Tier 3 – ~12 hours: Gold & Silver ────────────────────────────────────────

def sync_gold_silver():
    """Every 12 hours: refresh gold and silver prices."""
    logger.info("── 12-hour: syncing gold/silver ──")
    _run_script(_data_engine_path(), '--task', 'gold')


# ── Twice-daily AI maintenance cycles (unchanged behaviour) ──────────────────

def morning_maintenance():
    """6 AM – Monitor and analyse content; sync real-time data."""
    logger.info("=" * 70)
    logger.info("MORNING MAINTENANCE CYCLE (6:00 AM)")
    logger.info("=" * 70)

    # Full data sync as part of morning cycle
    for task in ('news', 'gold', 'fuel', 'pulses'):
        _run_script(_data_engine_path(), '--task', task)
    _run_script(_weather_scraper_path())

    monitor = ContentMonitor()
    result = monitor.run()
    if result:
        logger.info("✓ Morning analysis complete")
    else:
        logger.warning("✗ Morning analysis failed")

    logger.info("=" * 70 + "\n")


def evening_maintenance():
    """6 PM – Generate and quality-check content."""
    logger.info("=" * 70)
    logger.info("EVENING MAINTENANCE CYCLE (6:00 PM)")
    logger.info("=" * 70)

    for task in ('news', 'gold', 'fuel', 'pulses'):
        _run_script(_data_engine_path(), '--task', task)
    _run_script(_weather_scraper_path())

    logger.info("Generating new content...")
    generator = ContentGenerator()
    results = generator.run()

    for result in results:
        status = "✓" if result['status'] == 'success' else "✗"
        logger.info(f"  {status} {result['topic']} ({result['tokens']} tokens)")

    logger.info("✓ Evening maintenance complete")
    logger.info("=" * 70 + "\n")


def run_scheduler():
    """Start the scheduler with tiered update frequencies."""

    # ── Tier 1: every hour ────────────────────────────────────────────────────
    schedule.every().hour.at(":00").do(sync_news)
    schedule.every().hour.at(":30").do(sync_weather)

    # ── Tier 2: every 6 hours ─────────────────────────────────────────────────
    for hour in range(0, 24, 6):
        schedule.every().day.at(f"{hour:02d}:15").do(sync_secondary)

    # ── Tier 3: every 12 hours ────────────────────────────────────────────────
    for hour in range(0, 24, 12):
        schedule.every().day.at(f"{hour:02d}:45").do(sync_gold_silver)

    # ── AI content maintenance: twice daily ───────────────────────────────────
    schedule.every().day.at(CONFIG['schedule_morning']).do(morning_maintenance)
    schedule.every().day.at(CONFIG['schedule_evening']).do(evening_maintenance)

    logger.info("\n" + "=" * 70)
    logger.info("TELANGANA.LIVE CONTENT AGENT SCHEDULER STARTED")
    logger.info("=" * 70)
    logger.info("Tier 1 – every hour     : news (:00), weather (:30)")
    logger.info("Tier 2 – every 6 hours  : fuel, commodities, AI pulse (:15)")
    logger.info("Tier 3 – every 12 hours : gold & silver (:45)")
    logger.info(f"Morning maintenance     : {CONFIG['schedule_morning']}")
    logger.info(f"Evening maintenance     : {CONFIG['schedule_evening']}")
    logger.info("=" * 70 + "\n")

    while True:
        schedule.run_pending()
        time.sleep(60)


if __name__ == '__main__':
    try:
        run_scheduler()
    except KeyboardInterrupt:
        logger.info("Scheduler stopped by user")


