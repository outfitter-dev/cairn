#!/usr/bin/env node
// :A: tldr CLI entry point for Grepa command
import { CLI } from './index.js';

void (async () => {
  const cli = new CLI();
  await cli.run();
})();