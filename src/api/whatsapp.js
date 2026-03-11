import { goldRates } from '../data/goldRates';

import { metroData } from '../data/transportData';
import { weatherData } from '../data/weatherData';

/**
 * Mock WhatsApp API Handler (2026 Simulation)
 * 
 * In a real scenario, this would be an endpoint that receives a message from 
 * a WhatsApp webhook (e.g. Twilio/Meta API) and sends a response.
 */
export const handleWhatsAppMessage = (message) => {
    const query = message.toUpperCase().trim();

    if (query.includes('GOLD')) {
        return `💰 Gold Rate in ${goldRates.city} (${goldRates.date}):
- 22K: ₹${goldRates.gold22k.price.toLocaleString()}/g
- 24K: ₹${goldRates.gold24k.price.toLocaleString()}/g
- Trend: ${goldRates.gold22k.change < 0 ? '📉 Dropping' : '📈 Rising'}`;
    }

    if (query.includes('METRO')) {
        const line = metroData.lines[1]; // Blue Line
        return `🚇 Metro Phase 1 Status:
- Line: ${line.name}
- Route: ${line.route}
- Status: Operational
- Crowd: ${line.crowdLabel} (${line.crowdLevel}%)
Next train in 3 mins at all major terminals.`;
    }

    if (query.includes('RAIN') || query.includes('WEATHER')) {
        const hyd = weatherData.Hyderabad;
        return `🌦️ Weather Alert (Telangana):
- Hyderabad: ${hyd.temp}°C, ${hyd.condition}
- AQI: ${hyd.aqi} (${hyd.aqiLabel})
- Note: Extreme UV Alert today. Stay hydrated.`;
    }

    return `Welcome to telangana.live Bot! 🤖
Send keywords to get live updates:
- GOLD (Daily Rates)
- METRO (Train Status)
- WEATHER (Current Alerts)
- NEWS (Utility Alerts)`;
};
