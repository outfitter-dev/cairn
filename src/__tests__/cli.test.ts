// :A: tldr Tests for CLI functionality
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CLI } from '../cli/index.js';

// :A: ctx mock console methods for testing
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(mockConsoleLog);
  vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
});

describe('CLI', () => {
  it('should create CLI instance without errors', () => {
    expect(() => new CLI()).not.toThrow();
  });

  it('should have find command available', () => {
    const cli = new CLI();
    // :A: ctx test that CLI setup includes find command
    // :A: ctx check that the program has the expected commands registered
    const commands = (cli as any).program.commands.map((cmd: any) => cmd.name());
    expect(commands).toContain('find');
  });

  it('should have search command available for backward compatibility', () => {
    const cli = new CLI();
    // :A: ctx test that CLI setup includes deprecated search command
    // :A: ctx verify backward compatibility is maintained
    const commands = (cli as any).program.commands.map((cmd: any) => cmd.name());
    expect(commands).toContain('search');
  });

  // :A: todo add integration tests for CLI commands
  // :A: ctx these would require mocking file system operations
});