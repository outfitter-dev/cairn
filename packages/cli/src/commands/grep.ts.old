// :ga:tldr Search for anchors matching a pattern
// :ga:cmd:grep Implementation of grepa grep command

import { findFiles, parseAnchors, resolveConfig, findConfigFile } from '@grepa/core';
import { readFileSync } from 'fs';
import { relative } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';

interface GrepOptions {
  files?: boolean;
  json?: boolean;
}

// :ga:tldr Execute grep command
// :ga:api,cmd:grep Main grep function
export async function grepCommand(
  pattern: string,
  options: GrepOptions,
  command: any
): Promise<void> {
  const spinner = ora('Searching for anchors...').start();
  
  try {
    // :ga:config Get anchor from global options
    const anchor = command.parent.opts().anchor || ':ga:';
    
    // :ga:config Load configuration
    const configPath = findConfigFile(process.cwd());
    const config = resolveConfig(configPath || undefined, process.env.GREPA_ANCHOR);
    
    // :ga:dep Try to use ripgrep if available
    const useRipgrep = await checkRipgrep();
    
    if (useRipgrep) {
      spinner.stop();
      // :ga:dep,perf Use ripgrep for better performance
      await execRipgrep(anchor, pattern, options);
    } else {
      // :ga:algo Fallback to internal implementation
      await internalGrep(anchor, pattern, options, config, spinner);
    }
  } catch (error: any) {
    spinner.fail('Failed to search anchors');
    throw error;
  }
}

// :ga:tldr Check if ripgrep is available
// :ga:dep Ripgrep detection
async function checkRipgrep(): Promise<boolean> {
  try {
    await execa('rg', ['--version']);
    return true;
  } catch {
    return false;
  }
}

// :ga:tldr Execute ripgrep for anchor search
// :ga:dep,perf Ripgrep integration
async function execRipgrep(
  anchor: string,
  pattern: string,
  options: GrepOptions
): Promise<void> {
  const args = [
    '--color=always',
    '--line-number',
    `${escapeRegex(anchor)}.*${pattern}`,
  ];
  
  if (options.files) {
    args.push('--files-with-matches');
  }
  
  if (options.json) {
    args.push('--json');
  }
  
  try {
    const { stdout } = await execa('rg', args, {
      cwd: process.cwd(),
      shell: false
    });
    console.log(stdout);
  } catch (error: any) {
    if (error.exitCode === 1) {
      // :ga:output No matches found
      console.log(chalk.yellow('No matches found'));
    } else {
      throw error;
    }
  }
}

// :ga:tldr Internal grep implementation
// :ga:algo Fallback search
async function internalGrep(
  anchor: string,
  pattern: string,
  options: GrepOptions,
  config: any,
  spinner: any
): Promise<void> {
  // :ga:algo Find all files
  const files = findFiles(
    process.cwd(),
    config.files?.include,
    config.files?.exclude
  );
  
  const matches: any[] = [];
  const matchedFiles = new Set<string>();
  
  // :ga:algo Search through files
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      const anchors = parseAnchors(content, file, { anchor });
      
      for (const anchorObj of anchors) {
        // :ga:algo Check if anchor matches pattern
        const tokenStrings = anchorObj.tokens
          .filter(t => t.type === 'bare')
          .map(t => t.value)
          .join(' ');
        
        if (tokenStrings.includes(pattern) || anchorObj.raw.includes(pattern)) {
          matchedFiles.add(file);
          
          if (!options.files) {
            matches.push({
              file: relative(process.cwd(), file),
              line: anchorObj.line,
              text: anchorObj.raw,
              anchor: anchorObj
            });
          }
        }
      }
    } catch (error) {
      // :ga:error Skip unreadable files
      continue;
    }
  }
  
  spinner.succeed(`Searched ${files.length} files`);
  
  // :ga:output Format results
  if (options.json) {
    console.log(JSON.stringify(matches, null, 2));
  } else if (options.files) {
    for (const file of matchedFiles) {
      console.log(chalk.magenta(relative(process.cwd(), file)));
    }
  } else {
    for (const match of matches) {
      console.log(
        `${chalk.magenta(match.file)}:${chalk.green(match.line)}:${match.text}`
      );
    }
  }
  
  if (matches.length === 0 && matchedFiles.size === 0) {
    console.log(chalk.yellow('No matches found'));
  }
}

// :ga:tldr Escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}