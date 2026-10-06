import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { countPublishedToday } from '../../frontend/src/utils/timeUtils';

// The "N stories today" pill counted every stored story and then ticked up at
// random every 7 seconds. It now counts stories published on today's IST date.

describe('countPublishedToday', () => {
    const now = new Date('2026-10-06T10:00:00+05:30');

    it('counts only items published on the current IST day', () => {
        const items = [
            { published: 'Tue, 06 Oct 2026 08:00:00 +0530' },
            { published: 'Mon, 05 Oct 2026 23:59:00 +0530' },
            { published: '2026-10-05T19:00:00Z' }, // 00:30 IST on the 6th
            { published: 'not a date' },
            {},
        ];
        expect(countPublishedToday(items, now)).toBe(2);
    });

    it('is zero for an empty feed', () => {
        expect(countPublishedToday([], now)).toBe(0);
    });
});

describe('PulseCounter', () => {
    it('shows no random or simulated count', () => {
        const src = readFileSync(join(__dirname, '..', '..', 'frontend', 'src', 'components', 'PulseCounter.jsx'), 'utf8');
        expect(src).not.toMatch(/Math\.random|setInterval/);
    });
});
