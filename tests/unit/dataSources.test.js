import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_SOURCES, CORRECTIONS } from '../../frontend/src/data/dataSources';

// /sources is the public record of where each figure comes from. Open-Meteo's
// licence (CC BY 4.0) requires the attribution it carries.

describe('data sources page', () => {
    it('every entry names a source, refresh and notes', () => {
        for (const s of DATA_SOURCES) {
            expect(s.dataset && s.source && s.refresh && s.notes, s.dataset).toBeTruthy();
        }
    });

    it('credits Open-Meteo under CC BY 4.0', () => {
        expect(DATA_SOURCES.some((s) => /Open-Meteo/.test(s.source) && /CC BY 4\.0/.test(s.notes))).toBe(true);
    });

    it('lists the invented-data corrections', () => {
        const text = CORRECTIONS.map((c) => c.what).join(' ');
        for (const ticket of ['TL-40', 'TL-41', 'TL-42', 'TL-43', 'TL-44', 'TL-46', 'TL-47']) expect(text).toContain(ticket);
    });

    it('is linked from the footer and in the sitemap', () => {
        const root = join(__dirname, '..', '..', 'frontend');
        expect(readFileSync(join(root, 'src', 'components', 'Footer.jsx'), 'utf8')).toContain('to="/sources"');
        expect(readFileSync(join(root, 'scripts', 'generate-sitemap.cjs'), 'utf8')).toContain("url: '/sources'");
    });
});
