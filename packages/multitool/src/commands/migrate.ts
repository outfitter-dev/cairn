import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { FileFinder } from '../lib/file-finder.js';
import { initializeConfig, status, logger } from '../lib/cli-config.js';
import { getSymbols } from '../lib/ui-components.js';
// import { specLoader } from '../lib/spec-loader.js';

interface MigrateOptions {
  dryRun?: boolean;
  verbose?: boolean;
  filesOnly?: boolean;
  unicode?: boolean;
  color?: boolean;
}

// NOTE: This is a simplified version of the logic from the original script.
// It will be expanded upon.
// const DEPRECATED_REPLACEMENTS: Record<string, string> = {
//   'fixme': 'fix',
//   'temporary': 'temp',
//   'info': 'note',
//   'wip': 'draft',
// };

export function createMigrateCommand(): Command {
  const migrate = new Command('migrate')
    .description('Migrate legacy waymark syntax to the latest v1.0 standard.')
    .option('--dry-run', 'Preview changes without modifying files')
    .option('-v, --verbose', 'Show detailed information about each change')
    .option('--files-only', 'Only output modified file paths (useful for piping)')
    .option('--no-unicode', 'Use ASCII characters instead of Unicode')
    .option('--no-color', 'Disable colored output')
    .action(async (options: MigrateOptions) => {
      await runMigration(options);
    });

  return migrate;
}

async function runMigration(options: MigrateOptions) {
  initializeConfig(options);
  const symbols = getSymbols();
  const { dryRun, verbose, filesOnly } = options;
  if (!filesOnly) {
    logger.info(`${symbols.sync} Migrating waymarks to v1.0 syntax...`);
    if (dryRun) {
      logger.warn(`${symbols.scanning} DRY RUN MODE - No files will be modified`);
    }
  }

  const rootDir = process.cwd();
  const fileFinder = new FileFinder({ rootDir, patterns: ['**/*.*'] });
  const files = await fileFinder.findFiles();

  // Dynamically build replacements from the spec
  const replacements = getReplacementsFromSpec();

  let totalChanges = 0;
  let filesModified = 0;

  for (const file of files) {
    try {
      const filePath = path.join(rootDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      for (const [deprecated, replacement] of Object.entries(replacements)) {
        // Look for `deprecated :::`
        const regex = new RegExp(`\\b${deprecated}\\s+:::`, 'g');
        content = content.replace(regex, `${replacement} :::`);
      }
      
      if (content !== originalContent) {
        const changesInFile = (content.match(/:::/g) || []).length - (originalContent.match(/:::/g) || []).length;
        filesModified++;
        totalChanges += changesInFile;

        if (filesOnly) {
          console.log(file);
        } else if (verbose) {
          logger.success(`${symbols.edit} ${file}: ${changesInFile} changes`);
        }
        
        if (!dryRun) {
          fs.writeFileSync(filePath, content, 'utf8');
        }
      }
    } catch (err) {
      // Ignore errors for binary files etc.
    }
  }

  if (!filesOnly) {
    status(`Migration complete. ${filesModified} files modified, ${totalChanges} total changes.`, 'success');
  }
}

function getReplacementsFromSpec(): Record<string, string> {
  // const specReplacements: Record<string, string> = {};
  
  // This is a placeholder for a more robust mapping logic based on the spec file.
  // For now, it mirrors the old script's direct replacements.
  const deprecatedMap = {
    'fix': 'fixme', 'temp': 'temporary', 'draft': 'wip',
    'alert': 'notice', 'check': 'review', 'must': '!!todo',
    'ci': 'test', 'needs': 'todo', 'blocked': '!todo',
    'sec': '!notice', 'audit': 'review', 'warn': '!notice',
    'new': 'wip', 'hold': '*todo', 'shipped': 'done',
    'perf': 'refactor', 'cleanup': 'refactor', 'hack': '!fixme'
  };
  
  return deprecatedMap;
} 