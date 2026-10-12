import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const read = (path) => readFileSync(join(ROOT, path), 'utf8');

describe('TL-31: DPDP Act cookie consent & Google Consent Mode v2', () => {
    it('index.html sets Google Consent Mode v2 default to denied before analytics', () => {
        const html = read('frontend/index.html');
        expect(html).toContain("gtag('consent', 'default'");
        expect(html).toContain("'analytics_storage': 'denied'");
        expect(html).toContain("'ad_storage': 'denied'");
        // Ensure default consent declaration appears before GTM / GA tags
        const defaultConsentPos = html.indexOf("gtag('consent', 'default'");
        const gtmPos = html.indexOf('www.googletagmanager.com/gtm.js');
        const gaPos = html.indexOf('www.googletagmanager.com/gtag/js');
        expect(defaultConsentPos).toBeGreaterThan(-1);
        expect(defaultConsentPos).toBeLessThan(gtmPos);
        expect(defaultConsentPos).toBeLessThan(gaPos);
    });

    it('CookieConsent component dispatches consent update and stores preference', () => {
        const comp = read('frontend/src/components/CookieConsent.jsx');
        expect(comp).toContain("gtag('consent', 'update'");
        expect(comp).toContain("'analytics_storage': 'granted'");
        expect(comp).toContain("'analytics_storage': 'denied'");
        expect(comp).toContain("'cookie-consent'");
    });
});
