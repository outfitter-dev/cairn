// :ga:tldr Main CLI entry point for grepa
// :ga:entry CLI initialization

import { program } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Import commands
import { searchCommand } from './commands/search.js';
import { listCommand } from './commands/list.js';
import { lintCommand } from './commands/lint.js';
import { statsCommand } from './commands/stats.js';
import { formatCommand } from './commands/format.js';
import { watchCommand } from './commands/watch.js';

// :ga:tldr Get package version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

// :ga:tldr Configure CLI program
// :ga:cmd:main CLI setup
program
  .name('grepa')
  .description('Modern grep for code anchors - search with superpowers')
  .version(packageJson.version)
  .argument('[pattern]', 'pattern to search for (supports fuzzy matching)')
  .option('-l, --files', 'only show file names')
  .option('-n, --line-numbers', 'show line numbers (default: true)')
  .option('-C, --context <lines>', 'show N lines of context', parseInt)
  .option('-i, --ignore-case', 'case insensitive search')
  .option('-w, --word', 'match whole words only')
  .option('-F, --fixed', 'treat pattern as literal string')
  .option('--json', 'output as JSON')
  .option('--open', 'open matches in editor')
  .option('--interactive', 'interactive mode with fuzzy selection')
  .option('--anchor <sigil>', 'override anchor sigil (default: ":ga:")', ':ga:')
  .action(searchCommand);

// :ga:cmd:list List tokens
program
  .command('list')
  .alias('ls')
  .description('List unique anchor tokens')
  .option('--json', 'output as JSON')
  .option('--count', 'show token counts')
  .option('--tree', 'show as tree structure')
  .action(listCommand);

// :ga:cmd:lint Lint anchors
program
  .command('lint')
  .description('Enforce anchor policies')
  .option('--forbid <tokens...>', 'forbidden tokens')
  .option('--max-age <days>', 'maximum age in days', parseInt)
  .option('--ci', 'CI mode (exit 1 on violations)')
  .option('--fix', 'auto-fix issues where possible')
  .action(lintCommand);

// :ga:cmd:stats Show statistics
program
  .command('stats')
  .description('Show anchor statistics')
  .option('--top <n>', 'show top N tokens', parseInt)
  .option('--since <version>', 'filter by version')
  .option('--json', 'output as JSON')
  .option('--chart', 'show ASCII chart visualization')
  .action(statsCommand);

// :ga:cmd:format Format comments
program
  .command('format')
  .description('Convert TODOs/FIXMEs to anchors')
  .option('--dry-run', 'preview changes without writing')
  .option('--comment-style <style>', 'comment style (c|xml|hash)', 'c')
  .option('--interactive', 'interactively choose conversions')
  .action(formatCommand);

// :ga:cmd:watch Watch mode
program
  .command('watch [pattern]')
  .description('Watch for anchor changes in real-time')
  .option('--notify', 'desktop notifications for new anchors')
  .action(watchCommand);

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