import { defineConfig } from 'vitest/config';

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
});
