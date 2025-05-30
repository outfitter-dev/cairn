// :A: tldr Main CLI implementation using Commander.js
import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { MagicAnchorParser } from '../parser/magic-anchor-parser.js';
import { GrepaSearch } from '../search/grepa-search.js';
import { MagicAnchor, SearchResult } from '../types/index.js';
import { Result, success, failure } from '../lib/result.js';
import { AppError, makeError } from '../lib/error.js';
import { showResultToast, humanise } from '../lib/toast.js';
import {
  parseCommandOptionsSchema,
  searchCommandOptionsSchema,
  listCommandOptionsSchema,
} from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';

export class CLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  // :A: api configure CLI commands and options
  private setupCommands(): void {
    this.program
      .name('grepa')
      .description('Magic Anchor parser and search tool')
      .version('0.2.0');

    // :A: api parse command to analyze files for anchors
    this.program
      .command('parse')
      .description('Parse file(s) for Magic Anchors')
      .argument('<files...>', 'Files to parse')
      .option('-j, --json', 'Output as JSON')
      .option('-v, --verbose', 'Show parsing errors')
      .action(async (files: string[], options) => {
        const result = await this.parseCommand(files, options);
        this.handleCommandResult(result);
      });

    // :A: api find command to search for specific anchors
    this.program
      .command('find')
      .description('Find anchors by marker')
      .argument('<marker>', 'Marker to search for')
      .argument('[files...]', 'Files to search (default: all)')
      .option('-j, --json', 'Output as JSON')
      .option('-c, --context <lines>', 'Show context lines', '0')
      .action(async (marker: string, files: string[], options) => {
        const result = await this.searchCommand(marker, files, options);
        this.handleCommandResult(result);
      });

    // :A: api search command (deprecated alias for find)
    this.program
      .command('search')
      .description('Search for anchors by marker (deprecated: use "find")')
      .argument('<marker>', 'Marker to search for')
      .argument('[files...]', 'Files to search (default: all)')
      .option('-j, --json', 'Output as JSON')
      .option('-c, --context <lines>', 'Show context lines', '0')
      .action(async (marker: string, files: string[], options) => {
        console.log(chalk.yellow('Warning: "search" command is deprecated. Use "find" instead.'));
        const result = await this.searchCommand(marker, files, options);
        this.handleCommandResult(result);
      });

    // :A: api list command to show all anchors
    this.program
      .command('list')
      .description('List all anchors in file(s)')
      .argument('[files...]', 'Files to analyze')
      .option('-j, --json', 'Output as JSON')
      .option('-m, --markers', 'Show only markers')
      .action(async (files: string[], options) => {
        const result = await this.listCommand(files, options);
        this.handleCommandResult(result);
      });
  }

  // :A: api main CLI entry point
  async run(): Promise<void> {
    try {
      await this.program.parseAsync();
    } catch (error) {
      const appError = makeError(
        'cli.invalidCommand',
        error instanceof Error ? error.message : 'Invalid command',
        error
      );
      this.handleCommandResult(failure(appError));
    }
  }

  // :A: api handle command result with proper error display
  private handleCommandResult<T>(result: Result<T>): void {
    if (!result.ok) {
      console.error(chalk.red(`Error: ${humanise(result.error)}`));
      if (process.env['DEBUG']) {
        console.error(chalk.gray('Debug info:'), result.error);
      }
      process.exit(1);
    }
  }

  // :A: api handle parse command with Result pattern
  private async parseCommand(
    files: string[],
    options: unknown
  ): Promise<Result<void>> {
    // :A: ctx validate options
    const optionsValidation = parseCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;
    const results: any[] = [];
    const errors: AppError[] = [];

    for (const file of files) {
      if (!existsSync(file)) {
        errors.push(makeError('file.notFound', `File not found: ${file}`));
        continue;
      }

      // :A: ctx use Result-based parser
      const parseResult = MagicAnchorParser.parseWithResult(
        readFileSync(file, 'utf-8'),
        file
      );

      if (!parseResult.ok) {
        errors.push(parseResult.error);
        continue;
      }

      if (validOptions.json) {
        results.push({ file, ...parseResult.data });
      } else {
        this.displayParseResult(file, parseResult.data, validOptions.verbose ?? false);
      }
    }

    if (validOptions.json && results.length > 0) {
      console.log(JSON.stringify(results, null, 2));
    }

    if (errors.length > 0 && !validOptions.json) {
      errors.forEach(error => {
        console.error(chalk.red(`${error.code}: ${error.message}`));
      });
      return failure(errors[0]!);
    }

    return success(undefined);
  }

  // :A: api handle search command with Result pattern
  private async searchCommand(
    marker: string,
    files: string[],
    options: unknown
  ): Promise<Result<void>> {
    // :A: ctx validate options
    const optionsValidation = searchCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;
    const patterns = files.length > 0 ? files : ['.'];
    const searchOptions = {
      markers: [marker],
      context: parseInt(validOptions.context ?? '0') || 0,
      recursive: true
    };

    // :A: ctx use Result-based search
    const searchResult = await GrepaSearch.searchWithResult(patterns, searchOptions);
    if (!searchResult.ok) {
      return searchResult;
    }

    const results = searchResult.data;

    if (validOptions.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      this.displaySearchResultsNew(results, marker, searchOptions.context);
    }

    return success(undefined);
  }

  // :A: api handle list command with Result pattern
  private async listCommand(
    files: string[],
    options: unknown
  ): Promise<Result<void>> {
    // :A: ctx validate options
    const optionsValidation = listCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;

    // :A: ctx use current directory if no files specified
    const targetFiles = files.length > 0 ? files : ['.'];

    // :A: ctx search for all anchors
    const searchResult = await GrepaSearch.searchWithResult(targetFiles, {
      recursive: true
    });

    if (!searchResult.ok) {
      return searchResult;
    }

    // :A: ctx extract anchors from search results
    const anchors = searchResult.data.map(result => result.anchor);

    if (validOptions.json) {
      console.log(JSON.stringify(anchors, null, 2));
    } else {
      this.displayAnchors(anchors, validOptions.markers ?? false);
    }

    return success(undefined);
  }

  // :A: api display parse results in human-readable format
  private displayParseResult(file: string, result: any, showErrors: boolean): void {
    console.log(chalk.blue(`\n📁 ${file}`));
    console.log(chalk.green(`✓ ${result.anchors.length} anchors found`));
    
    if (showErrors && result.errors.length > 0) {
      console.log(chalk.red(`⚠ ${result.errors.length} errors:`));
      result.errors.forEach((error: any) => {
        console.log(chalk.red(`  Line ${error.line}: ${error.message}`));
      });
    }

    result.anchors.forEach((anchor: MagicAnchor) => {
      this.displayAnchor(anchor);
    });
  }

  // :A: api display search results grouped by file with improved formatting
  private displaySearchResultsNew(results: SearchResult[], marker: string, contextLines: number): void {
    if (results.length === 0) {
      console.log(chalk.yellow(`No anchors found with marker: ${marker}`));
      return;
    }

    console.log(chalk.green(`Found ${results.length} anchor(s) with marker: ${marker}\n`));
    
    // :A: ctx group results by file for better organization
    const groupedResults = GrepaSearch.groupByFile(results);
    
    Object.keys(groupedResults).sort().forEach(file => {
      const fileResults = groupedResults[file]!;
      
      // :A: ctx display file header
      console.log(chalk.blue(file));
      
      fileResults.forEach(result => {
        this.displayAnchorImproved(result.anchor);
        
        if (contextLines > 0 && result.context) {
          // :A: ctx show context lines before
          result.context.before.forEach((line, index) => {
            const lineNum = result.anchor.line - contextLines + index;
            console.log(chalk.dim(`    ${lineNum}: ${line}`));
          });
          
          // :A: ctx show context lines after  
          result.context.after.forEach((line, index) => {
            const lineNum = result.anchor.line + index + 1;
            console.log(chalk.dim(`    ${lineNum}: ${line}`));
          });
        }
      });
      
      console.log(); // :A: ctx blank line between files
    });
  }


  // :A: api display list of anchors
  private displayAnchors(anchors: MagicAnchor[], markersOnly: boolean): void {
    if (anchors.length === 0) {
      console.log(chalk.yellow('No anchors found'));
      return;
    }

    console.log(chalk.green(`Found ${anchors.length} anchor(s):\n`));
    
    if (markersOnly) {
      const uniqueMarkers = [...new Set(anchors.flatMap(a => a.markers))];
      uniqueMarkers.sort().forEach(marker => {
        console.log(chalk.cyan(`• ${marker}`));
      });
    } else {
      anchors.forEach(anchor => this.displayAnchor(anchor));
    }
  }

  // :A: api display single anchor with formatting (legacy version)
  private displayAnchor(anchor: MagicAnchor): void {
    const location = anchor.file ? `${anchor.file}:${anchor.line}` : `Line ${anchor.line}`;
    const markers = anchor.markers.map(m => chalk.cyan(m)).join(', ');
    const prose = anchor.prose ? chalk.gray(` - ${anchor.prose}`) : '';
    
    console.log(`${chalk.dim(location)} ${markers}${prose}`);
  }

  // :A: api display single anchor with improved formatting and clean output
  private displayAnchorImproved(anchor: MagicAnchor): void {
    const cleanedContent = this.cleanAnchorContent(anchor);
    const markers = anchor.markers.map(m => chalk.cyan(m)).join(', ');
    const prose = anchor.prose ? ` ${anchor.prose}` : '';
    
    console.log(`${chalk.yellow(anchor.line.toString())}: ${markers}${prose}`);
  }

  // :A: api clean comment syntax from anchor content
  private cleanAnchorContent(anchor: MagicAnchor): string {
    let content = anchor.raw;
    
    // :A: ctx strip common comment syntax patterns
    content = content
      // Remove HTML comment syntax
      .replace(/<!--\s*/, '')
      .replace(/\s*-->/, '')
      // Remove JavaScript/TypeScript comment syntax
      .replace(/\/\/\s*/, '')
      .replace(/\/\*\s*/, '')
      .replace(/\s*\*\//, '')
      // Remove Python/Shell comment syntax
      .replace(/#\s*/, '')
      // Remove other comment patterns
      .replace(/\*\s*/, '')
      .trim();
    
    return content;
  }
}