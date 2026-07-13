import requests, datetime
from bs4 import BeautifulSoup

def debug_live_chennai():
    url = "https://www.livechennai.com/gold_silverrate_hyderabad.asp"
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(resp.text, "html.parser")
    tables = soup.find_all("table")
    for table in tables:
        table_text = table.get_text().lower()
        if "24 k" in table_text and "date" in table_text:
            rows = table.find_all("tr")
            print(f"Found table with {len(rows)} rows.")
            for row in rows:
                cols = row.find_all("td")
                if len(cols) >= 3:
                    date_raw = cols[0].get_text(strip=True)
                    p24_raw = cols[1].get_text(strip=True).replace(",", "").split("(")[0].strip()
                    p22_raw = cols[2].get_text(strip=True).replace(",", "").split("(")[0].strip()
                    print(f"Row: '{date_raw}' | '{p24_raw}' | '{p22_raw}'")
                    try:
                        dt = None
                        for fmt in ["%d/%b/%Y", "%d/%m/%Y"]:
                            try:
                                dt = datetime.datetime.strptime(date_raw, fmt)
                                break
                            except: continue
                        if dt:
                            print(f"  Parsed Date: {dt}")
                    except Exception as e:
                        print(f"  Error: {e}")

if __name__ == "__main__":
    debug_live_chennai()
