import { describe, it, expect, vi, beforeEach } from 'vitest';

// Enquiries from /advertise go to telangana.ad_enquiries, which the public key
// may insert into but never read, so the insert must not ask for the row.

const inserts = [];
let insertResult = { error: null };

vi.mock('../../frontend/src/services/supabaseClient', () => ({
    supabase: {
        from: (table) => ({
            insert: (rows) => { inserts.push([table, rows]); return Promise.resolve(insertResult); },
        }),
    },
}));

const { submitAdEnquiry, validateAdEnquiry } = await import('../../frontend/src/services/adEnquiryService');

const VALID = {
    name: 'Ravi Kumar', business: 'Ravi Opticals', contact: 'ravi@example.com',
    interest: 'area_spotlight', area: 'Kukatpally', message: 'Interested in a month.', website: '',
};

beforeEach(() => {
    inserts.length = 0;
    insertResult = { error: null };
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('validateAdEnquiry', () => {
    it('accepts a complete enquiry', () => {
        expect(validateAdEnquiry(VALID)).toEqual({});
    });

    it('requires name, business and contact', () => {
        const errors = validateAdEnquiry({ ...VALID, name: '', business: ' ', contact: 'x' });
        expect(Object.keys(errors).sort()).toEqual(['business', 'contact', 'name']);
    });

    it('rejects an unknown slot type', () => {
        expect(validateAdEnquiry({ ...VALID, interest: 'popup' })).toHaveProperty('interest');
    });
});

describe('submitAdEnquiry', () => {
    it('inserts trimmed fields without reading the row back', async () => {
        const result = await submitAdEnquiry({ ...VALID, name: '  Ravi Kumar ' });
        expect(result).toEqual({ ok: true });
        const [table, rows] = inserts[0];
        expect(table).toBe('ad_enquiries');
        expect(rows[0]).toEqual({
            name: 'Ravi Kumar', business: 'Ravi Opticals', contact: 'ravi@example.com',
            interest: 'area_spotlight', area: 'Kukatpally', message: 'Interested in a month.',
        });
    });

    it('silently drops submissions that fill the hidden honeypot field', async () => {
        const result = await submitAdEnquiry({ ...VALID, website: 'http://spam.example' });
        expect(result).toEqual({ ok: true });
        expect(inserts).toEqual([]);
    });

    it('reports invalid input without inserting', async () => {
        const result = await submitAdEnquiry({ ...VALID, contact: '' });
        expect(result.ok).toBe(false);
        expect(result.errors).toHaveProperty('contact');
        expect(inserts).toEqual([]);
    });

    it('reports a failed insert', async () => {
        insertResult = { error: { message: 'denied' } };
        expect(await submitAdEnquiry(VALID)).toEqual({ ok: false, errors: { form: expect.any(String) } });
    });
});
