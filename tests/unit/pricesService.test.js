import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ── Helpers ────────────────────────────────────────────────────────────────

function mockFetchSuccess(payload) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(payload),
  });
}

function mockFetchFailure(status = 500) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({}),
  });
}

function mockFetchThrows(message = 'Network error') {
  global.fetch = vi.fn().mockRejectedValue(new Error(message));
}

// Helpers to load a fresh module instance (bypassing the module-level memCache)
async function loadService() {
  vi.resetModules();
  // Provide a fresh redisService mock so redis always returns null
  vi.doMock('../../src/services/redisService.js', () => ({
    redisService: {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue(true),
    },
  }));
  return import('../../src/services/pricesService.js');
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ═══════════════════════════════════════════════════════════════════════════
// fetchFuelPrices
// ═══════════════════════════════════════════════════════════════════════════

describe('fetchFuelPrices', () => {
  it('returns Redis-cached data when available', async () => {
    vi.resetModules();
    vi.doMock('../../src/services/redisService.js', () => ({
      redisService: {
        get: vi.fn().mockResolvedValue({ petrol: { price: 100 }, source: 'existing' }),
        set: vi.fn().mockResolvedValue(true),
      },
    }));
    const { fetchFuelPrices } = await import('../../src/services/pricesService.js');

    const result = await fetchFuelPrices('hyderabad');
    expect(result.source).toBe('redis');
    expect(result.petrol.price).toBe(100);
  });

  it('calls the Vercel API when Redis returns null', async () => {
    const { fetchFuelPrices } = await loadService();
    const apiPayload = { petrol: { price: 108 }, diesel: { price: 90 } };
    mockFetchSuccess(apiPayload);

    const result = await fetchFuelPrices('hyderabad');
    expect(result.petrol.price).toBe(108);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/fuel-prices?city=hyderabad'),
      expect.any(Object)
    );
  });

  it('falls back to static data when API returns a non-OK status', async () => {
    const { fetchFuelPrices } = await loadService();
    mockFetchFailure(503);

    const result = await fetchFuelPrices('hyderabad');
    expect(result.source).toBe('static-fallback');
    expect(typeof result.petrol.price).toBe('number');
    expect(typeof result.diesel.price).toBe('number');
    expect(typeof result.lpg.price).toBe('number');
    expect(typeof result.cng.price).toBe('number');
  });

  it('falls back to static data when fetch throws', async () => {
    const { fetchFuelPrices } = await loadService();
    mockFetchThrows();

    const result = await fetchFuelPrices('hyderabad');
    expect(result.source).toBe('static-fallback');
    expect(result.lastUpdated).toBeDefined();
  });

  it('uses default city "hyderabad" when none provided', async () => {
    const { fetchFuelPrices } = await loadService();
    mockFetchSuccess({ petrol: { price: 107 } });

    await fetchFuelPrices();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('city=hyderabad'),
      expect.any(Object)
    );
  });

  it('static-fallback includes all four fuel types', async () => {
    const { fetchFuelPrices } = await loadService();
    mockFetchThrows();

    const result = await fetchFuelPrices('hyderabad');
    expect(result).toHaveProperty('petrol');
    expect(result).toHaveProperty('diesel');
    expect(result).toHaveProperty('lpg');
    expect(result).toHaveProperty('cng');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// fetchGoldRates
// ═══════════════════════════════════════════════════════════════════════════

describe('fetchGoldRates', () => {
  it('returns Redis-cached data when available', async () => {
    vi.resetModules();
    vi.doMock('../../src/services/redisService.js', () => ({
      redisService: {
        get: vi.fn().mockResolvedValue({ gold22k: { price: 7200 }, source: 'existing' }),
        set: vi.fn().mockResolvedValue(true),
      },
    }));
    const { fetchGoldRates } = await import('../../src/services/pricesService.js');

    const result = await fetchGoldRates();
    expect(result.source).toBe('redis');
    expect(result.gold22k.price).toBe(7200);
  });

  it('calls the Vercel API when Redis returns null', async () => {
    const { fetchGoldRates } = await loadService();
    const apiPayload = { gold22k: { price: 7300 }, silver: { price: 95 } };
    mockFetchSuccess(apiPayload);

    const result = await fetchGoldRates();
    expect(result.gold22k.price).toBe(7300);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/gold-rates'),
      expect.any(Object)
    );
  });

  it('falls back to static data when API fails', async () => {
    const { fetchGoldRates } = await loadService();
    mockFetchFailure(500);

    const result = await fetchGoldRates();
    expect(result.source).toBe('static-fallback');
    expect(result.gold22k.price).toBeGreaterThan(0);
    expect(result.gold24k.price).toBeGreaterThan(0);
    expect(result.silver.price).toBeGreaterThan(0);
  });

  it('static fallback computes 10g prices correctly', async () => {
    const { fetchGoldRates } = await loadService();
    mockFetchThrows();

    const result = await fetchGoldRates();
    expect(result.gold10g22k.price).toBe(result.gold22k.price * 10);
    expect(result.gold10g24k.price).toBe(result.gold24k.price * 10);
  });

  it('static fallback includes lastUpdated timestamp', async () => {
    const { fetchGoldRates } = await loadService();
    mockFetchThrows();

    const result = await fetchGoldRates();
    expect(result.lastUpdated).toBeDefined();
    expect(() => new Date(result.lastUpdated)).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// fetchPowerAlerts
// ═══════════════════════════════════════════════════════════════════════════

describe('fetchPowerAlerts', () => {
  it('returns an array of alerts from the API', async () => {
    const { fetchPowerAlerts } = await loadService();
    const alerts = [{ id: 1, area: 'Banjara Hills', start: '10:00', end: '14:00' }];
    mockFetchSuccess({ alerts });

    const result = await fetchPowerAlerts('hyderabad');
    expect(result).toEqual(alerts);
  });

  it('uses "all" zone by default', async () => {
    const { fetchPowerAlerts } = await loadService();
    mockFetchSuccess({ alerts: [] });

    await fetchPowerAlerts();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('zone=all'),
      expect.any(Object)
    );
  });

  it('returns empty array when API returns a non-OK status', async () => {
    const { fetchPowerAlerts } = await loadService();
    mockFetchFailure(503);

    const result = await fetchPowerAlerts('all');
    expect(result).toEqual([]);
  });

  it('returns empty array when fetch throws', async () => {
    const { fetchPowerAlerts } = await loadService();
    mockFetchThrows();

    const result = await fetchPowerAlerts('all');
    expect(result).toEqual([]);
  });

  it('returns empty array when API response has no alerts property', async () => {
    const { fetchPowerAlerts } = await loadService();
    mockFetchSuccess({});

    const result = await fetchPowerAlerts('all');
    expect(result).toEqual([]);
  });
});
