import { defineConfig } from 'tsup';

// :ga:tldr Build configuration for @grepa/cli package
export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  dts: false,
  sourcemap: false,
  clean: true,
  minify: false,
  splitting: false,
  treeshake: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node'
  },
  outDir: 'dist',
  target: 'node18'
});