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

  // :A: todo add integration tests for CLI commands
  // :A: ctx these would require mocking file system operations
});