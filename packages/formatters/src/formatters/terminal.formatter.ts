// :A: tldr Terminal formatters with color support for human-readable output
import chalk from 'chalk';
import type { SearchResult, MagicAnchor, ParseResult } from '@grepa/types';
import type {
  ISearchResultFormatter,
  IMagicAnchorFormatter,
  IParseResultFormatter,
  IMagicAnchorListFormatter,
  FormatterOptions,
} from '../interfaces';

export class TerminalSearchResultFormatter implements ISearchResultFormatter {
  constructor(private options: FormatterOptions = {}) {}

  format(results: SearchResult[]): string {
    if (results.length === 0) {
      return chalk.yellow('No anchors found');
    }

    const output: string[] = [];

    results.forEach(result => {
      output.push(this.formatAnchor(result.anchor));
      
      if (this.options.context && this.options.context > 0 && result.context !== undefined) {
        // :A: ctx show context lines before
        result.context.before.forEach((line, index) => {
          const lineNum = Math.max(1, result.anchor.line - (this.options.context ?? 0) + index);
          output.push(chalk.dim(`    ${lineNum}: ${line}`));
        });
        
        // :A: ctx show context lines after  
        result.context.after.forEach((line, index) => {
          const lineNum = result.anchor.line + index + 1;
          output.push(chalk.dim(`    ${lineNum}: ${line}`));
        });
        
        output.push(''); // :A: ctx blank line between results
      }
    });

    return output.join('\n');
  }

  private formatAnchor(anchor: MagicAnchor): string {
    const location = anchor.file !== undefined ? `${anchor.file}:${anchor.line}` : `Line ${anchor.line}`;
    const markers = anchor.markers.map(m => chalk.cyan(m)).join(', ');
    const prose = anchor.prose !== undefined ? chalk.gray(` - ${anchor.prose}`) : '';
    
    return `${chalk.dim(location)} ${markers}${prose}`;
  }
}

export class TerminalMagicAnchorFormatter implements IMagicAnchorFormatter {
  format(anchor: MagicAnchor): string {
    const location = anchor.file !== undefined ? `${anchor.file}:${anchor.line}` : `Line ${anchor.line}`;
    const markers = anchor.markers.map(m => chalk.cyan(m)).join(', ');
    const prose = anchor.prose !== undefined ? chalk.gray(` - ${anchor.prose}`) : '';
    
    return `${chalk.dim(location)} ${markers}${prose}`;
  }
}

export class TerminalParseResultFormatter implements IParseResultFormatter {
  constructor(private anchorFormatter: TerminalMagicAnchorFormatter = new TerminalMagicAnchorFormatter()) {}

  format(result: ParseResult): string {
    const output: string[] = [];
    
    output.push(chalk.green(`✓ ${result.anchors.length} anchors found`));
    
    if (result.errors.length > 0) {
      output.push(chalk.red(`⚠ ${result.errors.length} errors:`));
      result.errors.forEach((error) => {
        output.push(chalk.red(`  Line ${error.line}: ${error.message}`));
      });
    }

    result.anchors.forEach((anchor: MagicAnchor) => {
      output.push(this.anchorFormatter.format(anchor));
    });

    return output.join('\n');
  }
}

export class TerminalMagicAnchorListFormatter implements IMagicAnchorListFormatter {
  constructor(
    private options: FormatterOptions = {},
    private anchorFormatter: TerminalMagicAnchorFormatter = new TerminalMagicAnchorFormatter()
  ) {}

  format(anchors: MagicAnchor[]): string {
    if (anchors.length === 0) {
      return chalk.yellow('No anchors found');
    }

    const output: string[] = [
      chalk.green(`Found ${anchors.length} anchor(s):\n`)
    ];
    
    if (this.options.markersOnly) {
      const uniqueMarkers = [...new Set(anchors.flatMap(a => a.markers))];
      uniqueMarkers.sort().forEach(marker => {
        output.push(chalk.cyan(`• ${marker}`));
      });
    } else {
      anchors.forEach(anchor => {
        output.push(this.anchorFormatter.format(anchor));
      });
    }

    return output.join('\n');
  }
}