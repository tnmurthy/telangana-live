import requests, re, json
from datetime import datetime
from bs4 import BeautifulSoup

def scrape_history():
    url = "https://www.bankbazaar.com/gold-rate-hyderabad.html"
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    html = resp.text
    soup = BeautifulSoup(html, "html.parser")
    
    history = []
    # Find all tables
    tables = soup.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        # A history table usually has "Date" in the first row
        if rows and "Date" in rows[0].get_text():
            for row in rows[1:]:
                cols = row.find_all("td")
                if len(cols) >= 3:
                    date_str = cols[0].get_text().strip()
                    p24_str = cols[1].get_text().strip().replace("₹", "").replace(",", "")
                    p22_str = cols[2].get_text().strip().replace("₹", "").replace(",", "")
                    
                    try:
                        p24 = float(p24_str)
                        p22 = float(p22_str)
                        
                        def normalize(val):
                            if val > 30000: return val / 10
                            if val > 10000: return val / 2 # some sites show 2g
                            return val
                            
                        dt = datetime.strptime(date_str, "%d %b %Y")
                        history.append({
                            "date": dt.strftime("%Y-%m-%d"),
                            "gold22k": round(normalize(p22), 2),
                            "gold24k": round(normalize(p24), 2),
                            "silver": 0
                        })
                    except:
                        pass
    
    # Dedup and sort
    seen = set()
    unique_history = []
    for h in sorted(history, key=lambda x: x["date"], reverse=True):
        if h["date"] not in seen:
            unique_history.append(h)
            seen.add(h["date"])
            
    return sorted(unique_history, key=lambda x: x["date"])

if __name__ == "__main__":
    h = scrape_history()
    print(json.dumps(h, indent=2))
