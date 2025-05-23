// :ga:tldr Enhanced search command with modern ergonomics
// :ga:cmd:search Main search implementation

import { 
  findFiles, 
  parseAnchors, 
  resolveConfig, 
  findConfigFile,
  type Anchor
} from '@grepa/core';
import { readFileSync } from 'fs';
import { relative, basename } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';

interface SearchOptions {
  files?: boolean;
  lineNumbers?: boolean;
  context?: number;
  ignoreCase?: boolean;
  word?: boolean;
  fixed?: boolean;
  json?: boolean;
  open?: boolean;
  interactive?: boolean;
  anchor?: string;
}

// :ga:tldr Common token aliases for better ergonomics
const TOKEN_ALIASES: Record<string, string[]> = {
  'security': ['sec', 'security', 'auth', 'crypto'],
  'performance': ['perf', 'performance', 'optimize', 'slow'],
  'bug': ['fix', 'bug', 'fixme', 'broken'],
  'todo': ['todo', 'task', 'placeholder'],
  'api': ['api', 'public', 'interface', 'endpoint'],
  'config': ['config', 'configuration', 'settings'],
  'error': ['error', 'exception', 'catch', 'throw'],
  'test': ['test', 'spec', 'testing', 'coverage'],
};

// :ga:tldr Execute search command
// :ga:api,cmd:search Main search function
export async function searchCommand(
  pattern: string | undefined,
  options: SearchOptions,
  command: any
): Promise<void> {
  // :ga:algo If no pattern, show help
  if (!pattern) {
    command.outputHelp();
    return;
  }

  const spinner = ora('Searching...').start();
  
  try {
    // :ga:config Get anchor from options
    const anchor = options.anchor || command.parent?.opts()?.anchor || ':ga:';
    
    // :ga:config Load configuration
    const configPath = findConfigFile(process.cwd());
    const config = resolveConfig(configPath || undefined, process.env.GREPA_ANCHOR);
    
    // :ga:algo Expand aliases
    const expandedPatterns = expandPattern(pattern);
    
    // :ga:algo Smart search with ripgrep if available
    const useRipgrep = await checkRipgrep();
    
    if (useRipgrep && !options.interactive) {
      spinner.stop();
      await execRipgrepEnhanced(anchor, expandedPatterns, options);
    } else {
      await internalSearchEnhanced(anchor, expandedPatterns, options, config, spinner);
    }
  } catch (error: any) {
    spinner.fail('Search failed');
    throw error;
  }
}

// :ga:tldr Expand pattern with aliases and fuzzy matching
// :ga:algo Pattern expansion
function expandPattern(pattern: string): string[] {
  const patterns = [pattern];
  
  // :ga:algo Check for alias matches
  const lowerPattern = pattern.toLowerCase();
  for (const [alias, tokens] of Object.entries(TOKEN_ALIASES)) {
    if (lowerPattern === alias) {
      patterns.push(...tokens);
    }
  }
  
  // Don't add wildcards - they cause regex issues
  return [...new Set(patterns)];
}

// :ga:tldr Check if ripgrep is available
async function checkRipgrep(): Promise<boolean> {
  try {
    await execa('rg', ['--version']);
    return true;
  } catch {
    return false;
  }
}

// :ga:tldr Execute enhanced ripgrep search
// :ga:dep,perf Ripgrep integration
async function execRipgrepEnhanced(
  anchor: string,
  patterns: string[],
  options: SearchOptions
): Promise<void> {
  const args = ['--color=always', '--heading', '--line-number'];
  
  // :ga:algo Build regex pattern
  const regexPatterns = patterns.map(p => 
    `${escapeRegex(anchor)}[^\\n]*${escapeRegex(p)}`
  );
  const combinedPattern = regexPatterns.join('|');
  
  args.push(combinedPattern);
  
  // :ga:algo Add option flags
  if (options.files) args.push('--files-with-matches');
  if (options.ignoreCase) args.push('--ignore-case');
  if (options.word) args.push('--word-regexp');
  if (options.context) args.push(`--context=${options.context}`);
  
  try {
    const { stdout } = await execa('rg', args, {
      cwd: process.cwd(),
      shell: false
    });
    
    // :ga:output Enhanced formatting
    const lines = stdout.split('\n');
    let currentFile = '';
    
    for (const line of lines) {
      if (!line) continue;
      
      // :ga:algo Detect file headers
      if (!line.startsWith(' ') && line.includes(':')) {
        currentFile = line.split(':')[0];
        console.log('\n' + chalk.bold.magenta(currentFile));
      } else if (line.match(/^\d+:/)) {
        // :ga:algo Format matching lines
        const [lineNum, ...rest] = line.split(':');
        const content = rest.join(':');
        const highlighted = highlightAnchor(content, anchor, patterns);
        console.log(
          chalk.green(`  ${lineNum.padStart(4)}:`) + highlighted
        );
      } else {
        // :ga:algo Context lines
        console.log(chalk.gray(line));
      }
    }
  } catch (error: any) {
    if (error.exitCode === 1) {
      console.log(chalk.yellow('No matches found'));
    } else {
      throw error;
    }
  }
}

