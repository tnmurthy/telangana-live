import { describe, it, expect, afterEach, vi } from 'vitest';

// Prices shown on the site must be real and dated. The service used to read
// data/prices.json first (last updated 7 Jun 2026, written by nothing), so
// fuel, gold and mandi showed June prices as today's; behind that sat fixed
// numbers (petrol 102.68, gold 15704, ...). Now: the live API when it returns
// real data, else the synced data files (refreshed by the scheduled jobs),
// never constants.

vi.mock('../../frontend/src/data/fuelPrices', () => ({
    fuelPrices: {
        date: '2026-10-04',
        updatedAt: '2026-10-04T17:13:51Z',
        petrol: { price: 116.15, unit: 'per litre', change: 0 },
        diesel: { price: 103.9, unit: 'per litre', change: 0 },
        lpgHousehold: { price: 905, unit: 'per cylinder (14.2kg)', change: 0 },
        cngVehicle: { price: 96, unit: 'per kg', change: 0 },
        staleFields: [],
    },
}));

function respond(ok, body, status = 200) {
    global.fetch = vi.fn().mockResolvedValue({ ok, status, json: () => Promise.resolve(body) });
}

async function load() {
    vi.resetModules();
    return import('../../frontend/src/services/pricesService.js');
}

afterEach(() => vi.restoreAllMocks());

describe('fetchFuelPrices', () => {
    it('uses the live API when it returns real prices', async () => {
        respond(true, { petrol: { price: 117 }, diesel: { price: 104 }, source: 'live' });
        const { fetchFuelPrices } = await load();
        const data = await fetchFuelPrices();
        expect(data.petrol.price).toBe(117);
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/fuel-prices?city=hyderabad'), expect.anything());
    });

    it('falls back to the synced file, with its own date, when the API is unavailable', async () => {
        respond(false, { error: 'unavailable' }, 503);
        const { fetchFuelPrices } = await load();
        const data = await fetchFuelPrices();
        expect(data.petrol.price).toBe(116.15);
        expect(data.lpg.price).toBe(905);
        expect(data.lastUpdated).toBe('2026-10-04T17:13:51Z');
        expect(data.source).toBe('synced-file');
    });

    it('falls back to the synced file when the request throws', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('offline'));
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        const { fetchFuelPrices } = await load();
        expect((await fetchFuelPrices()).diesel.price).toBe(103.9);
    });
});

describe('fetchMandiPrices', () => {
    it('returns the live market data', async () => {
        respond(true, { date: '2026-10-04', commodities: [{ name: 'Maize', modalPrice: 2100, unit: 'Quintal' }] });
        const { fetchMandiPrices } = await load();
        expect(await fetchMandiPrices()).toEqual({
            items: [{ name: 'Maize', price: 2100, unit: 'per quintal', change: 0 }],
            lastUpdated: '2026-10-04',
        });
    });

    it('returns nothing, not June prices, when the API is unavailable', async () => {
        respond(false, {}, 503);
        const { fetchMandiPrices } = await load();
        expect(await fetchMandiPrices()).toEqual({ items: [] });
    });
});

describe('fetchPowerAlerts', () => {
    it('returns the alerts array from the API', async () => {
        respond(true, { alerts: [{ id: 1 }] });
        const { fetchPowerAlerts } = await load();
        expect(await fetchPowerAlerts()).toEqual([{ id: 1 }]);
    });

    it('returns an empty array on failure', async () => {
        respond(false, {}, 500);
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        const { fetchPowerAlerts } = await load();
        expect(await fetchPowerAlerts()).toEqual([]);
    });
});

describe('no stale or invented price sources', () => {
    it('pricesService no longer imports prices.json or contains fixed prices', async () => {
        const { readFileSync } = await import('node:fs');
        const { join } = await import('node:path');
        const src = readFileSync(join(__dirname, '..', '..', 'frontend', 'src', 'services', 'pricesService.js'), 'utf8');
        expect(src).not.toMatch(/prices\.json/);
        expect(src).not.toMatch(/102\.68|88\.73|15704|14395|157040|143950|93\.50/);
    });
});
