// :ga:tldr List unique anchor tags found in codebase
// :ga:cmd:list Implementation of grepa list command

import { findFiles, parseAnchors, resolveConfig, findConfigFile } from '@grepa/core';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

interface ListOptions {
  json?: boolean;
  count?: boolean;
}

// :ga:tldr Execute list command
// :ga:api,cmd:list Main list function
export async function listCommand(options: ListOptions, command: any): Promise<void> {
  const spinner = ora('Scanning for anchors...').start();
  
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
    
    // :ga:algo Parse anchors from all files
    const tokenCounts = new Map<string, number>();
    let totalAnchors = 0;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const anchors = parseAnchors(content, file, { anchor });
        
        for (const anchor of anchors) {
          totalAnchors++;
          const count = tokenCounts.get(anchor.token) || 0;
          tokenCounts.set(anchor.token, count + 1);
        }
      } catch (error) {
        // :ga:error Skip unreadable files
        continue;
      }
    }
    
    spinner.succeed(`Found ${totalAnchors} anchors in ${files.length} files`);
    
    // :ga:algo Sort tokens by frequency
    const sortedTokens = Array.from(tokenCounts.entries())
      .sort((a, b) => b[1] - a[1]);
    
    // :ga:output Format output
    if (options.json) {
      const output = options.count
        ? Object.fromEntries(sortedTokens)
        : sortedTokens.map(([token]) => token);
      console.log(JSON.stringify(output, null, 2));
    } else {
      if (sortedTokens.length === 0) {
        console.log(chalk.yellow('No anchor tags found'));
        return;
      }
      
      console.log('\n' + chalk.bold('Anchor Tags:'));
      for (const [token, count] of sortedTokens) {
        if (options.count) {
          console.log(`  ${chalk.cyan(token.padEnd(20))} ${chalk.gray(count.toString())}`);
        } else {
          console.log(`  ${chalk.cyan(token)}`);
        }
      }
    }
  } catch (error: any) {
    spinner.fail('Failed to list anchors');
    throw error;
  }
}