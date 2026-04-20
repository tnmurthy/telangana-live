import requests

def check(name, url):
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"}, timeout=15)
        print(f"{name}: {resp.status_code}")
        if resp.status_code == 200:
            print(f"  Length: {len(resp.text)}")
            return resp.text
    except Exception as e:
        print(f"{name} Error: {e}")
    return None

check("HT Fuel", "https://www.hindustantimes.com/fuel-prices/hyderabad")
check("PaisaBazaar Fuel", "https://www.paisabazaar.com/fuel-prices/petrol-price-in-hyderabad/")
check("IndianOil", "https://www.iocl.com/petrol-diesel-price")
