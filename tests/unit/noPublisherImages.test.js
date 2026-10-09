import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// News cards displayed the photo from each publisher's RSS feed (The Hindu,
// Telangana Today, ...). Those photos are the publishers' copyright and we hold
// no licence, so a card shows the headline, our summary and a link out only.

const COMPONENTS = join(__dirname, '..', '..', 'frontend', 'src', 'components');

describe('news cards', () => {
    for (const file of ['NewsCard.jsx', 'ArticleModal.jsx']) {
        it(`${file} renders no publisher image`, () => {
            const source = readFileSync(join(COMPONENTS, file), 'utf8');
            expect(source).not.toMatch(/image_url|imageUrl/);
            expect(source).not.toMatch(/<img\b/);
        });
    }
});
