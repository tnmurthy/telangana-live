// src/services/pricesService.js
// Fuel and mandi prices for the site.
//
// Order: the live API route when it returns real prices, else the synced data
// files (fuelPrices.js, refreshed by the scheduled data jobs and
// carrying their own date). There are no built-in prices. This service used to
// read a data file last written on 7 Jun 2026 first, so the site showed June
// prices as today's, and fell back to hard-coded numbers behind that.
// See docs/DATA_STANDARDS.md, rule 1.

import { fuelPrices as syncedFuel } from '../data/fuelPrices';
import mandiSnapshot from '../data/mandiPrices.json';

const MANDI_MAX_AGE_DAYS = 7;

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
 * Telangana wholesale (mandi) prices from the daily Agmarknet snapshot
 * (backend/scripts/mandi_sync.py -> data/mandiPrices.json). Arrival-weighted
 * averages in Rs./quintal over the snapshot's date range. A snapshot more than
 * MANDI_MAX_AGE_DAYS old is not shown (TL-49).
 */
export async function fetchMandiPrices(now = new Date()) {
  const basket = Array.isArray(mandiSnapshot?.basket) ? mandiSnapshot.basket : [];
  const toDate = mandiSnapshot?.toDate ? new Date(`${mandiSnapshot.toDate}T23:59:59+05:30`) : null;
  const tooOld = !toDate || now - toDate > MANDI_MAX_AGE_DAYS * 24 * 3600 * 1000;
  if (tooOld || basket.length === 0) return { items: [] };
  return {
    items: basket.map((c) => ({ name: c.name, price: c.price, unit: 'per quintal', yearAgo: c.yearAgo ?? null })),
    lastUpdated: mandiSnapshot.toDate,
    fromDate: mandiSnapshot.fromDate,
    source: mandiSnapshot.source,
    sourceUrl: mandiSnapshot.sourceUrl,
  };
}
