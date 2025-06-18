// tldr ::: Tests for waymark parser functionality
import { describe, it, expect } from 'vitest';
import { WaymarkParser } from '../parser/waymark-parser.js';

describe('WaymarkParser', () => {
  it('should parse basic waymark with single marker', () => {
    const content = '// todo ::: implement validation';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.waymarks).toHaveLength(1);
      expect(result.data.errors).toHaveLength(0);
      
      const waymark = result.data.waymarks[0];
      expect(waymark).toBeDefined();
      expect(waymark!.contexts).toEqual(['todo']);
      expect(waymark!.prose).toBe('implement validation');
      expect(waymark!.line).toBe(1);
    }
  });
  
  it('should parse waymark with multiple markers', () => {
    const content = '// sec, todo ::: validate inputs';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.waymarks).toHaveLength(1);
      const waymark = result.data.waymarks[0];
      expect(waymark).toBeDefined();
      expect(waymark!.contexts).toEqual(['sec', 'todo']);
      expect(waymark!.prose).toBe('validate inputs');
    }
  });
  
  it('should parse waymark without prose', () => {
    const content = '// tldr ::: brief description here';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.waymarks).toHaveLength(1);
      const waymark = result.data.waymarks[0];
      expect(waymark).toBeDefined();
      expect(waymark!.contexts).toEqual(['tldr']);
      expect(waymark!.prose).toBe('brief description here');
    }
  });
  
  it('should detect missing space after :::', () => {
    const content = '// :::todo fix this';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.waymarks).toHaveLength(0);
      expect(result.data.errors).toHaveLength(1);
      expect(result.data.errors[0]?.message).toBe('Missing required space after :::');
    }
  });
  
  it('should detect empty waymark payload', () => {
    const content = '// ::: ';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.waymarks).toHaveLength(0);
      expect(result.data.errors).toHaveLength(1);
      expect(result.data.errors[0]?.message).toBe('No marker found before :::');
    }
  });
  
  it('should find waymarks by marker', () => {
    const content = `
      // todo ::: implement
      // notice ::: validate #security
      // todo, perf ::: optimize
    `;
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const todoWaymarks = WaymarkParser.findByContext(result.data.waymarks, 'todo');
      expect(todoWaymarks).toHaveLength(2);
    }
  });

  it('should handle file size limit', () => {
    // 11MB - exceeds the 10MB limit
    const largeContent = 'x'.repeat(10 * 1024 * 1024 + 1);
    const result = WaymarkParser.parseWithResult(largeContent);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('file.tooLarge');
    }
  });

  it('should handle parentheses in markers correctly', () => {
    const content = '// issue(123), owner(@alice) ::: fix authentication';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.waymarks).toHaveLength(1);
      const waymark = result.data.waymarks[0];
      expect(waymark!.contexts).toEqual(['issue(123)', 'owner(@alice)']);
      expect(waymark!.prose).toBe('fix authentication');
    }
  });

  it('should handle complex nested parentheses and brackets in markers', () => {
    const content = '// todo(priority:high,tags:[ui,backend]), blocked:[4,7], owner:@alice ::: test complex parsing';
    const result = WaymarkParser.parseWithResult(content);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.waymarks).toHaveLength(1);
      const waymark = result.data.waymarks[0];
      expect(waymark!.contexts).toEqual(['todo(priority:high,tags:[ui,backend])', 'blocked:[4,7]', 'owner:@alice']);
      expect(waymark!.prose).toBe('test complex parsing');
    }
  });

  it('should validate markers with colons and array syntax', () => {
    const testCases = [
      { content: '// priority:high ::: task description', expectedContexts: ['priority:high'] },
      { content: '// owner:@alice ::: feature implementation', expectedContexts: ['owner:@alice'] },
      { content: '// blocked:[123,456] ::: waiting on dependencies', expectedContexts: ['blocked:[123,456]'] },
      { content: '// tags:[ui,backend,api] ::: multi-component work', expectedContexts: ['tags:[ui,backend,api]'] },
      { content: '// status:in-progress ::: currently working on this', expectedContexts: ['status:in-progress'] },
    ];

    testCases.forEach(({ content, expectedContexts }) => {
      const result = WaymarkParser.parseWithResult(content);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.waymarks).toHaveLength(1);
        expect(result.data.waymarks[0]!.contexts).toEqual(expectedContexts);
      }
    });
  });
});