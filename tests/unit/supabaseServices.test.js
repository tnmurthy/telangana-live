import { describe, it, expect, vi, beforeEach } from 'vitest';

// The site's Supabase tables moved to the `telangana` schema of a shared
// project (2026-10-04). Under RLS the public key may insert a pending report
// or a classified but cannot read either back, so inserts must not ask for
// the row (`.select()`), or every submission fails.

const calls = [];
let insertResult = { error: null };
let selectResult = { data: [], error: null };

function chain(table) {
    const q = {
        select: (...a) => { calls.push([table, 'select', ...a]); return q; },
        eq: (...a) => { calls.push([table, 'eq', ...a]); return q; },
        in: (...a) => { calls.push([table, 'in', ...a]); return q; },
        order: (...a) => { calls.push([table, 'order', ...a]); return Promise.resolve(selectResult); },
        insert: (rows) => { calls.push([table, 'insert', rows]); return Promise.resolve(insertResult); },
    };
    return q;
}

const channelCalls = [];
vi.mock('../../frontend/src/services/supabaseClient', () => ({
    supabase: {
        from: (table) => chain(table),
        channel: () => {
            const ch = {
                on: (event, filter) => { channelCalls.push(filter); return ch; },
                subscribe: () => ({ unsubscribe() {} }),
            };
            return ch;
        },
    },
    SUPABASE_SCHEMA: 'telangana',
}));

const { citizenReportsService } = await import('../../frontend/src/services/citizenReportsService');
const { classifiedsService } = await import('../../frontend/src/services/classifiedsService');
const { emergencyService } = await import('../../frontend/src/services/emergencyService');

beforeEach(() => {
    calls.length = 0;
    channelCalls.length = 0;
    insertResult = { error: null };
    selectResult = { data: [], error: null };
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('citizen reports', () => {
    it('submits a pending report with a client-made id and does not read it back', async () => {
        const result = await citizenReportsService.submitReport({
            category: 'Roads', description: 'Pothole', lat: 17.4, lng: 78.4,
            ward: 'Ward 1', corporation: 'GHMC',
        });
        const insert = calls.find(c => c[1] === 'insert');
        expect(insert[0]).toBe('citizen_reports');
        expect(insert[2][0].status).toBe('pending_moderation');
        expect(insert[2][0].id).toMatch(/^[0-9a-f-]{36}$/);
        expect(calls.some(c => c[0] === 'citizen_reports' && c[1] === 'select')).toBe(false);
        expect(result).toEqual({ id: insert[2][0].id, status: 'pending_moderation' });
    });

    it('reports failure instead of inventing a tracking id', async () => {
        insertResult = { error: { message: 'denied' } };
        await expect(citizenReportsService.submitReport({ category: 'Roads', description: 'x' }))
            .resolves.toBeNull();
    });

    it('listens for realtime changes in the telangana schema', () => {
        citizenReportsService.subscribeToReports(() => {});
        expect(channelCalls.every(f => f.schema === 'telangana')).toBe(true);
        expect(channelCalls.length).toBeGreaterThan(0);
    });
});

describe('grievance dashboard data', () => {
    it('reads only published reports: approved or resolved', async () => {
        selectResult = { data: [{ id: 'r1', status: 'approved' }], error: null };
        const rows = await citizenReportsService.getPublishedReports();
        expect(rows).toEqual([{ id: 'r1', status: 'approved' }]);
        expect(calls).toContainEqual(['citizen_reports', 'in', 'status', ['approved', 'resolved']]);
    });

    it('returns nothing, not sample reports, when the query fails', async () => {
        selectResult = { data: null, error: { message: 'down' } };
        await expect(citizenReportsService.getPublishedReports()).resolves.toEqual([]);
    });
});

describe('classifieds', () => {
    it('shows nothing, not sample listings, when there are none', async () => {
        await expect(classifiedsService.getActiveClassifieds()).resolves.toEqual([]);
    });

    it('shows nothing, not sample listings, when the query fails', async () => {
        selectResult = { data: null, error: { message: 'down' } };
        await expect(classifiedsService.getActiveClassifieds()).resolves.toEqual([]);
    });

    it('posts an unfeatured listing without reading it back', async () => {
        await classifiedsService.postClassified('Selling bike 40000', 17.4, 78.4, 'Ward 1', '919000000000');
        const insert = calls.find(c => c[1] === 'insert');
        expect(insert[2][0].is_featured).toBe(false);
        expect(calls.some(c => c[0] === 'smart_classifieds' && c[1] === 'select')).toBe(false);
    });
});

describe('emergency status', () => {
    it('listens for realtime changes in the telangana schema', () => {
        emergencyService.subscribe(() => {});
        expect(channelCalls[0].schema).toBe('telangana');
    });
});
