import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Unit tests live at the repo root (tests/unit), one level above this
    // config; the '../../src' alias below resolves their imports. Without
    // `dir`, vitest scanned frontend/tests/unit, found nothing, and passed.
    dir: path.resolve(__dirname, '..'),
    include: ['tests/unit/**/*.test.{js,ts}'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/services/**'],
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      '../../src': path.resolve(__dirname, './src'),
    },
  },
});
