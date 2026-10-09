import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// TL-44: pages presented made-up data as real: MLA/MP "accountability"
// scores, ration shops and MeeSeva centres with invented dealers, phone
// numbers, ratings and reviews, an application tracker that made up a status,
// random "hyper-local" alerts, a public emergency simulator, random ward
// numbers on citizen reports, fake poll tallies, "live" park crowd counts, and
// farmer advisories, MSPs and mandi prices that were stale or wrong.

const SRC = join(__dirname, '..', '..', 'frontend', 'src');
const read = (path) => readFileSync(join(SRC, path), 'utf8');

describe('invented civic data stays out', () => {
    it('removed datasets and widgets are gone', () => {
        for (const path of [
            'data/politiciansData.js',
            'data/pdsData.js',
            'data/pollData.js',
            'components/CitizenPoll.jsx',
            'components/ProactiveAlerts.jsx',
            'components/EmergencySimulator.jsx',
        ]) {
            expect(existsSync(join(SRC, path)), path).toBe(false);
        }
    });

    it('MeeSeva has no simulated tracker or invented centres', () => {
        const page = read('pages/MeeSevaPage.jsx');
        expect(page).not.toMatch(/handleTrackSubmit|S\. Ramakrishna Rao/);
        expect(read('data/meesevaData.js')).not.toMatch(/meesevaCentres|rating:|reviews:/);
    });

    it('parks show no crowd figures', () => {
        const data = read('data/parksData.js');
        expect(data).not.toMatch(/crowdIndex:|currentCount:|capacity:|disclaimer:/);
    });

    it('citizen reports are not given a random ward', () => {
        expect(read('components/ReportForm.jsx')).not.toMatch(/ward:\s*Math\.random|Math\.floor\(Math\.random/);
    });

    it('the home page cannot start a pretend emergency', () => {
        expect(read('pages/HomePage.jsx')).not.toMatch(/activateEmergency\(|system simulation/);
    });

    it('farmer page carries no fixed advisories, MSPs or mandi prices', () => {
        const data = read('data/farmerData.js');
        expect(data).not.toMatch(/cropAdvisories|mspPrices|marketPrices/);
    });

    it('no data file uses the sequential 040-23456xxx / 040-234523xx numbers', () => {
        for (const path of ['data/meesevaData.js', 'data/parksData.js', 'data/farmerData.js']) {
            expect(read(path), path).not.toMatch(/040-2345\d{4}/);
        }
    });
});
