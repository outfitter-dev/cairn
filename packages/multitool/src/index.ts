#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'node:module';
import { createAuditCommand } from './commands/audit.js';
import { createBlazeCommand } from './commands/blaze.js';
import { createTldrCheckCommand } from './commands/tldr-check.js';
import { createMigrateCommand } from './commands/migrate.js';

// Get version from package.json
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();

program
  .name('wm')
  .description(chalk.cyan.bold('A versatile CLI tool for Waymark project maintenance, linting, and migration.'))
  .version(pkg.version, '-v, --version', 'Output the current version')
  .usage('<command> [options]')
  .helpOption('-h, --help', 'Display help for command');

// Add commands
program.addCommand(createAuditCommand());
program.addCommand(createBlazeCommand());
program.addCommand(createTldrCheckCommand());
program.addCommand(createMigrateCommand());

program.parse(process.argv);

if (!program.args.length) {
  program.help();
} 