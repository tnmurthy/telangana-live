import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
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
