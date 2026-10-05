import { describe, it, expect } from 'vitest';
import { loadPlausible } from '../../frontend/src/utils/plausible';

// Cookieless analytics (Plausible): loaded only when VITE_PLAUSIBLE_DOMAIN is
// set, so it stays off until the site is added in a Plausible account.

function fakeDocument() {
    const added = [];
    return {
        added,
        createElement: () => {
            const attrs = {};
            return { attrs, setAttribute: (k, v) => { attrs[k] = v; } };
        },
        querySelector: (selector) => added.find((s) => selector.includes(s.src)) || null,
        head: { appendChild: (el) => added.push(el) },
    };
}

describe('loadPlausible', () => {
    it('adds the Plausible script for the given domain once', () => {
        const doc = fakeDocument();
        expect(loadPlausible('www.telangana.live', doc)).toBe(true);
        expect(loadPlausible('www.telangana.live', doc)).toBe(false);
        expect(doc.added).toHaveLength(1);
        const [script] = doc.added;
        expect(script.attrs['data-domain']).toBe('www.telangana.live');
        expect(script.src).toBe('https://plausible.io/js/script.js');
        expect(script.defer).toBe(true);
    });

    it('does nothing without a domain', () => {
        const doc = fakeDocument();
        expect(loadPlausible('', doc)).toBe(false);
        expect(loadPlausible(undefined, doc)).toBe(false);
        expect(doc.added).toEqual([]);
    });
});
