// :A: tldr Unified JSON formatter for all output types
import type { IFormatter, FormatterInput } from '../interfaces/unified-formatter.interface.js';

export class JsonFormatter implements IFormatter {
  // :A: api format any input as JSON
  format(input: FormatterInput): string {
    switch (input.type) {
      case 'search':
      case 'list':
        return JSON.stringify(input.data, null, 2);
      case 'parse':
        return JSON.stringify(input.data, null, 2);
      case 'markers':
        return JSON.stringify(input.data, null, 2);
      default:
        return JSON.stringify(input, null, 2);
    }
  }
}