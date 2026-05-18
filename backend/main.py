from agents.content_monitor import ContentMonitor
from agents.content_generator import ContentGenerator
from agents.quality_checker import QualityChecker
from agents.price_sync_agent import PriceSyncAgent
from agents.news_sync_agent import NewsSyncAgent
from core.database import db
from core.logger import logger
import sys
import os

def run_full_cycle():
    """Run a complete maintenance cycle (for testing/manual runs)."""

    logger.info("=" * 70)
    logger.info("TELANGANA.LIVE CONTENT MAINTENANCE AGENT (Full Cycle)")
    logger.info("=" * 70)

    total_tokens = 0

    # STEP 0: Sync Real-Time Data (Prices & News)
    logger.info("🔄 STEP 0: Syncing real-time data (Gold, Fuel, News)...")
    try:
        # Sync Prices
        price_agent = PriceSyncAgent()
        price_agent.run()
        
        # Sync News
        news_agent = NewsSyncAgent()
        news_agent.process_news(limit=3)
        logger.info("✓ Data synchronization successful")
    except Exception as e:
        logger.error(f"✗ Data synchronization failed: {e}")

    # STEP 1: Monitor
    logger.info("🔍 STEP 1: Analysing content for updates...")
    monitor = ContentMonitor()
    analysis = monitor.run()
    if analysis:
        logger.info("✓ Content analysis complete")
    else:
        logger.error("✗ Content analysis failed")

    # STEP 2: Generate
    logger.info("✍️  STEP 2: Generating new content...")
    generator = ContentGenerator()
    results = generator.run()

    for result in results:
        status = "✓" if result['status'] == 'success' else "✗"
        tokens = result.get('tokens', 0)
        total_tokens += tokens
        logger.info(f"  {status} {result['topic']} (Tokens: {tokens})")

    # STEP 3: Quality Check
    logger.info("🛡️  STEP 3: Quality Check Pipeline...")
    checker = QualityChecker()
    checker.run()

    # STEP 4: View logs
    logger.info("📋 STEP 4: Recent activity log...")
    logs = db.get_activity_log(limit=10)

    if logs:
        logger.info(f"{'Timestamp':<20} {'Agent':<20} {'Action':<15} {'Tokens':>8}")
        for log in logs:
            timestamp = log['timestamp'][:19] if log['timestamp'] else 'N/A'
            agent = log['agent'][:19]
            action = log['action'][:14]
            tokens = log['tokens_used'] if log['tokens_used'] else 0
            logger.info(f"{timestamp:<20} {agent:<20} {action:<15} {tokens:>8}")
    else:
        logger.warning("No activity logs found.")

    logger.info("=" * 70)
    logger.info(f"Agent cycle complete! Total Tokens Used (Local): {total_tokens}")
    logger.info("=" * 70)


if __name__ == '__main__':
    run_full_cycle()
