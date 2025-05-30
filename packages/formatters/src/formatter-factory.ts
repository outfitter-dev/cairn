// :A: tldr Factory for creating appropriate formatters based on format type
import type {
  ISearchResultFormatter,
  IMagicAnchorFormatter,
  IParseResultFormatter,
  IMagicAnchorListFormatter,
  FormatterOptions,
} from './interfaces';
import {
  JsonSearchResultFormatter,
  JsonMagicAnchorFormatter,
  JsonParseResultFormatter,
  JsonMagicAnchorListFormatter,
} from './formatters/json.formatter';
import {
  TerminalSearchResultFormatter,
  TerminalMagicAnchorFormatter,
  TerminalParseResultFormatter,
  TerminalMagicAnchorListFormatter,
} from './formatters/terminal.formatter';

export type FormatType = 'json' | 'terminal';

export class FormatterFactory {
  createSearchResultFormatter(format: FormatType, options?: FormatterOptions): ISearchResultFormatter {
    switch (format) {
      case 'json':
        return new JsonSearchResultFormatter();
      case 'terminal':
        return new TerminalSearchResultFormatter(options);
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  createMagicAnchorFormatter(format: FormatType): IMagicAnchorFormatter {
    switch (format) {
      case 'json':
        return new JsonMagicAnchorFormatter();
      case 'terminal':
        return new TerminalMagicAnchorFormatter();
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  createParseResultFormatter(format: FormatType, _options?: FormatterOptions): IParseResultFormatter {
    switch (format) {
      case 'json':
        return new JsonParseResultFormatter();
      case 'terminal':
        return new TerminalParseResultFormatter();
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  createMagicAnchorListFormatter(format: FormatType, options?: FormatterOptions): IMagicAnchorListFormatter {
    switch (format) {
      case 'json':
        return new JsonMagicAnchorListFormatter();
      case 'terminal':
        return new TerminalMagicAnchorListFormatter(options);
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }
}