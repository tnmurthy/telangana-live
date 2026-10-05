import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// News cards showed "N% AI Confidence" computed from the title's length
// (75 + title.length % 20) whenever an article had no credibility_score,
// which was every article. A score is shown only when one was measured.

const COMPONENTS = join(__dirname, '..', '..', 'frontend', 'src', 'components');

describe('news confidence badge', () => {
    for (const file of ['NewsCard.jsx', 'ArticleModal.jsx']) {
        it(`${file} never derives a confidence from the title`, () => {
            const source = readFileSync(join(COMPONENTS, file), 'utf8');
            expect(source).not.toMatch(/title\.length\s*%/);
        });
    }
});

// TL-19: the grievance dashboard and report map showed 8 invented reports
// ("Pothole near Gachibowli flyover", ...) as real civic data.
describe('citizen report sample data', () => {
    it('no invented reports remain in the site code', () => {
        const data = readFileSync(join(__dirname, '..', '..', 'frontend', 'src', 'data', 'reportingData.js'), 'utf8');
        const dashboard = readFileSync(join(COMPONENTS, 'GrievanceDashboard.jsx'), 'utf8');
        expect(data).not.toMatch(/mockReports/);
        expect(dashboard).not.toMatch(/mockReports/);
    });
});

// Sponsor cards showed a random "Brand Sync 85-99% Match" and a "Business
// DNA Verified" badge. A paid card is labelled Sponsored and claims nothing else.
describe('sponsor card', () => {
    const source = readFileSync(join(COMPONENTS, 'PartnerCard.jsx'), 'utf8');

    it('shows no random or invented match score', () => {
        expect(source).not.toMatch(/Math\.random/);
        expect(source).not.toMatch(/% Match|DNA Verified/);
    });

    it('is labelled Sponsored with a sponsored link', () => {
        expect(source).toMatch(/>\s*Sponsored\s*</);
        expect(source).toMatch(/rel="sponsored/);
    });
});
