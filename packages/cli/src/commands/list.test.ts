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
    
    vi.mocked(findFiles).mockResolvedValue([
      '/test/file1.ts',
      '/test/file2.ts',
    ]);
    
    vi.mocked(fs.readFileSync)
      .mockReturnValueOnce('// :ga:tldr Test file 1\n// :ga:todo Do something')
      .mockReturnValueOnce('// :ga:tldr Test file 2\n// :ga:fix Bug here');
    
    vi.mocked(parseAnchors)
      .mockReturnValueOnce([
        { token: 'tldr', line: 1, file: '/test/file1.ts', raw: ':ga:tldr' },
        { token: 'todo', line: 2, file: '/test/file1.ts', raw: ':ga:todo' },
      ])
      .mockReturnValueOnce([
        { token: 'tldr', line: 1, file: '/test/file2.ts', raw: ':ga:tldr' },
        { token: 'fix', line: 2, file: '/test/file2.ts', raw: ':ga:fix' },
      ]);
    
    await listCommand({}, mockCommand);
    
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
    
    vi.mocked(findFiles).mockResolvedValue([]);
    
    await listCommand({}, mockCommand);
    
    expect(consoleLogSpy).toHaveBeenCalledWith('No anchors found');
  });

  it('should output JSON when format is json', async () => {
    const { findFiles, parseAnchors, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: { tldr: 'Brief summary' },
    } as any);
    
    vi.mocked(findFiles).mockResolvedValue(['/test/file1.ts']);
    
    vi.mocked(fs.readFileSync).mockReturnValue('// :ga:tldr Test');
    
    vi.mocked(parseAnchors).mockReturnValue([
      { token: 'tldr', line: 1, file: '/test/file1.ts', raw: ':ga:tldr' },
    ]);
    
    await listCommand({ format: 'json' }, mockCommand);
    
    const output = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(output).toHaveProperty('tokens');
    expect(output.tokens).toHaveProperty('tldr');
    expect(output.tokens.tldr.count).toBe(1);
  });

  it('should sort by count when sort option is provided', async () => {
    const { findFiles, parseAnchors, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: {},
    } as any);
    
    vi.mocked(findFiles).mockResolvedValue(['/test/file1.ts']);
    
    vi.mocked(fs.readFileSync).mockReturnValue(
      '// :ga:rare Once\n// :ga:common Twice\n// :ga:common Again'
    );
    
    vi.mocked(parseAnchors).mockReturnValue([
      { token: 'rare', line: 1, file: '/test/file1.ts', raw: ':ga:rare' },
      { token: 'common', line: 2, file: '/test/file1.ts', raw: ':ga:common' },
      { token: 'common', line: 3, file: '/test/file1.ts', raw: ':ga:common' },
    ]);
    
    await listCommand({ sort: true }, mockCommand);
    
    // Verify that common (2) appears before rare (1)
    const calls = consoleLogSpy.mock.calls.map((c: any[]) => c[0]);
    const commonIndex = calls.findIndex((c: string) => c.includes('common'));
    const rareIndex = calls.findIndex((c: string) => c.includes('rare'));
    
    expect(commonIndex).toBeLessThan(rareIndex);
  });

  it('should filter by token when token option is provided', async () => {
    const { findFiles, parseAnchors, loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
      tokenDictionary: {},
    } as any);
    
    vi.mocked(findFiles).mockResolvedValue(['/test/file1.ts']);
    
    vi.mocked(fs.readFileSync).mockReturnValue(
      '// :ga:tldr Summary\n// :ga:todo Task\n// :ga:fix Bug'
    );
    
    vi.mocked(parseAnchors).mockReturnValue([
      { token: 'tldr', line: 1, file: '/test/file1.ts', raw: ':ga:tldr' },
      { token: 'todo', line: 2, file: '/test/file1.ts', raw: ':ga:todo' },
      { token: 'fix', line: 3, file: '/test/file1.ts', raw: ':ga:fix' },
    ]);
    
    await listCommand({ token: 'tldr' }, mockCommand);
    
    // Should only show tldr token
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('tldr'));
    expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('todo'));
    expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('fix'));
  });
});