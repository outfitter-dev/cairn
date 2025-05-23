// :ga:tldr Unit tests for grepa token extraction and normalization
import { describe, it, expect } from 'vitest';
import { extractTokens, normalizeToken, validateToken } from './tokenizer';

describe('tokenizer', () => {
  describe('validateToken', () => {
    it('should validate correct tokens', () => {
      const validTokens = [
        'tldr',
        'todo',
        'fix',
        'api',
        'p0',
        'p1',
        'cursor',
        'TODO',
        'ToDo',
      ];

      validTokens.forEach(token => {
        expect(validateToken(token)).toBe(true);
      });
    });

    it('should reject invalid tokens', () => {
      const invalidTokens = [
        '',
        ' ',
        '123',
        '1abc',
        'ab-cd',
        'ab_cd',
        'ab cd',
        'ab@cd',
        '#tag',
        ':ga:',
        'a'.repeat(51), // Too long
      ];

      invalidTokens.forEach(token => {
        expect(validateToken(token)).toBe(false);
      });
    });

    it('should accept tokens up to 50 characters', () => {
      expect(validateToken('a'.repeat(50))).toBe(true);
      expect(validateToken('a'.repeat(51))).toBe(false);
    });
  });

  describe('normalizeToken', () => {
    it('should convert tokens to lowercase', () => {
      expect(normalizeToken('TLDR')).toBe('tldr');
      expect(normalizeToken('ToDo')).toBe('todo');
      expect(normalizeToken('API')).toBe('api');
    });

    it('should trim whitespace', () => {
      expect(normalizeToken('  tldr  ')).toBe('tldr');
      expect(normalizeToken('\ttodo\n')).toBe('todo');
    });

    it('should handle empty input', () => {
      expect(normalizeToken('')).toBe('');
      expect(normalizeToken('   ')).toBe('');
    });
  });

  describe('extractTokens', () => {
    it('should extract single token', () => {
      expect(extractTokens(':ga:tldr')).toEqual(['tldr']);
      expect(extractTokens(':ga:TODO')).toEqual(['todo']);
    });

    it('should extract array of tokens', () => {
      expect(extractTokens(':ga:[fix,sec,p0]')).toEqual(['fix', 'sec', 'p0']);
      expect(extractTokens(':ga:[  tldr  ,  todo  ]')).toEqual(['tldr', 'todo']);
    });

    it('should extract token from JSON payload', () => {
      const payloads = [
        ':ga:{"token":"api"}',
        ':ga:{"token":"api","version":"2.0"}',
        ':ga:{"data":"test","token":"config"}',
      ];

      expect(extractTokens(payloads[0])).toEqual(['api']);
      expect(extractTokens(payloads[1])).toEqual(['api']);
      expect(extractTokens(payloads[2])).toEqual(['config']);
    });

    it('should handle invalid JSON gracefully', () => {
      expect(extractTokens(':ga:{"invalid"}')).toEqual([]);
      expect(extractTokens(':ga:{not json}')).toEqual([]);
    });

    it('should filter invalid tokens from arrays', () => {
      expect(extractTokens(':ga:[valid,123,also-valid]')).toEqual(['valid']);
      expect(extractTokens(':ga:[,,,valid,,,]')).toEqual(['valid']);
    });

    it('should handle empty arrays', () => {
      expect(extractTokens(':ga:[]')).toEqual([]);
      expect(extractTokens(':ga:[,,,]')).toEqual([]);
    });

    it('should handle malformed anchors', () => {
      expect(extractTokens(':ga:')).toEqual([]);
      expect(extractTokens(':ga: ')).toEqual([]);
      expect(extractTokens(':ga:{}')).toEqual([]);
    });

    it('should normalize all extracted tokens', () => {
      expect(extractTokens(':ga:[TLDR,TODO,FIX]')).toEqual(['tldr', 'todo', 'fix']);
      expect(extractTokens(':ga:UPPERCASE')).toEqual(['uppercase']);
    });

    it('should remove duplicate tokens', () => {
      expect(extractTokens(':ga:[tldr,todo,tldr,todo]')).toEqual(['tldr', 'todo']);
      expect(extractTokens(':ga:[TLDR,tldr,TlDr]')).toEqual(['tldr']);
    });

    it('should handle complex mixed cases', () => {
      const testCases = [
        { input: ':ga:[api,123,test]', expected: ['api', 'test'] }, // 123 invalid
        { input: ':ga:[  , valid ,  ]', expected: ['valid'] },
        { input: ':ga:{"token":"TEST","other":"data"}', expected: ['test'] },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(extractTokens(input)).toEqual(expected);
      });
    });
  });
});