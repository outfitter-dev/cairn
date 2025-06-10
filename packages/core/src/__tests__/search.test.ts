// :M: tldr Tests for CairnSearch functionality
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, unlinkSync, mkdirSync, rmdirSync } from 'fs';
import { resolve } from 'path';
import { CairnSearch } from '../search/cairn-search.js';

describe('CairnSearch', () => {
  const testDir = './test-files';
  const testFile1 = `${testDir}/test1.ts`;
  const testFile2 = `${testDir}/test2.md`;

  beforeAll(() => {
    // :M: ctx create test directory and files
    mkdirSync(testDir, { recursive: true });
    
    writeFileSync(testFile1, `
// :M: tldr Test file for search functionality
export function test() {
  // :M: todo implement this function
  // :M: sec validate all inputs
  return 42;
}
    `.trim());
    
    writeFileSync(testFile2, `
<!-- :M: guide Test markdown file -->
# Test Document

<!-- :M: todo add more content -->
<!-- :M: api document the API -->
Some content here.
    `.trim());
  });

  afterAll(() => {
    // :M: ctx cleanup test files
    unlinkSync(testFile1);
    unlinkSync(testFile2);
    rmdirSync(testDir);
  });

  it('should search for anchors by context', async () => {
    const result = await CairnSearch.search([testFile1], { contexts: ['todo'] });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      const firstResult = result.data[0];
      expect(firstResult).toBeDefined();
      expect(firstResult!.anchor.contexts).toContain('todo');
      expect(firstResult!.anchor.prose).toBe('implement this function');
    }
  });

  it('should search multiple files', async () => {
    const result = await CairnSearch.search([testFile1, testFile2], { contexts: ['todo'] });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
      const files = result.data.map((r: any) => r.anchor.file);
      // :M: ctx globby returns absolute paths
      expect(files).toContain(resolve(testFile1));
      expect(files).toContain(resolve(testFile2));
    }
  });

  it('should include context when requested', async () => {
    const result = await CairnSearch.search([testFile1], { 
      contexts: ['todo'],
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

  it('should search with glob patterns', async () => {
    const result = await CairnSearch.search([`${testDir}/*.ts`], { contexts: ['todo'] });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      const firstResult = result.data[0];
      expect(firstResult).toBeDefined();
      expect(firstResult!.anchor.file).toContain('test1.ts');
    }
  });

  it('should get unique contexts from results', async () => {
    const result = await CairnSearch.search([testFile1, testFile2]);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const contexts = CairnSearch.getUniqueContexts(result.data);
      expect(contexts).toContain('tldr');
      expect(contexts).toContain('todo');
      expect(contexts).toContain('sec');
      expect(contexts).toContain('guide');
      expect(contexts).toContain('api');
    }
  });

  it('should group results by context', async () => {
    const result = await CairnSearch.search([testFile1, testFile2]);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const grouped = CairnSearch.groupByContext(result.data);
      expect(grouped['todo']).toHaveLength(2);
      expect(grouped['tldr']).toHaveLength(1);
      expect(grouped['api']).toHaveLength(1);
    }
  });

  it('should group results by file', async () => {
    const result = await CairnSearch.search([testFile1, testFile2]);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      const grouped = CairnSearch.groupByFile(result.data);
      // :M: ctx use absolute paths for lookup
      const absFile1 = resolve(testFile1);
      const absFile2 = resolve(testFile2);
      expect(grouped[absFile1]).toHaveLength(3); // tldr, todo, sec
      expect(grouped[absFile2]).toHaveLength(3); // guide, todo, api
    }
  });

  it('should handle non-existent files gracefully', async () => {
    const result = await CairnSearch.search(['non-existent-file.ts']);
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('search.noResults');
    }
  });

  it('should respect file extension filtering', async () => {
    const result = await CairnSearch.search([`${testDir}/*`]);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      // :M: ctx should find both .ts and .md files
      expect(result.data.length).toBeGreaterThan(0);
      const files = result.data.map((r: any) => r.anchor.file);
      expect(files.some((f: string) => f.endsWith('.ts'))).toBe(true);
      expect(files.some((f: string) => f.endsWith('.md'))).toBe(true);
    }
  });
});