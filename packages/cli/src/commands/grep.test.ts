// :ga:tldr Integration tests for the grep command
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { grepCommand } from './grep';
import { exec } from 'child_process';
import { promisify } from 'util';

// Mock child_process
vi.mock('child_process');
vi.mock('util', () => ({
  promisify: vi.fn((fn) => {
    if (fn === exec) {
      return vi.fn();
    }
    return fn;
  }),
}));

vi.mock('@grepa/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@grepa/core')>();
  return {
    ...actual,
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

describe('grepCommand', () => {
  let mockCommand: any;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let processExitSpy: any;
  let execAsync: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockCommand = {
      opts: vi.fn(() => ({ dir: '/test/dir' })),
      parent: {
        opts: vi.fn(() => ({ anchor: ':ga:' })),
      },
    };
    
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    
    execAsync = vi.fn();
    vi.mocked(promisify).mockReturnValue(execAsync);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should search for a specific token using ripgrep', async () => {
    const { loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
    } as any);
    
    execAsync.mockResolvedValue({
      stdout: '/test/file.ts:10:// :ga:tldr This is a test\n/test/file2.ts:5:// :ga:tldr Another test',
      stderr: '',
    });
    
    await grepCommand('tldr', {}, mockCommand);
    
    // Verify ripgrep was called with correct pattern
    expect(execAsync).toHaveBeenCalledWith(
      expect.stringContaining('rg'),
      expect.objectContaining({ cwd: '/test/dir' })
    );
    expect(execAsync).toHaveBeenCalledWith(
      expect.stringContaining(':ga:tldr'),
      expect.any(Object)
    );
    
    // Verify output
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('/test/file.ts:10:// :ga:tldr This is a test')
    );
  });

  it('should handle no matches found', async () => {
    const { loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
    } as any);
    
    execAsync.mockResolvedValue({
      stdout: '',
      stderr: '',
    });
    
    await grepCommand('nonexistent', {}, mockCommand);
    
    expect(consoleLogSpy).toHaveBeenCalledWith('No matches found for token: nonexistent');
  });

  it('should output JSON format when requested', async () => {
    const { loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
    } as any);
    
    execAsync.mockResolvedValue({
      stdout: '/test/file.ts:10:// :ga:todo Fix this\n',
      stderr: '',
    });
    
    await grepCommand('todo', { format: 'json' }, mockCommand);
    
    const output = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(output).toEqual({
      token: 'todo',
      matches: [
        {
          file: '/test/file.ts',
          line: 10,
          content: '// :ga:todo Fix this',
        },
      ],
    });
  });

  it('should include context lines when requested', async () => {
    const { loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
    } as any);
    
    execAsync.mockResolvedValue({
      stdout: 'test output with context',
      stderr: '',
    });
    
    await grepCommand('fix', { context: 2 }, mockCommand);
    
    // Verify ripgrep was called with context flag
    expect(execAsync).toHaveBeenCalledWith(
      expect.stringContaining('-C 2'),
      expect.any(Object)
    );
  });

  it('should count matches when count option is used', async () => {
    const { loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
    } as any);
    
    execAsync.mockResolvedValue({
      stdout: '/test/file1.ts:3\n/test/file2.ts:1\n',
      stderr: '',
    });
    
    await grepCommand('tldr', { count: true }, mockCommand);
    
    // Verify ripgrep was called with count flag
    expect(execAsync).toHaveBeenCalledWith(
      expect.stringContaining('-c'),
      expect.any(Object)
    );
    
    // Verify output shows counts
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('/test/file1.ts:3')
    );
  });

  it('should handle ripgrep not found error', async () => {
    const { loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
    } as any);
    
    execAsync.mockRejectedValue(new Error('Command not found: rg'));
    
    await expect(grepCommand('test', {}, mockCommand)).rejects.toThrow();
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('ripgrep (rg) is required')
    );
  });

  it('should include file patterns when provided', async () => {
    const { loadConfig } = await import('@grepa/core');
    
    vi.mocked(loadConfig).mockResolvedValue({
      anchor: ':ga:',
    } as any);
    
    execAsync.mockResolvedValue({
      stdout: 'matches',
      stderr: '',
    });
    
    await grepCommand('sec', { include: '*.ts,*.js' }, mockCommand);
    
    // Verify ripgrep was called with include patterns
    expect(execAsync).toHaveBeenCalledWith(
      expect.stringContaining('-g "*.ts" -g "*.js"'),
      expect.any(Object)
    );
  });
});