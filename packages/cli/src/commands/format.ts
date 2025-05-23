// :ga:tldr Convert TODO/FIXME comments to grep-anchors
// :ga:cmd:format Implementation of grepa format command

import { findFiles, resolveConfig, findConfigFile } from '@grepa/core';
import { readFileSync, writeFileSync } from 'fs';
import { relative } from 'path';
import chalk from 'chalk';
import ora from 'ora';

interface FormatOptions {
  dryRun?: boolean;
  commentStyle?: string;
}

// :ga:tldr Patterns to convert to anchors
// const CONVERSION_PATTERNS = [
//   { pattern: /TODO:?\s*/gi, token: 'todo' },
//   { pattern: /FIXME:?\s*/gi, token: 'fixme' },
//   { pattern: /HACK:?\s*/gi, token: 'hack' },
//   { pattern: /NOTE:?\s*/gi, token: 'note' },
//   { pattern: /XXX:?\s*/gi, token: 'fixme' },
//   { pattern: /DEPRECATED:?\s*/gi, token: 'deprecated' },
//   { pattern: /REFACTOR:?\s*/gi, token: 'refactor' }
// ];

// :ga:tldr Comment patterns by style
const COMMENT_PATTERNS: Record<string, RegExp[]> = {
  c: [
    /\/\/\s*(TODO|FIXME|HACK|NOTE|XXX|DEPRECATED|REFACTOR):?\s*(.*)$/gim,
    /\/\*\s*(TODO|FIXME|HACK|NOTE|XXX|DEPRECATED|REFACTOR):?\s*(.*?)\*\//gim
  ],
  xml: [
    /<!--\s*(TODO|FIXME|HACK|NOTE|XXX|DEPRECATED|REFACTOR):?\s*(.*?)-->/gim
  ],
  hash: [
    /#\s*(TODO|FIXME|HACK|NOTE|XXX|DEPRECATED|REFACTOR):?\s*(.*)$/gim
  ]
};

// :ga:tldr Execute format command
// :ga:api,cmd:format Main format function
export async function formatCommand(
  options: FormatOptions,
  command: any
): Promise<void> {
  const spinner = ora('Scanning for convertible comments...').start();
  
  try {
    // :ga:config Get anchor from global options
    const anchor = command.parent.opts().anchor || ':ga:';
    
    // :ga:config Load configuration
    const configPath = findConfigFile(process.cwd());
    const config = resolveConfig(configPath || undefined, process.env.GREPA_ANCHOR);
    
    // :ga:algo Find all files
    const files = findFiles(
      process.cwd(),
      config.files?.include,
      config.files?.exclude
    );
    
    let totalConverted = 0;
    const changes: Array<{file: string, before: string, after: string}> = [];
    
    // :ga:algo Process each file
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const style = options.commentStyle || detectCommentStyle(file);
        const patterns = COMMENT_PATTERNS[style] || COMMENT_PATTERNS.c;
        
        let modified = content;
        let fileChanges = 0;
        
        // :ga:algo Apply conversions
        for (const pattern of patterns || []) {
          const matches = Array.from(content.matchAll(pattern));
          
          for (const match of matches) {
            const [fullMatch, keyword, comment] = match;
            const token = keyword?.toLowerCase() || '';
            const replacement = fullMatch.replace(
              new RegExp(keyword + ':?\\s*', 'i'),
              `${anchor}${token} `
            );
            
            if (replacement !== fullMatch) {
              modified = modified.replace(fullMatch, replacement);
              fileChanges++;
              
              if (options.dryRun) {
                changes.push({
                  file,
                  before: fullMatch.trim(),
                  after: replacement.trim()
                });
              }
            }
          }
        }
        
        // :ga:algo Write changes if not dry run
        if (fileChanges > 0) {
          totalConverted += fileChanges;
          
          if (!options.dryRun) {
            writeFileSync(file, modified);
          }
        }
      } catch (error) {
        // :ga:error Skip unreadable files
        continue;
      }
    }
    
    spinner.succeed(`Found ${totalConverted} comments to convert`);
    
    // :ga:output Display results
    if (options.dryRun) {
      if (changes.length === 0) {
        console.log(chalk.yellow('No convertible comments found'));
      } else {
        console.log('\n' + chalk.bold('Preview of changes:'));
        
        // :ga:output Group by file
        const byFile = new Map<string, typeof changes>();
        for (const change of changes) {
          const list = byFile.get(change.file) || [];
          list.push(change);
          byFile.set(change.file, list);
        }
        
        for (const [file, fileChanges] of byFile) {
          console.log('\n' + chalk.magenta(relative(process.cwd(), file)));
          for (const change of fileChanges) {
            console.log(chalk.red(`- ${change.before}`));
            console.log(chalk.green(`+ ${change.after}`));
          }
        }
        
        console.log('\n' + chalk.gray('Run without --dry-run to apply changes'));
      }
    } else {
      console.log(chalk.green(`✓ Converted ${totalConverted} comments to anchors`));
    }
  } catch (error: any) {
    spinner.fail('Format failed');
    throw error;
  }
}

// :ga:tldr Detect comment style from file extension
// :ga:algo Comment style detection
function detectCommentStyle(file: string): string {
  const ext = file.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'html':
    case 'xml':
    case 'svg':
    case 'vue':
      return 'xml';
    
    case 'py':
    case 'rb':
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'yaml':
    case 'yml':
    case 'toml':
      return 'hash';
    
    default:
      return 'c';
  }
}