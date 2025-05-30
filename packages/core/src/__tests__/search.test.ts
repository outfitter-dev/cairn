// :A: tldr Tests for GrepaSearch functionality
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, unlinkSync, mkdirSync, rmdirSync } from 'fs';
import { GrepaSearch } from '../search/grepa-search.js';

describe('GrepaSearch', () => {
  const testDir = './test-files';
  const testFile1 = `${testDir}/test1.ts`;
  const testFile2 = `${testDir}/test2.md`;

  beforeAll(() => {
    // :A: ctx create test directory and files
    mkdirSync(testDir, { recursive: true });
    
    writeFileSync(testFile1, `
// :A: tldr Test file for search functionality
export function test() {
  // :A: todo implement this function
  // :A: sec validate all inputs
  return 42;
}
    `.trim());
    
    writeFileSync(testFile2, `
<!-- :A: guide Test markdown file -->
# Test Document

<!-- :A: todo add more content -->
<!-- :A: api document the API -->
Some content here.
    `.trim());
  });

  afterAll(() => {
    // :A: ctx cleanup test files
    unlinkSync(testFile1);
    unlinkSync(testFile2);
    rmdirSync(testDir);
  });

  it('should search for anchors by marker', async () => {
    const result = await GrepaSearch.searchWithResult([testFile1], { markers: ['todo'] });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      const firstResult = result.data[0];
      expect(firstResult).toBeDefined();
      expect(firstResult!.anchor.markers).toContain('todo');
      expect(firstResult!.anchor.prose).toBe('implement this function');
    }
  });

  it('should search multiple files', async () => {
    const result = await GrepaSearch.searchWithResult([testFile1, testFile2], { markers: ['todo'] });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
      expect(result.data.map(r => r.anchor.file)).toEqual([testFile1, testFile2]);
    }
  });

  it('should include context when requested', async () => {
    const result = await GrepaSearch.searchWithResult([testFile1], { 
      markers: ['todo'],
      context: 2
    });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      const firstResult = result.data[0];
      expect(firstResult).toBeDefined();
      expect(firstResult!.context).toBeDefined();
      expect(firstResult!.context!.before).toHaveLength(2);
      expect(firstResult!.context!.after).toHaveLength(2);
    }
  });

  it('should search directory recursively', async () => {
    const result = await GrepaSearch.searchWithResult([testDir], { markers: ['api'] });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      const firstResult = result.data[0];
      expect(firstResult).toBeDefined();
      expect(firstResult!.anchor.markers).toContain('api');
    }
  });

  it('should get unique markers from results', async () => {
    const result = await GrepaSearch.searchWithResult([testFile1, testFile2]);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const markers = GrepaSearch.getUniqueMarkers(result.data);
      expect(markers).toContain('tldr');
      expect(markers).toContain('todo');
      expect(markers).toContain('sec');
      expect(markers).toContain('guide');
      expect(markers).toContain('api');
    }
  });

  it('should group results by marker', async () => {
    const result = await GrepaSearch.searchWithResult([testFile1, testFile2]);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const grouped = GrepaSearch.groupByMarker(result.data);
      expect(grouped['todo']).toHaveLength(2);
      expect(grouped['tldr']).toHaveLength(1);
      expect(grouped['api']).toHaveLength(1);
    }
  });

  it('should group results by file', async () => {
    const result = await GrepaSearch.searchWithResult([testFile1, testFile2]);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const grouped = GrepaSearch.groupByFile(result.data);
      expect(grouped[testFile1]).toHaveLength(3); // tldr, todo, sec
      expect(grouped[testFile2]).toHaveLength(3); // guide, todo, api
    }
  });

  // :A: ctx legacy sync method tests for backward compatibility
  it('should support legacy sync search method', () => {
    const results = GrepaSearch.search([testFile1], { markers: ['todo'] });
    
    expect(results).toHaveLength(1);
    const firstResult = results[0];
    expect(firstResult).toBeDefined();
    expect(firstResult!.anchor.markers).toContain('todo');
    expect(firstResult!.anchor.prose).toBe('implement this function');
  });
});