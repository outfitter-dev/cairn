// :A: tldr Main CLI implementation using Commander.js
import { Command } from 'commander';
import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import { 
  MagicAnchorParser, 
  GrepaSearch, 
  success, 
  failure, 
  makeError, 
  humanise, 
  parseCommandOptionsSchema, 
  searchCommandOptionsSchema, 
  listCommandOptionsSchema, 
  fromZod,
  filePathSchema
} from '@grepa/core';
import type { Result, AppError } from '@grepa/core';
import { FormatterFactory } from '@grepa/formatters';

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
      .option('-f, --format <format>', 'Output format (terminal, json, csv)', 'terminal')
      .action(async (files: string[], options) => {
        const result = await this.parseCommand(files, options);
        this.handleCommandResult(result);
      });

    // :A: api search command to find specific anchors
    this.program
      .command('search')
      .description('Search for anchors by marker')
      .argument('<marker>', 'Marker to search for')
      .argument('[patterns...]', 'File patterns to search (default: current directory)')
      .option('-j, --json', 'Output as JSON')
      .option('-c, --context <lines>', 'Show context lines', '0')
      .option('-f, --format <format>', 'Output format (terminal, json, csv)', 'terminal')
      .option('--no-gitignore', 'Do not respect .gitignore files')
      .option('--exclude <patterns...>', 'Patterns to exclude')
      .action(async (marker: string, patterns: string[], options) => {
        const result = await this.searchCommand(marker, patterns, options);
        this.handleCommandResult(result);
      });

    // :A: api list command to show all anchors
    this.program
      .command('list')
      .description('List all anchors in file(s)')
      .argument('[patterns...]', 'File patterns to analyze (default: current directory)')
      .option('-j, --json', 'Output as JSON')
      .option('-m, --markers', 'Show only markers')
      .option('-f, --format <format>', 'Output format (terminal, json, csv)', 'terminal')
      .option('--no-gitignore', 'Do not respect .gitignore files')
      .option('--exclude <patterns...>', 'Patterns to exclude')
      .action(async (patterns: string[], options) => {
        const result = await this.listCommand(patterns, options);
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
      if (process.env['DEBUG'] === 'true') {
        console.error(chalk.gray('Debug info:'), result.error);
      }
      process.exit(1);
    }
  }

  // :A: api validate file paths for security
  private validateFilePaths(files: string[]): Result<string[]> {
    const validatedPaths: string[] = [];
    
    for (const file of files) {
      // :A: sec validate file path
      const validation = filePathSchema.safeParse(file);
      if (!validation.success) {
        return failure(makeError(
          'file.invalidPath',
          `Invalid file path: ${file}`
        ));
      }
      
      // :A: sec prevent directory traversal
      const absolutePath = isAbsolute(file) ? file : resolve(process.cwd(), file);
      const normalizedPath = resolve(absolutePath);
      
      if (!normalizedPath.startsWith(process.cwd()) && !normalizedPath.startsWith('/')) {
        return failure(makeError(
          'file.accessDenied',
          `Access denied: ${file} is outside the working directory`
        ));
      }
      
      validatedPaths.push(file);
    }
    
    return success(validatedPaths);
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

    // :A: ctx validate file paths
    const pathValidation = this.validateFilePaths(files);
    if (!pathValidation.ok) {
      return pathValidation;
    }

    const formatter = FormatterFactory.create(validOptions.format || 'terminal');
    const results: any[] = [];
    const errors: AppError[] = [];

    for (const file of pathValidation.data) {
      if (!existsSync(file)) {
        errors.push(makeError('file.notFound', `File not found: ${file}`));
        continue;
      }

      try {
        // :A: ctx use async file reading
        const content = await readFile(file, 'utf-8');
        const parseResult = MagicAnchorParser.parseWithResult(content, file);

        if (!parseResult.ok) {
          errors.push(parseResult.error);
          continue;
        }

        if (validOptions.format === 'json' || validOptions.json) {
          results.push({ file, ...parseResult.data });
        } else {
          const output = formatter.format({
            type: 'parse',
            data: { file, result: parseResult.data }
          });
          console.log(output);
        }
      } catch (error) {
        errors.push(makeError(
          'file.readError',
          `Cannot read file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`
        ));
      }
    }

    if (validOptions.format === 'json' || validOptions.json) {
      console.log(JSON.stringify(results, null, 2));
    }

    if (errors.length > 0 && validOptions.verbose) {
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
    patterns: string[],
    options: any
  ): Promise<Result<void>> {
    // :A: ctx validate options
    const optionsValidation = searchCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;
    
    // :A: ctx validate marker
    if (!marker || marker.trim().length === 0) {
      return failure(makeError(
        'cli.missingArgument',
        'Marker cannot be empty'
      ));
    }

    // :A: ctx use current directory if no patterns specified
    const searchPatterns = patterns.length > 0 ? patterns : ['./**/*'];
    
    const searchOptions = {
      markers: [marker],
      context: parseInt(validOptions.context ?? '0') || 0,
      respectGitignore: options.gitignore !== false,
      exclude: options.exclude || []
    };

    // :A: ctx use new async search method
    const searchResult = await GrepaSearch.search(searchPatterns, searchOptions);
    if (!searchResult.ok) {
      return searchResult;
    }

    const formatter = FormatterFactory.create(validOptions.format || options.json ? 'json' : 'terminal');
    const output = formatter.format({
      type: 'search',
      data: searchResult.data
    });
    console.log(output);

    return success(undefined);
  }

  // :A: api handle list command with Result pattern
  private async listCommand(
    patterns: string[],
    options: any
  ): Promise<Result<void>> {
    // :A: ctx validate options
    const optionsValidation = listCommandOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    const validOptions = optionsValidation.data;

    // :A: ctx use current directory if no patterns specified
    const searchPatterns = patterns.length > 0 ? patterns : ['./**/*'];

    // :A: ctx search for all anchors
    const searchResult = await GrepaSearch.search(searchPatterns, {
      respectGitignore: options.gitignore !== false,
      exclude: options.exclude || []
    });

    if (!searchResult.ok) {
      return searchResult;
    }

    const formatter = FormatterFactory.create(validOptions.format || options.json ? 'json' : 'terminal');
    
    if (validOptions.markers) {
      // :A: ctx show only unique markers
      const uniqueMarkers = GrepaSearch.getUniqueMarkers(searchResult.data);
      const output = formatter.format({
        type: 'markers',
        data: uniqueMarkers
      });
      console.log(output);
    } else {
      const output = formatter.format({
        type: 'list',
        data: searchResult.data
      });
      console.log(output);
    }

    return success(undefined);
  }
}