import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// index.html pointed og:image and twitter:image at /og-image.png, which did
// not exist, so shared links showed no picture (TL-35).

const FRONTEND = join(__dirname, '..', '..', 'frontend');

describe('share image', () => {
    it('every image named in index.html meta tags exists in public/', () => {
        const html = readFileSync(join(FRONTEND, 'index.html'), 'utf8');
        const images = [...html.matchAll(/(?:og|twitter):image"\s+content="https:\/\/www\.telangana\.live\/([^"]+)"/g)].map((m) => m[1]);
        expect(images.length).toBeGreaterThan(0);
        for (const file of images) expect(existsSync(join(FRONTEND, 'public', file)), file).toBe(true);
    });
});
