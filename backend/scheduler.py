import schedule
import time
import logging
import os
import sys
import subprocess
from agents.content_monitor import ContentMonitor
from agents.content_generator import ContentGenerator
from agents.quality_checker import QualityChecker
from core.config import CONFIG

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
    """Run a Python script in a subprocess with optional extra arguments, logging success/failure."""
    try:
        subprocess.run([sys.executable, script_path, *extra_args], check=True)
        logger.info(f"✓ {os.path.basename(script_path)} {' '.join(extra_args)} complete")
    except Exception as e:
        logger.error(f"✗ {os.path.basename(script_path)} failed: {e}")


def _data_engine_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts', 'data_engine.py')


def _weather_scraper_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts', 'weather_scraper.py')


def _water_scraper_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts', 'water_scraper.py')


# ── Tier 1 – ~1 hour: News & Weather ─────────────────────────────────────────

def sync_news():
    """Hourly: refresh news feed."""
    logger.info("── Hourly: syncing news ──")
    _run_script(_data_engine_path(), '--task', 'news')


def sync_weather():
    """Hourly: refresh weather data for all Telangana districts."""
    logger.info("── Hourly: syncing weather ──")
    _run_script(_weather_scraper_path())


def sync_alerts():
    """Every 2 hours: refresh the local civic alerts feed (floods, power/water
    outages, road closures, strikes, weather warnings)."""
    logger.info("── 2-hour: syncing local alerts ──")
    _run_script(_data_engine_path(), '--task', 'alerts')


# ── Tier 2 – ~6 hours: Fuel, Commodities, AI Pulse ───────────────────────────

def sync_secondary():
    """Every 6 hours: refresh fuel prices, commodity prices."""
    logger.info("── 6-hour: syncing fuel / pulses ──")
    _run_script(_data_engine_path(), '--task', 'fuel')
    _run_script(_data_engine_path(), '--task', 'pulses')


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
    for task in ('news', 'gold', 'fuel', 'pulses', 'ai_pulse', 'alerts'):
        _run_script(_data_engine_path(), '--task', task)
    _run_script(_weather_scraper_path())
    _run_script(_water_scraper_path())

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

    for task in ('news', 'gold', 'fuel', 'pulses', 'alerts'):
        _run_script(_data_engine_path(), '--task', task)
    _run_script(_weather_scraper_path())
    _run_script(_water_scraper_path())

    logger.info("Generating new content...")
    generator = ContentGenerator()
    results = generator.run()

    for result in results:
        status = "✓" if result['status'] == 'success' else "✗"
        logger.info(f"  {status} {result['topic']} ({result['tokens']} tokens)")

    logger.info("Running quality checks on newly generated content...")
    checker = QualityChecker()
    checker.run()

    logger.info("✓ Evening maintenance complete")
    logger.info("=" * 70 + "\n")


def run_scheduler():
    """Start the scheduler with tiered update frequencies."""

    # ── Tier 1: News & Weather ────────────────────────────────────────────────
    news_interval = CONFIG.get('news_sync_interval_hours', 1)
    if news_interval == 1:
        schedule.every().hour.at(":00").do(sync_news)
    else:
        schedule.every(news_interval).hours.at(":00").do(sync_news)
        
    schedule.every().hour.at(":30").do(sync_weather)

    # Alerts refresh independently on its own 2-hour cadence (configurable)
    alerts_interval = CONFIG.get('alerts_sync_interval_hours', 2)
    for hour in range(0, 24, alerts_interval):
        schedule.every().day.at(f"{hour:02d}:10").do(sync_alerts)

    # ── Tier 2: Fuel, Commodities, AI Pulse ───────────────────────────────────
    sec_interval = CONFIG.get('secondary_sync_interval_hours', 3)
    for hour in range(0, 24, sec_interval):
        schedule.every().day.at(f"{hour:02d}:15").do(sync_secondary)

    # ── Tier 3: Gold & Silver ─────────────────────────────────────────────────
    gold_interval = CONFIG.get('gold_sync_interval_hours', 12)
    for hour in range(0, 24, gold_interval):
        schedule.every().day.at(f"{hour:02d}:45").do(sync_gold_silver)

    # ── AI content maintenance: twice daily ───────────────────────────────────
    schedule.every().day.at(CONFIG['schedule_morning']).do(morning_maintenance)
    schedule.every().day.at(CONFIG['schedule_evening']).do(evening_maintenance)

    logger.info("\n" + "=" * 70)
    logger.info("TELANGANA.LIVE CONTENT AGENT SCHEDULER STARTED")
    logger.info("=" * 70)
    logger.info(f"Tier 1 – every {news_interval} hour(s)   : news (:00), weather (:30)")
    logger.info(f"Alerts – every {alerts_interval} hour(s)   : local alerts feed (:10)")
    logger.info(f"Tier 2 – every {sec_interval} hour(s)   : fuel, commodities (:15)")
    logger.info(f"Tier 3 – every {gold_interval} hour(s)  : gold & silver (:45)")
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


