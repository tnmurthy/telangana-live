import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ── Helpers ────────────────────────────────────────────────────────────────

function mockFetchWeatherAndAqi(weatherJson, aqiJson) {
  global.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(weatherJson),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(aqiJson),
    });
}

const SAMPLE_WEATHER = {
  main: { temp: 35.6, feels_like: 38.0, humidity: 55 },
  wind: { speed: 3.0 },
  weather: [{ main: 'Clear', description: 'clear sky' }],
};

const SAMPLE_AQI = {
  list: [{ main: { aqi: 2 }, components: { pm2_5: 30 } }],
};

describe('weatherService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when VITE_OWM_API_KEY is not set', () => {
    it('returns the scraped snapshot for a known district', async () => {
      vi.stubEnv('VITE_OWM_API_KEY', '');
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      const result = await fetchWeather('Hyderabad');
      expect(result.source).toBe('snapshot');
      // Without an API key the service returns the scraped snapshot, labelled as such.
    });

    it('does not call fetch when no API key is set', async () => {
      vi.stubEnv('VITE_OWM_API_KEY', '');
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      global.fetch = vi.fn();
      await fetchWeather('Hyderabad');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('when VITE_OWM_API_KEY is set', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_OWM_API_KEY', 'test-api-key-123');
    });

    it('returns a snapshot (null data) for an unknown district', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      const result = await fetchWeather('UnknownDistrict');
      expect(result.source).toBe('snapshot');
    });

    it('fetches live weather for a known district and returns source "live"', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      mockFetchWeatherAndAqi(SAMPLE_WEATHER, SAMPLE_AQI);

      const result = await fetchWeather('Hyderabad');
      expect(result.source).toBe('live');
    });

    it('maps temperature correctly (rounds to integer)', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      mockFetchWeatherAndAqi(SAMPLE_WEATHER, SAMPLE_AQI);

      const result = await fetchWeather('Hyderabad');
      expect(result.data.temp).toBe(36); // round(35.6)
      expect(result.data.feelsLike).toBe(38);
    });

    it('converts wind speed from m/s to km/h', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      mockFetchWeatherAndAqi(SAMPLE_WEATHER, SAMPLE_AQI);

      const result = await fetchWeather('Hyderabad');
      expect(result.data.windSpeed).toBe(Math.round(3.0 * 3.6)); // ≈ 11
    });

    it('maps weather condition "Clear" correctly', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      mockFetchWeatherAndAqi(SAMPLE_WEATHER, SAMPLE_AQI);

      const result = await fetchWeather('Hyderabad');
      expect(result.data.condition).toBe('Clear');
    });

    it('maps weather condition "Rain" to "Light Rain"', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      const rainyWeather = {
        ...SAMPLE_WEATHER,
        weather: [{ main: 'Rain', description: 'light rain' }],
      };
      mockFetchWeatherAndAqi(rainyWeather, SAMPLE_AQI);

      const result = await fetchWeather('Karimnagar');
      expect(result.data.condition).toBe('Light Rain');
    });

    it('computes the CPCB AQI and label from PM2.5', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      mockFetchWeatherAndAqi(SAMPLE_WEATHER, SAMPLE_AQI);

      const result = await fetchWeather('Hyderabad');
      // pm2_5 30 µg/m³ -> CPCB AQI 50, "Good" (OWM's own 1-5 index is not used)
      expect(result.data.aqi).toBe(50);
      expect(result.data.aqiLabel).toBe('Good');
    });

    it('falls back to the snapshot when the weather API returns non-OK status', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403 });

      const result = await fetchWeather('Warangal');
      expect(result.source).toBe('snapshot');
    });

    it('falls back to the snapshot when fetch throws', async () => {
      vi.resetModules();
      const { fetchWeather } = await import('../../src/services/weatherService.js');

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await fetchWeather('Nizamabad');
      expect(result.source).toBe('snapshot');
    });
  });
});
