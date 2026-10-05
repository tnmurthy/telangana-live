import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { STATIC_META, canonicalFor, guideDescription, isNoIndex } from '../../frontend/src/utils/pageMeta';

const FRONTEND = join(__dirname, '..', '..', 'frontend');

describe('canonical URLs', () => {
    it('index.html no longer pins every page to the home page', () => {
        expect(readFileSync(join(FRONTEND, 'index.html'), 'utf8')).not.toMatch(/rel="canonical"/);
    });

    it('uses the www host and drops trailing slashes', () => {
        expect(canonicalFor('/')).toBe('https://www.telangana.live/');
        expect(canonicalFor('/jobs/')).toBe('https://www.telangana.live/jobs');
        expect(canonicalFor('/services/bills-taxes/property-tax')).toBe('https://www.telangana.live/services/bills-taxes/property-tax');
    });

    it('keeps admin and search pages out of the index', () => {
        expect(isNoIndex('/admin/cockpit')).toBe(true);
        expect(isNoIndex('/search')).toBe(true);
        expect(isNoIndex('/schemes')).toBe(false);
    });
});

describe('static route titles', () => {
    it('every entry is a real route with a snippet-length description', () => {
        const app = readFileSync(join(FRONTEND, 'src', 'App.jsx'), 'utf8');
        for (const [path, [title, description]] of Object.entries(STATIC_META)) {
            expect(app, path).toContain(`'${path}'`);
            expect(title.length, path).toBeGreaterThan(3);
            expect(description.length, path).toBeLessThanOrEqual(160);
        }
    });
});

describe('guideDescription', () => {
    it('takes the first prose paragraph, not the heading or a list', () => {
        const md = '# Birth Certificate\n\nA birth certificate is an official record.\n\n- item';
        expect(guideDescription(md)).toBe('A birth certificate is an official record.');
    });

    it('trims long paragraphs at a word boundary', () => {
        const out = guideDescription(`# T\n\n${'word '.repeat(60)}`);
        expect(out.length).toBeLessThanOrEqual(156);
        expect(out.endsWith('…')).toBe(true);
    });

    it('yields a description for every published guide', () => {
        const docs = join(FRONTEND, 'src', 'content', 'docs');
        for (const dir of readdirSync(docs)) {
            for (const file of readdirSync(join(docs, dir))) {
                const text = readFileSync(join(docs, dir, file), 'utf8');
                expect(guideDescription(text).length, `${dir}/${file}`).toBeGreaterThan(40);
            }
        }
    });
});

describe('one tag per page', () => {
    it('index.html sets no description; pages do not set their own canonical', () => {
        expect(readFileSync(join(FRONTEND, 'index.html'), 'utf8')).not.toMatch(/name="description"/);
        const pages = join(FRONTEND, 'src', 'pages');
        for (const file of readdirSync(pages)) {
            expect(readFileSync(join(pages, file), 'utf8'), file).not.toMatch(/rel="canonical"/);
        }
    });
});

describe('static route titles do not double up', () => {
    it('no STATIC_META route renders a page that sets its own description', () => {
        const app = readFileSync(join(FRONTEND, 'src', 'App.jsx'), 'utf8');
        for (const path of Object.keys(STATIC_META)) {
            const comp = app.match(new RegExp(String.raw`path: '${path}', element: <(\w+)`))?.[1];
            expect(comp, path).toBeTruthy();
            const imp = app.match(new RegExp(String.raw`${comp}\s*=\s*lazy\(\(\)\s*=>\s*import\('\./pages/([^']+)'`))?.[1]
                ?? app.match(new RegExp(String.raw`import ${comp} from '\./pages/([^']+)'`))?.[1];
            expect(imp, comp).toBeTruthy();
            const file = join(FRONTEND, 'src', 'pages', imp.endsWith('.jsx') ? imp : `${imp}.jsx`);
            expect(readFileSync(file, 'utf8'), comp).not.toMatch(/name="description"/);
        }
    });
});
