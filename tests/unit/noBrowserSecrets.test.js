import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Anything a browser module reads from import.meta.env.VITE_* is compiled into
// the public JavaScript. The Upstash REST token was shipped that way (TL-20).
// Secrets belong in server-only env vars read by frontend/api/* functions.

const SRC = join(__dirname, '..', '..', 'frontend', 'src');
const FORBIDDEN = ['VITE_UPSTASH_REDIS_REST_TOKEN', 'VITE_UPSTASH_REDIS_REST_URL'];

function sourceFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return sourceFiles(path);
        return /\.(js|jsx|ts|tsx)$/.test(name) ? [path] : [];
    });
}

describe('browser bundle secrets', () => {
    it('no browser module reads the Upstash credentials', () => {
        const offenders = sourceFiles(SRC)
            .filter((file) => FORBIDDEN.some((name) => readFileSync(file, 'utf8').includes(name)))
            .map((file) => relative(SRC, file));
        expect(offenders).toEqual([]);
    });
});
