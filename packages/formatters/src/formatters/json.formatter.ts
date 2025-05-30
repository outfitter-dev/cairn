// :A: tldr JSON formatters for all data types
import type { SearchResult, MagicAnchor, ParseResult } from '@grepa/types';
import type {
  ISearchResultFormatter,
  IMagicAnchorFormatter,
  IParseResultFormatter,
  IMagicAnchorListFormatter,
} from '../interfaces';

export class JsonSearchResultFormatter implements ISearchResultFormatter {
  format(results: SearchResult[]): string {
    return JSON.stringify(results, null, 2);
  }
}

export class JsonMagicAnchorFormatter implements IMagicAnchorFormatter {
  format(anchor: MagicAnchor): string {
    return JSON.stringify(anchor, null, 2);
  }
}

export class JsonParseResultFormatter implements IParseResultFormatter {
  format(result: ParseResult): string {
    return JSON.stringify(result, null, 2);
  }
}

export class JsonMagicAnchorListFormatter implements IMagicAnchorListFormatter {
  format(anchors: MagicAnchor[]): string {
    return JSON.stringify(anchors, null, 2);
  }
}