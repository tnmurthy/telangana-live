import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import snapshot from '../../frontend/src/data/mandiPrices.json';
import { mandiIsCurrent } from '../../frontend/src/components/MandiTables.jsx';

// TL-49: mandi prices come from the daily Agmarknet snapshot written by
// backend/scripts/mandi_sync.py. The old /api/mandi-prices route called a
// third-party mirror that returned 404.

const ROOT = join(__dirname, '..', '..');

describe('mandi snapshot', () => {
    it('names its source and date range', () => {
        expect(snapshot.sourceUrl).toBe('https://agmarknet.gov.in/');
        expect(snapshot.fromDate <= snapshot.toDate).toBe(true);
    });

    it('holds only prices inside the sane range, per quintal', () => {
        for (const row of snapshot.basket) {
            expect(row.price, row.name).toBeGreaterThanOrEqual(100);
            expect(row.price, row.name).toBeLessThanOrEqual(200000);
            expect(row.unit).toBe('Rs./quintal');
        }
    });

    it('quotes an MSP crop only when enough was traded', () => {
        for (const row of snapshot.msp) {
            if (row.price != null) expect(row.arrivalTonnes, row.name).toBeGreaterThanOrEqual(snapshot.minArrivalTonnes);
        }
    });

    it('is not shown once it is more than a week old', () => {
        const toDate = new Date(`${snapshot.toDate}T12:00:00+05:30`);
        expect(mandiIsCurrent(toDate)).toBe(true);
        expect(mandiIsCurrent(new Date(toDate.getTime() + 9 * 24 * 3600 * 1000))).toBe(false);
    });

    it('the third-party mirror route is gone', () => {
        expect(existsSync(join(ROOT, 'frontend', 'api', 'mandi-prices.js'))).toBe(false);
    });

    it('a scheduled job refreshes the snapshot', () => {
        const wf = readFileSync(join(ROOT, '.github', 'workflows', 'mandi_sync.yml'), 'utf8');
        expect(wf).toMatch(/mandi_sync\.py/);
        expect(wf).toMatch(/cron:/);
    });
});
