from fastapi.testclient import TestClient
import os
import sys

# Setup path
sys.path.insert(0, os.getcwd())
from api_server import app

client = TestClient(app)

def test_civic_gateway():
    print("Testing Civic Gateway API Endpoints...")

    # 1. Test News Endpoint
    print("Checking News Endpoint...")
    response = client.get("/api/civic/news")
    # It might trigger a long scrape if file missing, so we just check for 200 or 500 (if network issue)
    # But for a test in this environment, let's assume it should work.
    assert response.status_code == 200
    print(f"  ✅ News: Received {len(response.json())} items.")

    # 2. Test News Filtering
    print("Checking News Filtering (Hyderabad)...")
    response = client.get("/api/civic/news?district=Hyderabad")
    assert response.status_code == 200
    print(f"  ✅ Filtered News: Received {len(response.json())} items.")

    # 3. Test Alerts Endpoint
    print("Checking Alerts Endpoint...")
    response = client.get("/api/civic/alerts")
    assert response.status_code == 200
    print(f"  ✅ Alerts: Received {len(response.json())} real-time alerts.")

    # 4. Test Services Endpoint
    print("Checking Services Endpoint...")
    response = client.get("/api/civic/services")
    assert response.status_code == 200
    services = response.json()
    assert len(services) > 0
    assert "GHMC" in services[0]["name"]
    print("  ✅ Services: Registry retrieved successfully.")

    print("\n🎉 Civic Gateway Verification Successful!")

if __name__ == "__main__":
    test_civic_gateway()
