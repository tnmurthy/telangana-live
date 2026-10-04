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
