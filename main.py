from agents.content_monitor import ContentMonitor
from agents.content_generator import ContentGenerator
from agents.quality_checker import QualityChecker
from database import db
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def run_full_cycle():
    """Run a complete maintenance cycle (for testing/manual runs)"""
    
    print("\n" + "="*70)
    print("TELANGANA.LIVE CONTENT MAINTENANCE AGENT (Full Cycle)")
    print("="*70 + "\n")
    
    # STEP 1: Monitor
    print("📊 STEP 1: Monitoring content...")
    print("-" * 70)
    monitor = ContentMonitor()
    analysis = monitor.run()
    if analysis:
        print("✓ Content analysis complete\n")
    else:
        print("✗ Content analysis failed\n")
    
    # STEP 2: Generate
    print("✍️  STEP 2: Generating new content...")
    print("-" * 70)
    generator = ContentGenerator()
    results = generator.run()
    
    for result in results:
        status = "✓" if result['status'] == 'success' else "✗"
        print(f"  {status} {result['topic']}")
        print(f"     Tokens: {result['tokens']}")
    
    print()
    
    # STEP 3: View logs
    print("📋 STEP 3: Recent activity log...")
    print("-" * 70)
    logs = db.get_activity_log(limit=15)
    
    if logs:
        print(f"{'Timestamp':<20} {'Agent':<20} {'Action':<15} {'Tokens':>8}")
        print("-" * 70)
        for log in logs:
            timestamp = log['timestamp'][:19] if log['timestamp'] else 'N/A'
            agent = log['agent'][:19]
            action = log['action'][:14]
            tokens = log['tokens_used'] if log['tokens_used'] else 0
            print(f"{timestamp:<20} {agent:<20} {action:<15} {tokens:>8}")
    else:
        print("No activity logs found.")
    
    print("\n" + "="*70)
    print("Agent cycle complete!")
    print("="*70 + "\n")

if __name__ == '__main__':
    run_full_cycle()
