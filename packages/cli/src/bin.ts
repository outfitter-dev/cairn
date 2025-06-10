#!/usr/bin/env node
// :M: tldr CLI entry point for Cairn command
import { CLI } from './index.js';

void (async () => {
  const cli = new CLI();
  await cli.run();
})();