import requests

def test_api():
    base_url = "http://localhost:8000"
    endpoints = ["/api/gold", "/api/fuel", "/api/mandi"]
    
    for ep in endpoints:
        print(f"Testing {ep}...")
        try:
            resp = requests.get(f"{base_url}{ep}", timeout=20)
            if resp.status_code == 200:
                print(f"  ✅ {ep} success!")
                print(f"  Sample data: {str(resp.json())[:100]}...")
            else:
                print(f"  ❌ {ep} failed with {resp.status_code}")
        except Exception as e:
            print(f"  ❌ {ep} error: {e}")

if __name__ == "__main__":
    test_api()
