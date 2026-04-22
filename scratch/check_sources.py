import requests

def check(name, url):
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, timeout=15)
        print(f"{name}: {resp.status_code}")
        if resp.status_code == 200:
            print(f"  Length: {len(resp.text)}")
    except Exception as e:
        print(f"{name} Error: {e}")

check("ET Fuel", "https://economictimes.indiatimes.com/wealth/fuel-depot/petrol-price-in-hyderabad")
check("ET Gold", "https://economictimes.indiatimes.com/marketstats/pid-160,exchange-50,sortby-percentChange,sortorder-desc,symbol-GOLD.cms")
check("LiveMint Gold", "https://www.livemint.com/gold-prices/hyderabad")
check("BusinessLine Fuel", "https://www.thehindubusinessline.com/economy/logistics/petrol-diesel-price-today-hyderabad/")
