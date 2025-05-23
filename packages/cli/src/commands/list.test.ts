// :ga:tldr Integration tests for the list command
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listCommand } from './list';
import * as fs from 'fs';
import * as path from 'path';

// Mock dependencies
vi.mock('fs');
vi.mock('@grepa/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@grepa/core')>();
  return {
    ...actual,
    findFiles: vi.fn(),
    parseAnchors: vi.fn(),
    loadConfig: vi.fn(),
    findConfigFile: vi.fn(() => '/test/.grepa.yml'),
    resolveConfig: vi.fn(() => ({
      anchor: ':ga:',
      files: {
        include: ['**/*'],
        exclude: ['**/node_modules/**'],
      },
    })),
  };
});

describe('listCommand', () => {
  let mockCommand: any;
  let consoleLogSpy: any;
  let processExitSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockCommand = {
      opts: vi.fn(() => ({ dir: '/test/dir' })),
      parent: {
        opts: vi.fn(() => ({ anchor: ':ga:' })),
      },
    };
    
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
  });

  it('should list unique tokens with counts', async () => {
    const { findFiles, parseAnchors, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: {
        tldr: 'Brief summary',
        todo: 'Task to complete',
        fix: 'Bug fix',
      },
    } as any);
    
    vi.mocked(findFiles).mockReturnValue([
      '/test/file1.ts',
      '/test/file2.ts',
    ]);
    
    vi.mocked(fs.readFileSync)
      .mockReturnValueOnce('// :ga:tldr Test file 1\n// :ga:todo Do something')
      .mockReturnValueOnce('// :ga:tldr Test file 2\n// :ga:fix Bug here');
    
    vi.mocked(parseAnchors)
      .mockReturnValueOnce([
        { 
          token: 'tldr', 
          tokens: [{ type: 'bare', value: 'tldr' }], 
          line: 1, 
          file: '/test/file1.ts', 
          raw: ':ga:tldr' 
        },
        { 
          token: 'todo', 
          tokens: [{ type: 'bare', value: 'todo' }], 
          line: 2, 
          file: '/test/file1.ts', 
          raw: ':ga:todo' 
        },
      ])
      .mockReturnValueOnce([
        { 
          token: 'tldr', 
          tokens: [{ type: 'bare', value: 'tldr' }], 
          line: 1, 
          file: '/test/file2.ts', 
          raw: ':ga:tldr' 
        },
        { 
          token: 'fix', 
          tokens: [{ type: 'bare', value: 'fix' }], 
          line: 2, 
          file: '/test/file2.ts', 
          raw: ':ga:fix' 
        },
      ]);
    
    await listCommand({ count: true }, mockCommand);
    
    // Check that tokens were counted correctly
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('tldr'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('2')); // count
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('todo'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('1')); // count
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('fix'));
  });

  it('should handle empty results', async () => {
    const { findFiles, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: {},
    } as any);
    
    vi.mocked(findFiles).mockReturnValue([]);
    
    await listCommand({}, mockCommand);
    
    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.yellow('No anchor tags found'));
  });

  it('should output JSON when format is json', async () => {
    const { findFiles, parseAnchors, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: { tldr: 'Brief summary' },
    } as any);
    
    vi.mocked(findFiles).mockReturnValue(['/test/file1.ts']);
    
    vi.mocked(fs.readFileSync).mockReturnValue('// :ga:tldr Test');
    
    vi.mocked(parseAnchors).mockReturnValue([
      { 
        token: 'tldr', 
        tokens: [{ type: 'bare', value: 'tldr' }], 
        line: 1, 
        file: '/test/file1.ts', 
        raw: ':ga:tldr' 
      },
    ]);
    
    await listCommand({ json: true }, mockCommand);
    
    const output = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(output).toEqual(['tldr']);
  });

  it('should sort by count when count option is provided', async () => {
    const { findFiles, parseAnchors, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: {},
    } as any);
    
    vi.mocked(findFiles).mockReturnValue([
      '/test/file1.ts',
      '/test/file2.ts',
      '/test/file3.ts',
    ]);
    
    vi.mocked(fs.readFileSync)
      .mockReturnValueOnce('// :ga:todo Task 1')
      .mockReturnValueOnce('// :ga:fix Bug 1\n// :ga:fix Bug 2')
      .mockReturnValueOnce('// :ga:todo Task 2');
    
    vi.mocked(parseAnchors)
      .mockReturnValueOnce([
        { 
          token: 'todo', 
          tokens: [{ type: 'bare', value: 'todo' }], 
          line: 1, 
          file: '/test/file1.ts', 
          raw: ':ga:todo' 
        },
      ])
      .mockReturnValueOnce([
        { 
          token: 'fix', 
          tokens: [{ type: 'bare', value: 'fix' }], 
          line: 1, 
          file: '/test/file2.ts', 
          raw: ':ga:fix' 
        },
        { 
          token: 'fix', 
          tokens: [{ type: 'bare', value: 'fix' }], 
          line: 2, 
          file: '/test/file2.ts', 
          raw: ':ga:fix' 
        },
      ])
      .mockReturnValueOnce([
        { 
          token: 'todo', 
          tokens: [{ type: 'bare', value: 'todo' }], 
          line: 1, 
          file: '/test/file3.ts', 
          raw: ':ga:todo' 
        },
      ]);
    
    await listCommand({ count: true }, mockCommand);
    
    // Verify that fix (2) appears before todo (2) due to sorting
    const calls = consoleLogSpy.mock.calls.map((c: any[]) => c[0]);
    const outputLine = calls.find((c: string) => c.includes('fix') && c.includes('2'));
    expect(outputLine).toBeTruthy();
  });

  it('should handle files with no anchors', async () => {
    const { findFiles, parseAnchors, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: {},
    } as any);
    
    vi.mocked(findFiles).mockReturnValue(['/test/file1.ts']);
    
    vi.mocked(fs.readFileSync).mockReturnValue('// No anchors here');
    
    vi.mocked(parseAnchors).mockReturnValue([]);
    
    await listCommand({}, mockCommand);
    
    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.yellow('No anchor tags found'));
  });
});

// Import chalk after mocks are set up
import chalk from 'chalk';