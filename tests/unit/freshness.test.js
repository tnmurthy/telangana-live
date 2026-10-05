import { describe, it, expect } from 'vitest';
import { freshness } from '../../frontend/src/utils/freshness';

// Every module shows when its data was last refreshed, and says so when it is
// past its limit (idea from ForThePeople; backend twin: check_freshness.py).

const NOW = new Date('2026-10-05T06:00:00Z');

describe('freshness', () => {
    it('describes recent data in hours', () => {
        expect(freshness('2026-10-05T03:00:00Z', 24, NOW)).toEqual({ stale: false, text: 'Updated 3 h ago' });
    });

    it('describes data under an hour old in minutes', () => {
        expect(freshness('2026-10-05T05:35:00Z', 24, NOW)).toEqual({ stale: false, text: 'Updated 25 min ago' });
    });

    it('marks data past its limit as stale with the date it was last updated', () => {
        expect(freshness('2026-07-13T09:19:09Z', 48, NOW)).toEqual({
            stale: true,
            text: 'Last updated 13 Jul 2026, may be out of date',
        });
    });

    it('treats a missing or unreadable time as stale', () => {
        expect(freshness('', 24, NOW).stale).toBe(true);
        expect(freshness('soon', 24, NOW).stale).toBe(true);
    });
});
