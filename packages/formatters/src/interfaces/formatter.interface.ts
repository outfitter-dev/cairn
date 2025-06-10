// :A: tldr Base formatter interface for all output formatters
import type { SearchResult, MagicAnchor, ParseResult } from '@cairn/types';

export interface IFormatter<T> {
  format(data: T): string;
}

export interface ISearchResultFormatter extends IFormatter<SearchResult[]> {}
export interface IMagicAnchorFormatter extends IFormatter<MagicAnchor> {}
export interface IParseResultFormatter extends IFormatter<ParseResult> {}
export interface IMagicAnchorListFormatter extends IFormatter<MagicAnchor[]> {}

export interface FormatterOptions {
  color?: boolean;
  context?: number;
  showFullPath?: boolean;
  contextsOnly?: boolean;
}