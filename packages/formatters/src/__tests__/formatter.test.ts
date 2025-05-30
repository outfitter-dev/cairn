// :A: tldr Tests for formatter implementations
import { describe, it, expect } from 'vitest';
import type { MagicAnchor, SearchResult, ParseResult } from '@grepa/types';
import {
  JsonSearchResultFormatter,
  JsonMagicAnchorFormatter,
  JsonParseResultFormatter,
  JsonMagicAnchorListFormatter,
} from '../formatters/json.formatter';
import {
  TerminalSearchResultFormatter,
  TerminalMagicAnchorFormatter,
  TerminalParseResultFormatter,
  TerminalMagicAnchorListFormatter,
} from '../formatters/terminal.formatter';

const mockAnchor: MagicAnchor = {
  line: 42,
  markers: ['todo', 'api'],
  prose: 'implement authentication',
  file: 'src/auth.ts',
};

const mockSearchResult: SearchResult = {
  anchor: mockAnchor,
  context: {
    before: ['function login() {', '  // Previous line'],
    after: ['  // Next line', '}'],
  },
};

const mockParseResult: ParseResult = {
  anchors: [mockAnchor],
  errors: [],
};

describe('JSON Formatters', () => {
  it('should format search results as JSON', () => {
    const formatter = new JsonSearchResultFormatter();
    const output = formatter.format([mockSearchResult]);
    const parsed = JSON.parse(output);
    
    expect(parsed).toHaveLength(1);
    expect(parsed[0].anchor.line).toBe(42);
    expect(parsed[0].anchor.markers).toEqual(['todo', 'api']);
  });

  it('should format single anchor as JSON', () => {
    const formatter = new JsonMagicAnchorFormatter();
    const output = formatter.format(mockAnchor);
    const parsed = JSON.parse(output);
    
    expect(parsed.line).toBe(42);
    expect(parsed.markers).toEqual(['todo', 'api']);
  });

  it('should format parse result as JSON', () => {
    const formatter = new JsonParseResultFormatter();
    const output = formatter.format(mockParseResult);
    const parsed = JSON.parse(output);
    
    expect(parsed.anchors).toHaveLength(1);
    expect(parsed.errors).toHaveLength(0);
  });

  it('should format anchor list as JSON', () => {
    const formatter = new JsonMagicAnchorListFormatter();
    const output = formatter.format([mockAnchor]);
    const parsed = JSON.parse(output);
    
    expect(parsed).toHaveLength(1);
    expect(parsed[0].line).toBe(42);
  });
});

describe('Terminal Formatters', () => {
  it('should format search results for terminal', () => {
    const formatter = new TerminalSearchResultFormatter();
    const output = formatter.format([mockSearchResult]);
    
    expect(output).toContain('src/auth.ts:42');
    expect(output).toContain('todo');
    expect(output).toContain('api');
    expect(output).toContain('implement authentication');
  });

  it('should show context when requested', () => {
    const formatter = new TerminalSearchResultFormatter({ context: 2 });
    const output = formatter.format([mockSearchResult]);
    
    expect(output).toContain('function login() {');
    expect(output).toContain('// Next line');
  });

  it('should handle empty results', () => {
    const formatter = new TerminalSearchResultFormatter();
    const output = formatter.format([]);
    
    expect(output).toContain('No anchors found');
  });

  it('should format single anchor for terminal', () => {
    const formatter = new TerminalMagicAnchorFormatter();
    const output = formatter.format(mockAnchor);
    
    expect(output).toContain('src/auth.ts:42');
    expect(output).toContain('todo');
    expect(output).toContain('implement authentication');
  });

  it('should format parse result for terminal', () => {
    const formatter = new TerminalParseResultFormatter();
    const output = formatter.format(mockParseResult);
    
    expect(output).toContain('✓ 1 anchors found');
    expect(output).toContain('src/auth.ts:42');
  });

  it('should show markers only when requested', () => {
    const formatter = new TerminalMagicAnchorListFormatter({ markersOnly: true });
    const output = formatter.format([mockAnchor]);
    
    expect(output).toContain('• todo');
    expect(output).toContain('• api');
    expect(output).not.toContain('src/auth.ts');
  });
});