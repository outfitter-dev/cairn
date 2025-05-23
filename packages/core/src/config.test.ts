// :ga:tldr Unit tests for grepa configuration loader
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadConfig, mergeConfigs, validateConfig } from './config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Mock fs and process
vi.mock('fs', async () => ({
  promises: {
    readFile: vi.fn(),
    access: vi.fn(),
  },
}));

vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('path')>();
  return {
    ...actual,
    resolve: vi.fn((dir, file) => `${dir}/${file}`),
    dirname: vi.fn((p) => {
      const lastSlash = p.lastIndexOf('/');
      return lastSlash > 0 ? p.substring(0, lastSlash) : '/';
    }),
    join: vi.fn((...parts) => parts.join('/')),
  };
});

describe('config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GREPA_ANCHOR;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validateConfig', () => {
    it('should validate a correct config', () => {
      const config = {
        anchor: ':ga:',
        defaultTokens: ['tldr', 'todo', 'fix'],
        forbiddenTokens: ['bad', 'deprecated'],
        tokenDictionary: {
          tldr: 'Brief summary',
          todo: 'Task to complete',
        },
        ignorePatterns: ['node_modules/', '*.min.js'],
        scanExtensions: ['.ts', '.js'],
        scanDirectories: ['src', 'lib'],
        maxAge: {
          temp: 7,
          hack: 14,
        },
      };

      expect(() => validateConfig(config)).not.toThrow();
    });

    it('should throw on invalid anchor format', () => {
      const config = { anchor: 'invalid' };
      expect(() => validateConfig(config)).toThrow('Invalid anchor format');
    });

    it('should throw on non-array defaultTokens', () => {
      const config = { defaultTokens: 'not-an-array' };
      expect(() => validateConfig(config)).toThrow('defaultTokens must be an array');
    });

    it('should throw on non-object tokenDictionary', () => {
      const config = { tokenDictionary: 'not-an-object' };
      expect(() => validateConfig(config)).toThrow('tokenDictionary must be an object');
    });

    it('should allow empty config', () => {
      expect(() => validateConfig({})).not.toThrow();
    });
  });

  describe('mergeConfigs', () => {
    it('should merge configs with defaults', () => {
      const defaults = {
        anchor: ':ga:',
        defaultTokens: ['tldr', 'todo'],
        tokenDictionary: {
          tldr: 'Brief summary',
          todo: 'Task to complete',
        },
      };

      const custom = {
        defaultTokens: ['tldr', 'fix'],
        tokenDictionary: {
          fix: 'Bug fix',
          tldr: 'One-line summary', // Override
        },
        forbiddenTokens: ['hack'],
      };

      const result = mergeConfigs(defaults, custom);

      expect(result).toEqual({
        anchor: ':ga:',
        defaultTokens: ['tldr', 'fix'],
        tokenDictionary: {
          tldr: 'One-line summary',
          todo: 'Task to complete',
          fix: 'Bug fix',
        },
        forbiddenTokens: ['hack'],
      });
    });

    it('should handle undefined configs', () => {
      const base = { anchor: ':ga:' };
      expect(mergeConfigs(base, undefined)).toEqual(base);
      expect(mergeConfigs(undefined, base)).toEqual(base);
      expect(mergeConfigs(undefined, undefined)).toEqual({});
    });

    it('should deep merge nested objects', () => {
      const base = {
        maxAge: { temp: 7, hack: 14 },
      };
      const custom = {
        maxAge: { temp: 3, todo: 30 },
      };

      const result = mergeConfigs(base, custom);
      expect(result.maxAge).toEqual({
        temp: 3,
        hack: 14,
        todo: 30,
      });
    });
  });

  describe('loadConfig', () => {
    it('should load config from file', async () => {
      const mockConfig = {
        anchor: ':ga:',
        defaultTokens: ['tldr', 'todo'],
      };

      vi.mocked(fs.access).mockResolvedValueOnce(undefined);
      vi.mocked(fs.readFile).mockResolvedValueOnce(
        `anchor: ':ga:'\ndefaultTokens:\n  - tldr\n  - todo`
      );

      const config = await loadConfig('/test/dir');

      expect(fs.access).toHaveBeenCalledWith('/test/dir/.grepa.yml');
      expect(fs.readFile).toHaveBeenCalledWith('/test/dir/.grepa.yml', 'utf-8');
      expect(config).toMatchObject(mockConfig);
    });

    it('should traverse up directories to find config', async () => {
      const error = new Error('Not found');
      (error as any).code = 'ENOENT';
      
      vi.mocked(fs.access)
        .mockRejectedValueOnce(error) // /test/deep/dir
        .mockRejectedValueOnce(error) // /test/deep
        .mockResolvedValueOnce(undefined); // /test

      vi.mocked(fs.readFile).mockResolvedValueOnce(`anchor: ':ga:'`);

      const config = await loadConfig('/test/deep/dir');

      expect(fs.access).toHaveBeenCalledTimes(3);
      expect(fs.access).toHaveBeenNthCalledWith(1, '/test/deep/dir/.grepa.yml');
      expect(fs.access).toHaveBeenNthCalledWith(2, '/test/deep/.grepa.yml');
      expect(fs.access).toHaveBeenNthCalledWith(3, '/test/.grepa.yml');
    });

    it('should use environment variable for anchor', async () => {
      process.env.GREPA_ANCHOR = ':custom:';
      
      const error = new Error('Not found');
      (error as any).code = 'ENOENT';
      vi.mocked(fs.access).mockRejectedValue(error);

      const config = await loadConfig('/test');

      expect(config.anchor).toBe(':custom:');
    });

    it('should handle YAML parse errors', async () => {
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);
      vi.mocked(fs.readFile).mockResolvedValueOnce('invalid: yaml: content:');

      await expect(loadConfig('/test')).rejects.toThrow();
    });

    it('should handle file read errors', async () => {
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);
      const error = new Error('Permission denied');
      (error as any).code = 'EACCES';
      vi.mocked(fs.readFile).mockRejectedValueOnce(error);

      await expect(loadConfig('/test')).rejects.toThrow('Permission denied');
    });

    it('should return default config when no file found', async () => {
      const error = new Error('Not found');
      (error as any).code = 'ENOENT';
      vi.mocked(fs.access).mockRejectedValue(error);

      const config = await loadConfig('/');

      expect(config).toMatchObject({
        anchor: ':ga:',
        defaultTokens: expect.any(Array),
        tokenDictionary: expect.any(Object),
      });
    });

    it('should stop at root directory', async () => {
      const error = new Error('Not found');
      (error as any).code = 'ENOENT';
      vi.mocked(fs.access).mockRejectedValue(error);
      vi.mocked(path.dirname).mockImplementation((p) => {
        if (p === '/test') return '/';
        return p.substring(0, p.lastIndexOf('/'));
      });

      const config = await loadConfig('/test');

      // Should check /test, /, and /.grepa.yml then stop
      expect(fs.access).toHaveBeenCalledTimes(3);
    });
  });
});