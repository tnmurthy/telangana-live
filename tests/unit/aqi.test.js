import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { aqiBand, indianAqi } from '../../frontend/src/utils/aqi';

// The weather card's AQI was a fixed 75/80 from the scraper, or "PM2.5 x 4.2"
// in the live path, defaulting to "Good" when no data came back.

describe('indianAqi (CPCB)', () => {
    it('takes the worst sub-index', () => {
        expect(indianAqi({ pm2_5: 38.1, pm10: 50 })).toBe(63); // PM2.5 governs
        expect(indianAqi({ pm2_5: 10, pm10: 180 })).toBe(153); // PM10 governs
    });

    it('hits the band edges', () => {
        expect(indianAqi({ pm2_5: 30 })).toBe(50);
        expect(indianAqi({ pm2_5: 60 })).toBe(100);
        expect(indianAqi({ pm10: 430 })).toBe(400);
    });

    it('is null without readings, never a default', () => {
        expect(indianAqi({})).toBeNull();
        expect(indianAqi(undefined)).toBeNull();
        expect(aqiBand(null)).toEqual({ label: null, color: null });
    });

    it('labels CPCB bands', () => {
        expect(aqiBand(63).label).toBe('Satisfactory');
        expect(aqiBand(250).label).toBe('Poor');
        expect(aqiBand(450).label).toBe('Severe');
    });
});

describe('weather service', () => {
    const src = readFileSync(join(__dirname, '..', '..', 'frontend', 'src', 'services', 'weatherService.js'), 'utf8');
    it('has no invented AQI conversion or "mock" source', () => {
        expect(src).not.toMatch(/\* 4\.2|aqiIndex \* 50|'mock'/);
    });
});
