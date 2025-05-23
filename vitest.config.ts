// :ga:tldr Vitest configuration for grepa monorepo
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'packages/*/dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        '**/__mocks__/**',
      ],
    },
    include: ['packages/**/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    watchExclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: {
      '@grepa/core': resolve(__dirname, './packages/core/src'),
      '@grepa/cli': resolve(__dirname, './packages/cli/src'),
    },
  },
});