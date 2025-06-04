// :A: tldr Factory for creating unified formatters
import type { IFormatter } from './interfaces/unified-formatter.interface.js';
import { TerminalFormatter } from './formatters/unified-terminal.formatter.js';
import { JsonFormatter } from './formatters/unified-json.formatter.js';
import { CSVFormatter } from './formatters/csv.formatter.js';

export type UnifiedFormatType = 'terminal' | 'json' | 'csv';

export class FormatterFactory {
  // :A: api create formatter based on type
  static create(format: UnifiedFormatType = 'terminal'): IFormatter {
    switch (format) {
      case 'terminal':
        return new TerminalFormatter();
      case 'json':
        return new JsonFormatter();
      case 'csv':
        return new CSVFormatter();
      default:
        throw new Error(`Unknown format: ${format satisfies never}`);
    }
  }
}