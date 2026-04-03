from agents.content_monitor import ContentMonitor
from agents.content_generator import ContentGenerator
from agents.quality_checker import QualityChecker
from database import db
import logging
import subprocess
import sys
import os

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
    
    # STEP 0: Sync Data (Gold, Fuel, News)
    print("🔄 STEP 0: Syncing real-time data (Gold, Fuel, News)...")
    print("-" * 70)
    try:
        # Run scripts/data_engine.py as a subprocess to keep it isolated
        script_path = os.path.join(os.getcwd(), "scripts", "data_engine.py")
        result = subprocess.run([sys.executable, script_path], capture_output=True, text=True)
        if result.returncode == 0:
            print("✓ Data synchronization successful")
            print(result.stdout.strip().split('\n')[-1]) # Print the last line of output
        else:
            print(f"✗ Data synchronization failed: {result.stderr}")
    except Exception as e:
        print(f"✗ Error running data engine: {e}")
    print()

    # STEP 1: Monitor
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
