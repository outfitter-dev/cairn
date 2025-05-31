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
  private static createFormatter<T>(
    format: FormatType,
    jsonCtor: new () => T,
    terminalCtor: new (options?: FormatterOptions) => T,
    options?: FormatterOptions
  ): T {
    switch (format) {
      case 'json':
        return new jsonCtor();
      case 'terminal':
        return new terminalCtor(options);
      default:
        throw new Error(`Unknown format: ${format satisfies never}`);
    }
  }

  static createSearchResultFormatter(format: FormatType, options?: FormatterOptions): ISearchResultFormatter {
    return this.createFormatter(
      format,
      JsonSearchResultFormatter,
      TerminalSearchResultFormatter,
      options
    );
  }

  static createMagicAnchorFormatter(format: FormatType): IMagicAnchorFormatter {
    return this.createFormatter(
      format,
      JsonMagicAnchorFormatter,
      TerminalMagicAnchorFormatter
    );
  }

  static createParseResultFormatter(format: FormatType): IParseResultFormatter {
    switch (format) {
      case 'json':
        return new JsonParseResultFormatter();
      case 'terminal':
        return new TerminalParseResultFormatter();
      default:
        throw new Error(`Unknown format: ${format satisfies never}`);
    }
  }

  static createMagicAnchorListFormatter(format: FormatType, options?: FormatterOptions): IMagicAnchorListFormatter {
    switch (format) {
      case 'json':
        return new JsonMagicAnchorListFormatter();
      case 'terminal':
        return new TerminalMagicAnchorListFormatter(options);
      default:
        throw new Error(`Unknown format: ${format satisfies never}`);
    }
  }
}