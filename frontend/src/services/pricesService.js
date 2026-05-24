// src/services/pricesService.js
// Fetches live fuel prices & gold rates from Vercel API routes
// Falls back to static data if API unavailable

import { fuelPrices as staticFuel } from '../data/fuelPrices';
import { goldRates as staticGold } from '../data/goldRates';
import hybridPrices from '../data/prices.json';
import { redisService } from './redisService';

const API_BASE = import.meta.env.VITE_API_BASE || '';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

const memCache = new Map();

function getCached(key) {
  const entry = memCache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key, data) {
  memCache.set(key, { data, ts: Date.now() });
}

/**
 * Fetch live fuel prices for a city.
 * @param {string} city - e.g. 'hyderabad'
 * @returns {Promise<object>} fuel price data
 */
export async function fetchFuelPrices(city = 'hyderabad') {
  const key = `tg:rates:fuel:${city}`;
  
  // 1. Try Hybrid Local Data (Python Agent Pushed)
  if (hybridPrices?.fuel) {
    return {
      petrol: { price: hybridPrices.fuel.petrol, unit: 'per litre', change: 0 },
      diesel: { price: hybridPrices.fuel.diesel, unit: 'per litre', change: 0 },
      source: 'local-hybrid',
      lastUpdated: hybridPrices.last_updated
    };
  }

  // 2. Try Redis
  try {
    const redisData = await redisService.get(key);
    if (redisData) return { ...redisData, source: 'redis' };
  } catch (err) {
    console.warn('Redis fetch error for fuel:', err.message);
  }

  // 3. Try MemCache
  const memKey = `fuel-${city}`;
  const cached = getCached(memKey);
  if (cached) return cached;

  try {
    // 4. Try Vercel API (Legacy Scraper)
    const res = await fetch(`${API_BASE}/api/fuel-prices?city=${city}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    setCache(memKey, data);
    return data;
  } catch (err) {
    console.warn('fetchFuelPrices fallback:', err.message);
    // 5. Return static data
    return {
      petrol: { price: staticFuel.petrol?.price || 102.68, unit: 'per litre', change: 0 },
      diesel: { price: staticFuel.diesel?.price || 88.73,  unit: 'per litre', change: 0 },
      lpg:    { price: staticFuel.lpgHousehold?.price || 803.00, unit: 'per cylinder', change: 0 },
      cng:    { price: staticFuel.cngVehicle?.price   || 72.80,  unit: 'per kg', change: 0 },
      source: 'static-fallback',
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Fetch live gold & silver rates for Hyderabad.
 * @returns {Promise<object>} gold rate data
 */
export async function fetchGoldRates() {
  const key = 'tg:rates:gold';

  // 1. Try Hybrid Local Data
  if (hybridPrices?.gold) {
    const gold24k = hybridPrices.gold['24k'] || 7830;
    const gold22k = hybridPrices.gold['22k'] || 7180;
    return {
      gold24k: { price: gold24k / 10, unit: 'per gram', change: 0 },
      gold22k: { price: gold22k / 10, unit: 'per gram', change: 0 },
      gold10g24k: { price: gold24k, unit: 'per 10 grams', change: 0 },
      gold10g22k: { price: gold22k, unit: 'per 10 grams', change: 0 },
      silver: { price: staticGold.silver?.price || 93.50, unit: 'per gram', change: 0 },
      source: 'local-hybrid',
      lastUpdated: hybridPrices.last_updated
    };
  }

  // 2. Try Redis
  try {
    const redisData = await redisService.get(key);
    if (redisData) return { ...redisData, source: 'redis' };
  } catch (err) {
    console.warn('Redis fetch error for gold:', err.message);
  }

  // 3. Try MemCache
  const memKey = 'gold-hyderabad';
  const cached = getCached(memKey);
  if (cached) return cached;

  try {
    // 4. Try Vercel API
    const res = await fetch(`${API_BASE}/api/gold-rates`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    setCache(memKey, data);
    return data;
  } catch (err) {
    console.warn('fetchGoldRates fallback:', err.message);
    return {
      gold22k:    { price: staticGold.gold22k?.price    || 7180,  unit: 'per gram', change: staticGold.gold22k?.change    ?? 0 },
      gold24k:    { price: staticGold.gold24k?.price    || 7830,  unit: 'per gram', change: staticGold.gold24k?.change    ?? 0 },
      silver:     { price: staticGold.silver?.price     || 93.50, unit: 'per gram', change: staticGold.silver?.change     ?? 0 },
      gold10g22k: { price: (staticGold.gold22k?.price || 7180) * 10,  unit: 'per 10 grams', change: (staticGold.gold22k?.change ?? 0) * 10 },
      gold10g24k: { price: (staticGold.gold24k?.price || 7830) * 10,  unit: 'per 10 grams', change: (staticGold.gold24k?.change ?? 0) * 10 },
      source: 'static-fallback',
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Fetch power alerts (TSSPDCL outages) from API or Redis cache.
 * @param {string} zone - 'hyderabad', 'all'
 * @returns {Promise<Array>} list of alert objects
 */
export async function fetchPowerAlerts(zone = 'all') {
  const key = `alerts-${zone}`;
  const cached = getCached(key);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/api/power-alerts?zone=${zone}`, {
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    setCache(key, data.alerts || []);
    return data.alerts || [];
  } catch (err) {
    console.warn('fetchPowerAlerts fallback:', err.message);
    return [];
  }
}

/**
 * Fetch Mandi prices for major crops.
 * @returns {Promise<object>} mandi price data
 */
export async function fetchMandiPrices() {
  if (hybridPrices?.mandi) {
    return {
      items: Object.entries(hybridPrices.mandi).map(([name, price]) => ({
        name,
        price,
        unit: 'per quintal',
        change: 0
      })),
      lastUpdated: hybridPrices.last_updated
    };
  }
  return { items: [] };
}
