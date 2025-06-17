// tldr ::: Unified terminal formatter with color support
import chalk from 'chalk';
import type { IFormatter, FormatterInput } from '../interfaces/unified-formatter.interface.js';
import type { SearchResult, Waymark } from '@waymark/types';

export class TerminalFormatter implements IFormatter {
  // ::: api format data for terminal display
  format(input: FormatterInput): string {
    switch (input.type) {
      case 'search':
        return this.formatSearchResults(input.data);
      case 'list':
        return this.formatListResults(input.data);
      case 'parse':
        return this.formatParseResults(input.data);
      case 'contexts':
        return this.formatContexts(input.data);
      default:
        return JSON.stringify(input, null, 2);
    }
  }

  // ::: api format search results for terminal
  private formatSearchResults(results: SearchResult[]): string {
    if (results.length === 0) {
      return chalk.yellow('No waymarks found');
    }

    const output: string[] = [];
    output.push(chalk.green(`Found ${results.length} waymark(s):\n`));

    // ::: ctx group by file
    const byFile = new Map<string, SearchResult[]>();
    for (const result of results) {
      const file = result.waymark.file || 'unknown';
      if (!byFile.has(file)) {
        byFile.set(file, []);
      }
      byFile.get(file)!.push(result);
    }

    // ::: ctx display each file
    for (const [file, fileResults] of byFile) {
      output.push(chalk.blue(file));
      for (const result of fileResults) {
        output.push(this.formatWaymark(result.waymark));
        if (result.context) {
          output.push(this.formatContext(result));
        }
      }
      output.push('');
    }

    return output.join('\n');
  }

  // ::: api format list results
  private formatListResults(results: SearchResult[]): string {
    // ::: ctx same format as search results
    return this.formatSearchResults(results);
  }

  // ::: api format parse results
  private formatParseResults(data: { file: string; result: { waymarks: Waymark[]; errors: any[] } }): string {
    const output: string[] = [];
    
    output.push(chalk.blue(`\n📁 ${data.file}`));
    output.push(chalk.green(`✓ ${data.result.waymarks.length} waymarks found`));
    
    if (data.result.errors.length > 0) {
      output.push(chalk.red(`⚠ ${data.result.errors.length} errors:`));
      for (const error of data.result.errors) {
        output.push(chalk.red(`  Line ${error.line}: ${error.message}`));
      }
    }

    for (const waymark of data.result.waymarks) {
      output.push(this.formatWaymark(waymark));
    }

    return output.join('\n');
  }

  // ::: api format unique contexts
  private formatContexts(contexts: string[]): string {
    const output: string[] = [];
    output.push(chalk.green(`Found ${contexts.length} unique context(s):\n`));
    
    for (const context of contexts.sort()) {
      output.push(chalk.cyan(`• ${context}`));
    }

    return output.join('\n');
  }

  // ::: api format single waymark with line and column number
  private formatWaymark(waymark: Waymark): string {
    const contexts = waymark.contexts.map(c => chalk.cyan(c)).join(', ');
    const prose = waymark.prose ? ` ${waymark.prose}` : '';
    return `${chalk.yellow(`${waymark.line}:${waymark.column}`)}: ${contexts}${prose}`;
  }

  // ::: api format context lines
  private formatContext(result: SearchResult): string {
    const output: string[] = [];
    
    if (result.context?.before) {
      result.context.before.forEach((line, idx) => {
        const lineNum = Math.max(1, result.waymark.line - result.context!.before.length + idx);
        output.push(chalk.dim(`    ${lineNum}: ${line}`));
      });
    }

    if (result.context?.after) {
      result.context.after.forEach((line, idx) => {
        const lineNum = result.waymark.line + idx + 1;
        output.push(chalk.dim(`    ${lineNum}: ${line}`));
      });
    }

    return output.join('\n');
  }
}