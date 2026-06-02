
import sys, os
import datetime

# Setup path
sys.path.insert(0, os.path.join(os.getcwd(), 'backend', 'scripts'))
import data_engine

def test_reproduction():
    print("Testing current sync_gold with 2026-06-02 date...")
    # Mocking NOW to simulate today
    data_engine.NOW = '2026-06-02 10:00:00'
    
    # We know the current sync_gold fails on '02/June/2026' format
    res = data_engine.sync_gold()
    
    # Current fallback values
    FALLBACK_24K = 15704.0
    
    if res['gold24k']['price'] == FALLBACK_24K:
        print("❌ BUG REPRODUCED: Scraper failed and used fallback values.")
        print(f"   Value: {res['gold24k']['price']} (Matches Fallback)")
    else:
        print("✅ Scraper worked! (Wait, it was supposed to fail for reproduction)")
        print(f"   Value: {res['gold24k']['price']}")

if __name__ == "__main__":
    test_reproduction()
