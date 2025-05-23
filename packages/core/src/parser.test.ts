// :ga:tldr Unit tests for the grepa anchor parser
import { describe, it, expect } from 'vitest';
import { parseAnchors } from './parser';

describe('parser', () => {
  describe('parseAnchors', () => {
    it('should parse basic single token anchors', () => {
      const content = '// :ga:tldr This is a test function\nfunction test() {}';
      const anchors = parseAnchors(content, 'test.ts');
      
      expect(anchors).toHaveLength(1);
      expect(anchors[0]).toMatchObject({
        token: 'tldr',
        line: 1,
        file: 'test.ts',
        raw: ':ga:tldr',
        comment: 'This is a test function'
      });
    });

    it('should parse multiple anchors in a file', () => {
      const content = `
// :ga:tldr Main function
function main() {
  // :ga:sec Security check
  validateInput();
  
  // :ga:temp Temporary hack
  doSomething();
}
`;
      const anchors = parseAnchors(content, 'main.ts');
      
      expect(anchors).toHaveLength(3);
      expect(anchors.map(a => a.token)).toEqual(['tldr', 'sec', 'temp']);
      expect(anchors[0].line).toBe(2);
      expect(anchors[1].line).toBe(4);
      expect(anchors[2].line).toBe(7);
    });

    it('should handle array token syntax', () => {
      const content = '// :ga:[fix,sec,p0] Critical security fix';
      const anchors = parseAnchors(content, 'fix.ts');
      
      expect(anchors).toHaveLength(3);
      expect(anchors.map(a => a.token)).toEqual(['fix', 'sec', 'p0']);
      anchors.forEach(anchor => {
        expect(anchor.comment).toBe('Critical security fix');
        expect(anchor.raw).toBe(':ga:[fix,sec,p0]');
      });
    });

    it('should handle JSON payload syntax', () => {
      const content = '// :ga:{"token":"api","version":"2.0"} API endpoint';
      const anchors = parseAnchors(content, 'api.ts');
      
      expect(anchors).toHaveLength(1);
      expect(anchors[0]).toMatchObject({
        token: 'api',
        payload: '{"token":"api","version":"2.0"}',
        comment: 'API endpoint'
      });
    });

    it('should ignore malformed anchors', () => {
      const content = `
// :ga: 
// :ga:
// :ga:[]
// :ga:{}
// :ga:[,]
// :ga:_invalid
// :ga:123invalid
`;
      const anchors = parseAnchors(content, 'test.ts');
      
      expect(anchors).toHaveLength(0);
    });

    it('should handle anchors without comments', () => {
      const content = '// :ga:todo';
      const anchors = parseAnchors(content, 'test.ts', { includeComment: true });
      
      expect(anchors).toHaveLength(1);
      expect(anchors[0].comment).toBeUndefined();
    });

    it('should work without includeComment option', () => {
      const content = '// :ga:test This is a comment';
      const anchors = parseAnchors(content, 'test.ts', { includeComment: false });
      
      expect(anchors).toHaveLength(1);
      expect(anchors[0].comment).toBeUndefined();
    });

    it('should handle anchors in different comment styles', () => {
      const content = `
// :ga:single Single line
/* :ga:multi Multi line */
# :ga:hash Hash comment
-- :ga:sql SQL comment
<!-- :ga:html HTML comment -->
`;
      const anchors = parseAnchors(content, 'mixed.ts');
      
      expect(anchors).toHaveLength(5);
      expect(anchors.map(a => a.token)).toEqual(['single', 'multi', 'hash', 'sql', 'html']);
    });

    it('should handle edge cases with line numbers', () => {
      const content = ':ga:first\n\n\n:ga:fourth';
      const anchors = parseAnchors(content, 'edge.ts');
      
      expect(anchors).toHaveLength(2);
      expect(anchors[0].line).toBe(1);
      expect(anchors[1].line).toBe(4);
    });

    it('should preserve exact raw format', () => {
      const testCases = [
        { content: '// :ga:simple', expected: ':ga:simple', count: 1 },
        { content: '// :ga:[a,b,c]', expected: ':ga:[a,b,c]', count: 3 }, // 3 tokens from array
        { content: '// :ga:{"key":"value"}', expected: ':ga:{"key":"value"}', count: 0 }, // No token key in JSON
      ];

      testCases.forEach(({ content, expected, count }) => {
        const anchors = parseAnchors(content, 'test.ts');
        expect(anchors).toHaveLength(count);
        if (count > 0) {
          expect(anchors[0]?.raw).toBe(expected);
        }
      });
    });
  });
});