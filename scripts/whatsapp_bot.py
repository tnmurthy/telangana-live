#!/usr/bin/env python3
"""
whatsapp_bot.py — Telangana.live daily summary sender
Scrapes the latest gold and fuel prices via data_engine.py and sends
a formatted summary to a WhatsApp number.

Setup Requirements (.env variables):
- WHATSAPP_PHONE_NUMBER_ID: Your Meta WhatsApp Cloud API Phone Number ID
- WHATSAPP_TOKEN: Your Meta WhatsApp Cloud API Access Token
- WHATSAPP_TO_NUMBER: The destination phone number with country code (e.g., 919876543210)
"""

import os
import requests
from dotenv import load_dotenv

# Reusing the existing scrapers
from data_engine import sync_gold, sync_fuel, sync_pulses

def build_summary(gold_data, fuel_data, pulse_data):
    """Formats the scraped data into a WhatsApp-friendly message."""
    
    # Gold
    gold_rates = gold_data.get("rates", {})
    gold_22k = gold_rates.get("22K Gold (1g)", {}).get("today", "N/A")
    gold_24k = gold_rates.get("24K Gold (1g)", {}).get("today", "N/A")
    
    # Fuel
    petrol = fuel_data.get("petrol", {}).get("price", "N/A")
    diesel = fuel_data.get("diesel", {}).get("price", "N/A")

    # Pulses/Mandi
    pulse_items = pulse_data.get("items", [])
    pulse_summary = "\n".join([f"• {p['name']}: {p['price']}" for p in pulse_items[:3]])
    
    message = (
        "📊 *Telangana.live Daily Pulse*\n"
        f"📍 City: {gold_data.get('city', 'Hyderabad')}\n\n"
        "🟡 *Gold Rates (per gram):*\n"
        f"• 22K: {gold_22k}\n"
        f"• 24K: {gold_24k}\n\n"
        "⛽ *Fuel Prices (per litre):*\n"
        f"• Petrol: {petrol}\n"
        f"• Diesel: {diesel}\n\n"
        "🌾 *Mandi / Pulse Prices:*\n"
        f"{pulse_summary}\n\n"
        "Stay updated at https://telangana.live"
    )
    return message

def send_whatsapp_message(message):
    """Sends the message via Meta WhatsApp Cloud API."""
    load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))
    
    phone_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    token = os.getenv("WHATSAPP_TOKEN")
    to_number = os.getenv("WHATSAPP_TO_NUMBER")
    
    if not all([phone_id, token, to_number]):
        print("⚠️ WhatsApp credentials missing in .env. Skipping send.")
        print("--- MESSAGE PREVIEW ---")
        print(message)
        print("-----------------------")
        return
        
    url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {
            "body": message
        }
    }
    
    print(f"Sending WhatsApp message to {to_number}...")
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code in [200, 201]:
        print("✅ WhatsApp message sent successfully!")
    else:
        print(f"❌ Failed to send WhatsApp message. Status: {response.status_code}")
        print(response.json())

def main():
    print("Gathering data for WhatsApp summary...")
    
    # Fetch data (these also update the static JS files and Redis)
    gold_data = sync_gold()
    fuel_data = sync_fuel()
    pulse_data = sync_pulses()
    
    message = build_summary(gold_data, fuel_data, pulse_data)
    send_whatsapp_message(message)

if __name__ == "__main__":
    main()
