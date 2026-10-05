import { describe, it, expect } from 'vitest';
import { openListings, recruitmentPortals, daysUntil } from '../../frontend/src/utils/jobs';

// TL-28: the jobs board measured days from a hard-coded "today" (4 Apr 2026)
// and showed listings whose closing date had passed months ago as live.

const JOBS = [
    { id: 1, organization: 'TSPSC', type: 'Government', applyUrl: 'https://www.tspsc.gov.in', lastDate: '2026-04-20' },
    { id: 2, organization: 'TSPSC', type: 'Government', applyUrl: 'https://www.tspsc.gov.in', lastDate: '2026-10-20' },
    { id: 3, organization: 'TCS', type: 'IT', applyUrl: 'https://www.tcs.com/careers', lastDate: '2026-10-05' },
];
const TODAY = new Date('2026-10-05T10:00:00+05:30');

describe('jobs board helpers', () => {
    it('counts days from the real date', () => {
        expect(daysUntil('2026-10-20', TODAY)).toBe(15);
        expect(daysUntil('2026-04-20', TODAY)).toBeLessThan(0);
    });

    it('keeps only listings still open, including those closing today', () => {
        expect(openListings(JOBS, TODAY).map((j) => j.id)).toEqual([2, 3]);
    });

    it('drops listings with no closing date', () => {
        expect(openListings([{ id: 9, lastDate: '' }], TODAY)).toEqual([]);
    });

    it('lists each official recruitment portal once', () => {
        expect(recruitmentPortals(JOBS)).toEqual([
            { organization: 'TCS', url: 'https://www.tcs.com/careers', type: 'IT' },
            { organization: 'TSPSC', url: 'https://www.tspsc.gov.in', type: 'Government' },
        ]);
    });
});
