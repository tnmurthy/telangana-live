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

// /api/weather answered with fixed values (35°C, AQI 180) stamped with the
// current time whenever its key was missing, which was always. Nothing on the
// site called it; it is removed.
describe('serverless routes', () => {
    it('the stand-in weather route is gone', () => {
        expect(existsSync(join(__dirname, '..', '..', 'frontend', 'api', 'weather.js'))).toBe(false);
    });
});

// TL-46: gold and silver were dropped (read from retail-rate pages whose terms
// may not allow it); the fuel "tax breakup" was the price times fixed
// percentages; article cards fell back to fixed gold and fuel prices.
describe('gold removal and fixed fallbacks', () => {
    const ROOT = join(__dirname, '..', '..');
    it('no gold data, route or workflow remains', () => {
        for (const path of ['frontend/src/data/goldRates.js', 'frontend/api/gold-rates.js', '.github/workflows/gold_silver_update.yml']) {
            expect(existsSync(join(ROOT, path)), path).toBe(false);
        }
    });

    it('article cards carry no fixed prices', () => {
        expect(read('components/ArticleModal.jsx')).not.toMatch(/143950|157040|107\.41|95\.64/);
    });

    it('the fuel sync computes no tax breakup', () => {
        expect(readFileSync(join(ROOT, 'backend', 'scripts', 'data_engine.py'), 'utf8')).not.toMatch(/_tax_breakup|taxBreakup/);
    });
});
