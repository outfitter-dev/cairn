// :ga:tldr Show anchor statistics and distributions
// :ga:cmd:stats Implementation of grepa stats command

import { findFiles, parseAnchors, resolveConfig, findConfigFile } from '@grepa/core';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

interface StatsOptions {
  top?: number;
  since?: string;
  json?: boolean;
}

interface TokenStats {
  count: number;
  files: Set<string>;
  lines: number[];
}

// :ga:tldr Execute stats command
// :ga:api,cmd:stats Main stats function
export async function statsCommand(
  options: StatsOptions,
  command: any
): Promise<void> {
  const spinner = ora('Calculating statistics...').start();
  
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
    
    // :ga:algo Collect statistics
    const tokenStats = new Map<string, TokenStats>();
    const fileStats = new Map<string, number>();
    let totalAnchors = 0;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const anchors = parseAnchors(content, file, { anchor });
        
        if (anchors.length > 0) {
          fileStats.set(file, anchors.length);
        }
        
        for (const anchorObj of anchors) {
          totalAnchors++;
          
          // :ga:algo Filter by version if specified
          if (options.since && !matchesVersion(anchorObj, options.since)) {
            continue;
          }
          
          const stats = tokenStats.get(anchorObj.token) || {
            count: 0,
            files: new Set(),
            lines: []
          };
          
          stats.count++;
          stats.files.add(file);
          stats.lines.push(anchorObj.line);
          
          tokenStats.set(anchorObj.token, stats);
        }
      } catch (error) {
        // :ga:error Skip unreadable files
        continue;
      }
    }
    
    spinner.succeed('Statistics calculated');
    
    // :ga:algo Sort by frequency
    const sortedTokens = Array.from(tokenStats.entries())
      .sort((a, b) => b[1].count - a[1].count);
    
    // :ga:output Format output
    if (options.json) {
      const output = {
        summary: {
          totalFiles: files.length,
          filesWithAnchors: fileStats.size,
          totalAnchors,
          uniqueTokens: tokenStats.size
        },
        tokens: Object.fromEntries(
          sortedTokens
            .slice(0, options.top)
            .map(([token, stats]) => [
              token,
              {
                count: stats.count,
                files: stats.files.size,
                avgPerFile: (stats.count / stats.files.size).toFixed(2)
              }
            ])
        )
      };
      console.log(JSON.stringify(output, null, 2));
    } else {
      // :ga:output Display summary
      console.log('\n' + chalk.bold('Summary:'));
      console.log(`  Total files scanned: ${chalk.cyan(files.length)}`);
      console.log(`  Files with anchors: ${chalk.cyan(fileStats.size)}`);
      console.log(`  Total anchors: ${chalk.cyan(totalAnchors)}`);
      console.log(`  Unique tokens: ${chalk.cyan(tokenStats.size)}`);
      
      // :ga:output Display token histogram
      console.log('\n' + chalk.bold('Token Distribution:'));
      
      const displayTokens = options.top 
        ? sortedTokens.slice(0, options.top)
        : sortedTokens;
      
      const maxCount = displayTokens[0]?.[1].count || 0;
      const barWidth = 30;
      
      for (const [token, stats] of displayTokens) {
        const percentage = (stats.count / maxCount) * 100;
        const barLength = Math.round((percentage / 100) * barWidth);
        const bar = '█'.repeat(barLength) + '░'.repeat(barWidth - barLength);
        
        console.log(
          `  ${chalk.cyan(token.padEnd(15))} ` +
          `${chalk.gray(bar)} ` +
          `${stats.count.toString().padStart(4)} ` +
          chalk.gray(`(${stats.files.size} files)`)
        );
      }
      
      // :ga:output Show dictionary definitions if available
      if (config.dictionary && Object.keys(config.dictionary).length > 0) {
        console.log('\n' + chalk.bold('Token Definitions:'));
        for (const [token, stats] of displayTokens) {
          if (config.dictionary[token]) {
            console.log(`  ${chalk.cyan(token)}: ${config.dictionary[token]}`);
          }
        }
      }
    }
  } catch (error: any) {
    spinner.fail('Failed to calculate statistics');
    throw error;
  }
}

// :ga:tldr Check if anchor matches version filter
// :ga:algo Version filtering
function matchesVersion(anchor: any, sinceVersion: string): boolean {
  for (const token of anchor.tokens) {
    if (token.type === 'bare' && token.value.startsWith('v')) {
      return token.value >= sinceVersion;
    }
    if (token.type === 'json' && (token.value.since || token.value.v)) {
      const version = token.value.since || token.value.v;
      return version >= sinceVersion;
    }
  }
  return true;
}