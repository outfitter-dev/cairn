// :A: tldr Main CLI implementation using Commander.js
import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { MagicAnchorParser, GrepaSearch, success, failure, makeError, humanise, parseCommandOptionsSchema, searchCommandOptionsSchema, listCommandOptionsSchema, fromZod } from '@grepa/core';
import type { Result, AppError } from '@grepa/core';
import type { MagicAnchor } from '@grepa/types';
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
      .action(async (files: string[], options) => {
        const result = await this.parseCommand(files, options);
        this.handleCommandResult(result);
      });

    // :A: api search command to find specific anchors
    this.program
      .command('search')
      .description('Search for anchors by marker')
      .argument('<marker>', 'Marker to search for')
      .argument('[files...]', 'Files to search (default: all)')
      .option('-j, --json', 'Output as JSON')
      .option('-c, --context <lines>', 'Show context lines', '0')
      .option('--no-gitignore', 'Do not respect .gitignore files')
      .action(async (marker: string, files: string[], options) => {
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
      .option('--no-gitignore', 'Do not respect .gitignore files')
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
      if (process.env['DEBUG'] === 'true') {
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
    const results: Array<{ file: string; anchors: MagicAnchor[]; errors: unknown[] }> = [];
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

      if (validOptions.json === true) {
        results.push({ file, ...parseResult.data });
      } else {
        const formatType = 'terminal';
        const formatter = FormatterFactory.createParseResultFormatter(formatType);
        console.log(chalk.blue(`\n📁 ${file}`));
        console.log(formatter.format(parseResult.data));
      }
    }

    if (validOptions.json === true && results.length > 0) {
      console.log(JSON.stringify(results, null, 2));
    }

    if (errors.length > 0 && validOptions.json !== true) {
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
      context: validOptions.context ? parseInt(validOptions.context) : 0,
      recursive: true,
      respectGitignore: validOptions.gitignore !== false
    };

    // :A: ctx use Result-based search
    const searchResult = await GrepaSearch.searchWithResult(patterns, searchOptions);
    if (!searchResult.ok) {
      return searchResult;
    }

    const results = searchResult.data;

    if (validOptions.json === true) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      const formatType = 'terminal';
      const formatter = FormatterFactory.createSearchResultFormatter(formatType, {
        context: searchOptions.context
      });
      if (results.length === 0) {
        console.log(chalk.yellow('No anchors found'));
      } else {
        console.log(chalk.green(`Found ${results.length} anchor(s) with marker: ${marker}\n`));
        console.log(formatter.format(results));
      }
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
      recursive: true,
      respectGitignore: validOptions.gitignore !== false
    });

    if (!searchResult.ok) {
      return searchResult;
    }

    // :A: ctx extract anchors from search results
    const anchors = searchResult.data.map(result => result.anchor);

    if (validOptions.json === true) {
      console.log(JSON.stringify(anchors, null, 2));
    } else {
      const formatType = 'terminal';
      const formatter = FormatterFactory.createMagicAnchorListFormatter(
        formatType,
        validOptions.markers ? { markersOnly: true } : undefined
      );
      console.log(formatter.format(anchors));
    }

    return success(undefined);
  }

}