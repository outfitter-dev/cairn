// :ga:tldr Main CLI entry point for grepa
// :ga:entry CLI initialization

import { program } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Import commands
import { listCommand } from './commands/list.js';
import { grepCommand } from './commands/grep.js';
import { lintCommand } from './commands/lint.js';
import { statsCommand } from './commands/stats.js';
import { formatCommand } from './commands/format.js';

// :ga:tldr Get package version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

// :ga:tldr Configure CLI program
// :ga:cmd:main CLI setup
program
  .name('grepa')
  .description('CLI for managing grep-anchors in your codebase')
  .version(packageJson.version)
  .option('--anchor <sigil>', 'override anchor sigil (default: ":ga:")', ':ga:');

// :ga:cmd:list List command
program
  .command('list')
  .alias('ls')
  .description('List unique anchor tokens')
  .option('--json', 'output as JSON')
  .option('--count', 'show token counts')
  .action(listCommand);

// :ga:cmd:grep Grep command
program
  .command('grep <pattern>')
  .description('Search for anchors matching pattern')
  .option('--files', 'only show file names')
  .option('--json', 'output as JSON')
  .action(grepCommand);

// :ga:cmd:lint Lint command
program
  .command('lint')
  .description('Enforce anchor policies')
  .option('--forbid <tokens...>', 'forbidden tokens')
  .option('--max-age <days>', 'maximum age in days', parseInt)
  .option('--ci', 'CI mode (exit 1 on violations)')
  .action(lintCommand);

// :ga:cmd:stats Stats command
program
  .command('stats')
  .description('Show anchor statistics')
  .option('--top <n>', 'show top N tokens', parseInt)
  .option('--since <version>', 'filter by version')
  .option('--json', 'output as JSON')
  .action(statsCommand);

// :ga:cmd:format Format command
program
  .command('format')
  .description('Convert TODOs/FIXMEs to anchors')
  .option('--dry-run', 'preview changes without writing')
  .option('--comment-style <style>', 'comment style (c|xml|hash)', 'c')
  .action(formatCommand);

// :ga:error Global error handling
program.exitOverride();

try {
  await program.parseAsync(process.argv);
} catch (error: any) {
  if (error.code === 'commander.help') {
    process.exit(0);
  }
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}