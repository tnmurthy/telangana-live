import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { computePanchang, elementsAt, lahiriAyanamsa, moonPhaseTime } from '../../frontend/src/utils/panchang';

// /api/panchang/today returned one fixed reading (Ashadha, Dashami, Rohini,
// sunrise 05:40) every day. It is now computed. Expected values below were
// checked against Drik Panchang for Hyderabad.

describe('computePanchang (Hyderabad)', () => {
    it('matches Drik Panchang for 6 Oct 2026', () => {
        const p = computePanchang(new Date('2026-10-06T09:00:00+05:30'));
        expect(p).toMatchObject({
            date: '2026-10-06', year: 2083, month: 'Bhadrapada', paksha: 'Krishna',
            tithi: 'Ekadashi', nakshatra: 'Ashlesha', yoga: 'Siddha', karana: 'Bava', sunrise: '06:07',
        });
        expect(p.sunset).toMatch(/^18:0[01]$/);
        expect(p.rahu_kaal).toMatch(/^15:0[23] - 16:3[12]$/);
    });

    it('gets Naraka Chaturdashi 2025 (20 Oct) right', () => {
        const p = computePanchang(new Date('2025-10-20T09:00:00+05:30'));
        expect(p).toMatchObject({ month: 'Ashvayuja', paksha: 'Krishna', tithi: 'Chaturdashi' });
    });

    it('rolls the Vikram Samvat year at Chaitra, not 1 January', () => {
        expect(computePanchang(new Date('2026-01-15T09:00:00+05:30')).year).toBe(2082);
        expect(computePanchang(new Date('2026-05-01T09:00:00+05:30')).year).toBe(2083);
    });

    it('changes from day to day (not a fixed reading)', () => {
        const a = computePanchang(new Date('2026-10-06T09:00:00+05:30'));
        const b = computePanchang(new Date('2026-10-07T09:00:00+05:30'));
        expect([a.tithi, a.nakshatra, a.sunrise]).not.toEqual([b.tithi, b.nakshatra, b.sunrise]);
    });

    it('lists no festivals or rituals without a source', () => {
        const p = computePanchang(new Date('2026-10-06T09:00:00+05:30'));
        expect(p.festivals).toEqual([]);
        expect(p.rituals).toEqual([]);
    });
});

describe('panchang helpers', () => {
    it('Lahiri ayanamsa is about 24.2 degrees in 2026', () => {
        expect(lahiriAyanamsa(new Date('2026-01-01T00:00:00Z'))).toBeCloseTo(24.216, 1);
    });

    it('marks Purnima before the full moon and Amavasya before the new moon', () => {
        const start = new Date('2026-10-01T00:00:00Z');
        const full = moonPhaseTime(180, start, 40);
        const newMoon = moonPhaseTime(0, start, 40);
        const hoursBefore = (d, h) => new Date(d.getTime() - h * 3600000);
        expect(elementsAt(hoursBefore(full, 2))).toMatchObject({ tithi: 'Purnima', paksha: 'Shukla' });
        expect(elementsAt(hoursBefore(newMoon, 2))).toMatchObject({ tithi: 'Amavasya', paksha: 'Krishna' });
        expect(elementsAt(new Date(full.getTime() + 2 * 3600000))).toMatchObject({ tithi: 'Pratipada', paksha: 'Krishna' });
    });
});

describe('panchang API', () => {
    it('today.js computes instead of returning a fixed object', () => {
        const src = readFileSync(join(__dirname, '..', '..', 'frontend', 'api', 'panchang', 'today.js'), 'utf8');
        expect(src).toMatch(/computePanchang/);
        expect(src).not.toMatch(/"tithi":\s*"/);
    });

    it('query.js gives the model the computed panchang', () => {
        const src = readFileSync(join(__dirname, '..', '..', 'frontend', 'api', 'panchang', 'query.js'), 'utf8');
        expect(src).toMatch(/computePanchang/);
        expect(src).not.toMatch(/general astrological principles/);
    });
});
