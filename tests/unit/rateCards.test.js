import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const read = (path) => readFileSync(join(ROOT, path), 'utf8');

describe('TL-06: rate cards staleness indicator and thresholds', () => {
    it('FuelPriceWidget uses 24h freshness threshold and binds live updatedAt', () => {
        const src = read('frontend/src/components/FuelPriceWidget.jsx');
        expect(src).toContain('maxAgeHours={24}');
        expect(src).toContain('updatedAt: data.lastUpdated || prev.updatedAt');
        expect(src).toContain('<UpdatedAt timestamp={fuelPrices.updatedAt || staticFuelPrices.updatedAt}');
    });

    it('DailyRatesDashboard renders UpdatedAt with 24h threshold and updates live state', () => {
        const src = read('frontend/src/components/DailyRatesDashboard.jsx');
        expect(src).toContain("import UpdatedAt from './UpdatedAt'");
        expect(src).toContain('maxAgeHours={24}');
        expect(src).toContain('updatedAt: data.lastUpdated');
        expect(src).toContain('<UpdatedAt timestamp={updatedAt || staticFuelPrices.updatedAt}');
    });
});
