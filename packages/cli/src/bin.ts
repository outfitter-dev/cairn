#!/usr/bin/env node
// :A: tldr CLI entry point for Grepa command
import { CLI } from './index.js';

const cli = new CLI();
void cli.run();