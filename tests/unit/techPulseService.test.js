import { describe, it, expect, vi, afterEach } from 'vitest';
import { loadTechPulse, freshItems } from '../../frontend/src/services/techPulseService';

const NOW = new Date('2026-10-04T06:00:00Z');
const daysAgo = (n) => new Date(NOW.getTime() - n * 86400000).toISOString().replace(/\.\d{3}Z$/, 'Z');

const feed = {
    region: 'telangana',
    maxAgeDays: 14,
    generatedAt: daysAgo(0),
    categories: {
        safety: [{ id: 'a', title: 'Fresh', publishedAt: daysAgo(2) },
                 { id: 'b', title: 'Old', publishedAt: daysAgo(20) }],
        govt: [],
        jobs: [{ id: 'c', title: 'Undated' }],
    },
};

afterEach(() => vi.restoreAllMocks());

describe('freshItems', () => {
    it('drops items older than the feed window, and undated items', () => {
        const result = freshItems(feed, NOW);
        expect(result.safety.map(i => i.id)).toEqual(['a']);
        expect(result.govt).toEqual([]);
        expect(result.jobs).toEqual([]);
    });

    it('returns every category empty for a missing or malformed feed', () => {
        expect(freshItems(null, NOW)).toEqual({ safety: [], govt: [], jobs: [] });
        expect(freshItems({ categories: 'x' }, NOW)).toEqual({ safety: [], govt: [], jobs: [] });
    });
});

describe('loadTechPulse', () => {
    it('reads the published feed', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => feed });
        await expect(loadTechPulse()).resolves.toEqual(feed);
        expect(globalThis.fetch).toHaveBeenCalledWith('/data/tech_pulse.json');
    });

    it('returns null, never invented items, when the feed cannot be read', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 404 });
        await expect(loadTechPulse()).resolves.toBeNull();
    });
});