// :ga:tldr Enhanced internal search implementation
// :ga:algo Fallback search
async function internalSearchEnhanced(
  anchor: string,
  patterns: string[],
  options: SearchOptions,
  config: any,
  spinner: any
): Promise<void> {
  spinner.text = 'Finding files...';
  
  const files = findFiles(
    process.cwd(),
    config.files?.include,
    config.files?.exclude
  );
  
  spinner.text = `Searching ${files.length} files...`;
  
  const matches: Array<{
    file: string;
    line: number;
    text: string;
    anchor: Anchor;
    context?: string[];
  }> = [];
  
  // :ga:algo Search through files
  let filesProcessed = 0;
  for (const file of files) {
    if (filesProcessed % 10 === 0) {
      spinner.text = `Searching... (${filesProcessed}/${files.length})`;
    }
    filesProcessed++;
    
    try {
      const content = readFileSync(file, 'utf8');
      const lines = content.split('\n');
      const anchors = parseAnchors(content, file, { anchor });
      
      for (const anchorObj of anchors) {
        // :ga:algo Work with simple anchor structure
        const token = (anchorObj as any).token || '';
        
        // :ga:algo Check patterns
        const matchesPattern = patterns.some(pattern => {
          if (options.ignoreCase) {
            return token.toLowerCase().includes(pattern.toLowerCase()) ||
                   anchorObj.raw.toLowerCase().includes(pattern.toLowerCase());
          }
          return token.includes(pattern) || anchorObj.raw.includes(pattern);
        });
        
        if (matchesPattern) {
          const match = {
            file: relative(process.cwd(), file),
            line: anchorObj.line,
            text: lines[anchorObj.line - 1] || anchorObj.raw,
            anchor: anchorObj,
            context: options.context ? 
              getContext(lines, anchorObj.line - 1, options.context) : undefined
          };
          matches.push(match);
        }
      }
    } catch (error) {
      continue;
    }
  }
  
  spinner.succeed(`Found ${matches.length} matches in ${files.length} files`);
  
  // :ga:output Display results
  if (options.json) {
    console.log(JSON.stringify(matches, null, 2));
  } else if (options.interactive) {
    await showInteractive(matches, options);
  } else {
    displayMatches(matches, options, anchor, patterns);
  }
}

// :ga:tldr Display formatted matches
// :ga:output Result formatting
function displayMatches(
  matches: any[],
  options: SearchOptions,
  anchor: string,
  patterns: string[]
): void {
  if (matches.length === 0) {
    console.log(chalk.yellow('No matches found'));
    return;
  }
  
  // :ga:algo Group by file
  const byFile = new Map<string, typeof matches>();
  for (const match of matches) {
    const list = byFile.get(match.file) || [];
    list.push(match);
    byFile.set(match.file, list);
  }
  
  for (const [file, fileMatches] of byFile) {
    if (options.files) {
      console.log(chalk.magenta(file));
    } else {
      console.log('\n' + chalk.bold.magenta(file));
      
      for (const match of fileMatches) {
        // :ga:output Line with highlighting
        const highlighted = highlightAnchor(match.text, anchor, patterns);
        console.log(
          chalk.green(`  ${match.line.toString().padStart(4)}:`) + highlighted
        );
        
        // :ga:output Context lines
        if (match.context) {
          match.context.forEach((line, i) => {
            if (i !== Math.floor(match.context.length / 2)) {
              console.log(chalk.gray(`      :${line}`));
            }
          });
        }
      }
    }
  }
  
  // :ga:output Summary
  console.log(
    '\n' + chalk.gray(`${matches.length} matches in ${byFile.size} files`)
  );
}

// :ga:tldr Highlight anchor and pattern in text
// :ga:output Syntax highlighting
function highlightAnchor(text: string, anchor: string, patterns: string[]): string {
  let highlighted = text;
  
  // :ga:algo Highlight anchor
  highlighted = highlighted.replace(
    new RegExp(`(${escapeRegex(anchor)}[^\\s]*)`, 'g'),
    chalk.blue('$1')
  );
  
  // :ga:algo Highlight patterns
  for (const pattern of patterns) {
    const regex = new RegExp(`(${escapeRegex(pattern)})`, 'gi');
    highlighted = highlighted.replace(regex, chalk.yellow.bold('$1'));
  }
  
  return highlighted;
}

// :ga:tldr Get context lines around a match
// :ga:algo Context extraction
function getContext(lines: string[], lineIndex: number, contextSize: number): string[] {
  const start = Math.max(0, lineIndex - contextSize);
  const end = Math.min(lines.length, lineIndex + contextSize + 1);
  return lines.slice(start, end);
}

// :ga:tldr Show interactive selection
// :ga:ui Interactive mode
async function showInteractive(matches: any[], options: SearchOptions): Promise<void> {
  // :ga:placeholder Interactive fuzzy finder implementation
  console.log(chalk.yellow('Interactive mode coming soon!'));
  displayMatches(matches, options, ':ga:', []);
}

// :ga:tldr Escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}