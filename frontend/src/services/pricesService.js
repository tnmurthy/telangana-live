// src/services/pricesService.js
// Fuel, gold and mandi prices for the site.
//
// Order: the live API route when it returns real prices, else the synced data
// files (fuelPrices.js / goldRates.js, refreshed by the scheduled data jobs and
// carrying their own date). There are no built-in prices. This service used to
// read a data file last written on 7 Jun 2026 first, so the site showed June
// prices as today's, and fell back to hard-coded numbers behind that.
// See docs/DATA_STANDARDS.md, rule 1.

import { fuelPrices as syncedFuel } from '../data/fuelPrices';
import { goldRates as syncedGold } from '../data/goldRates';

const API_BASE = import.meta.env.VITE_API_BASE || '';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms
const TIMEOUT_MS = 8000;

const memCache = new Map();

function getCached(key) {
  const entry = memCache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key, data) {
  memCache.set(key, { data, ts: Date.now() });
}

/** JSON from an API route, or null when it is unavailable or failed. */
async function fetchJson(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`${path} unavailable:`, err.message);
    return null;
  }
}

function price(item, unit) {
  return { price: item?.price ?? null, unit, change: item?.change ?? 0 };
}

/**
 * Fuel prices for a city.
 * @param {string} city - e.g. 'hyderabad'
 */
export async function fetchFuelPrices(city = 'hyderabad') {
  const memKey = `fuel-${city}`;
  const cached = getCached(memKey);
  if (cached) return cached;

  const live = await fetchJson(`/api/fuel-prices?city=${city}`);
  if (live?.petrol?.price && live?.diesel?.price) {
    setCache(memKey, live);
    return live;
  }

  return {
    petrol: { ...price(syncedFuel.petrol, 'per litre'), taxBreakup: syncedFuel.petrol?.taxBreakup },
    diesel: { ...price(syncedFuel.diesel, 'per litre'), taxBreakup: syncedFuel.diesel?.taxBreakup },
    lpg: price(syncedFuel.lpgHousehold, 'per cylinder'),
    cng: price(syncedFuel.cngVehicle, 'per kg'),
    staleFields: syncedFuel.staleFields || [],
    source: 'synced-file',
    date: syncedFuel.date,
    lastUpdated: syncedFuel.updatedAt,
  };
}

/** Gold and silver rates for Hyderabad. */
export async function fetchGoldRates() {
  const memKey = 'gold-hyderabad';
  const cached = getCached(memKey);
  if (cached) return cached;

  const live = await fetchJson('/api/gold-rates');
  if (live?.gold22k?.price && live?.gold24k?.price) {
    setCache(memKey, live);
    return live;
  }

  const per10g = (item) => (item?.price ? { price: item.price * 10, unit: 'per 10 grams', change: (item.change ?? 0) * 10 } : null);
  return {
    gold22k: price(syncedGold.gold22k, 'per gram'),
    gold24k: price(syncedGold.gold24k, 'per gram'),
    silver: price(syncedGold.silver, 'per gram'),
    gold10g22k: per10g(syncedGold.gold22k),
    gold10g24k: per10g(syncedGold.gold24k),
    isStale: Boolean(syncedGold.isStale),
    source: 'synced-file',
    date: syncedGold.date,
    lastUpdated: syncedGold.updatedAt,
  };
}

/**
 * Power alerts (TSSPDCL outages).
 * @param {string} zone - 'hyderabad', 'all'
 * @returns {Promise<Array>} list of alert objects
 */
export async function fetchPowerAlerts(zone = 'all') {
  const key = `alerts-${zone}`;
  const cached = getCached(key);
  if (cached) return cached;

  const data = await fetchJson(`/api/power-alerts?zone=${zone}`);
  const alerts = data?.alerts || [];
  if (data) setCache(key, alerts);
  return alerts;
}

/**
 * Today's mandi prices from the live API. No current source exists in the
 * bundle, so on failure this returns no items rather than old prices.
 */
export async function fetchMandiPrices() {
  const data = await fetchJson('/api/mandi-prices');
  const commodities = Array.isArray(data?.commodities) ? data.commodities : [];
  if (commodities.length === 0) return { items: [] };
  return {
    items: commodities
      .filter((c) => typeof c.modalPrice === 'number')
      .map((c) => ({ name: c.name, price: c.modalPrice, unit: 'per quintal', change: 0 })),
    lastUpdated: data.date,
  };
}
