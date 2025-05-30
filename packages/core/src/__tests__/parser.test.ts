// :A: tldr Tests for Magic Anchor parser functionality
import { describe, it, expect } from 'vitest';
import { MagicAnchorParser } from '../parser/magic-anchor-parser.js';

describe('MagicAnchorParser', () => {
  it('should parse basic anchor with single marker', () => {
    const content = '// :A: todo implement validation';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
    
    const anchor = result.anchors[0];
    expect(anchor).toBeDefined();
    expect(anchor!.markers).toEqual(['todo']);
    expect(anchor!.prose).toBe('implement validation');
    expect(anchor!.line).toBe(1);
  });
  
  it('should parse anchor with multiple markers', () => {
    const content = '// :A: sec, todo validate inputs';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(1);
    const anchor = result.anchors[0];
    expect(anchor).toBeDefined();
    expect(anchor!.markers).toEqual(['sec', 'todo']);
    expect(anchor!.prose).toBe('validate inputs');
  });
  
  it('should parse anchor without prose', () => {
    const content = '// :A: tldr';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(1);
    const anchor = result.anchors[0];
    expect(anchor).toBeDefined();
    expect(anchor!.markers).toEqual(['tldr']);
    expect(anchor!.prose).toBeUndefined();
  });
  
  it('should detect missing space after :A:', () => {
    const content = '// :A:todo fix this';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toBe('Missing required space after :A:');
  });
  
  it('should detect empty anchor payload', () => {
    const content = '// :A: ';
    const result = MagicAnchorParser.parse(content);
    
    expect(result.anchors).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toBe('Empty anchor payload');
  });
  
  it('should find anchors by marker', () => {
    const content = `
      // :A: todo implement
      // :A: sec validate
      // :A: todo, perf optimize
    `;
    const result = MagicAnchorParser.parse(content);
    const todoAnchors = MagicAnchorParser.findByMarker(result.anchors, 'todo');
    
    expect(todoAnchors).toHaveLength(2);
  });

  // :A: ctx Result pattern tests
  it('should parse with Result pattern', () => {
    const content = '// :A: todo implement validation';
    const result = MagicAnchorParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      expect(result.data.errors).toHaveLength(0);
      const firstAnchor = result.data.anchors[0];
      expect(firstAnchor).toBeDefined();
      expect(firstAnchor!.markers).toEqual(['todo']);
    }
  });

  it('should handle file size limit with Result pattern', () => {
    const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
    const result = MagicAnchorParser.parseWithResult(largeContent);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('file.tooLarge');
    }
  });
});