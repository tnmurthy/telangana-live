from fastapi import FastAPI, HTTPException
import sys
import os

# Ensure the root and scripts folders are in the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts"))

from data_engine import sync_gold, sync_fuel, sync_pulses
from whatsapp_bot import build_summary, send_whatsapp_message

app = FastAPI(
    title="Telangana.live APIs",
    description="API for validating and viewing the scraped data and triggering backend agents like WhatsApp summaries.",
    version="1.0.0"
)

@app.get("/api/gold", tags=["Scrapers"])
def get_gold_rates():
    """Scrapes and returns the latest gold rates for Hyderabad."""
    try:
        data = sync_gold()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/fuel", tags=["Scrapers"])
def get_fuel_prices():
    """Scrapes and returns the latest fuel prices for Hyderabad."""
    try:
        data = sync_fuel()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/mandi", tags=["Scrapers"])
def get_mandi_prices():
    """Scrapes and returns the latest Mandi (Pulse) prices for Hyderabad."""
    try:
        data = sync_pulses()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/whatsapp/send-summary", tags=["Notifications"])
def trigger_whatsapp_summary():
    """Scrapes data and sends a summary message via the WhatsApp bot."""
    try:
        gold_data = sync_gold()
        fuel_data = sync_fuel()
        pulse_data = sync_pulses()
        message = build_summary(gold_data, fuel_data, pulse_data)
        send_whatsapp_message(message)
        return {"status": "success", "message": "WhatsApp summary triggered."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
