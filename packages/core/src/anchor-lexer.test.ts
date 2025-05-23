// :ga:tldr Unit tests for grepa anchor part extraction and normalization
import { describe, it, expect } from 'vitest';
import { extractAnchorParts, normalizeAnchorPart, validateAnchorPart } from './anchor-lexer';

describe('anchor-lexer', () => {
  describe('validateAnchorPart', () => {
    it('should validate correct anchor parts', () => {
      const validParts = [
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

      validParts.forEach(part => {
        expect(validateAnchorPart(part)).toBe(true);
      });
    });

    it('should reject invalid anchor parts', () => {
      const invalidParts = [
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

      invalidParts.forEach(part => {
        expect(validateAnchorPart(part)).toBe(false);
      });
    });

    it('should accept anchor parts up to 50 characters', () => {
      expect(validateAnchorPart('a'.repeat(50))).toBe(true);
      expect(validateAnchorPart('a'.repeat(51))).toBe(false);
    });
  });

  describe('normalizeAnchorPart', () => {
    it('should convert anchor parts to lowercase', () => {
      expect(normalizeAnchorPart('TLDR')).toBe('tldr');
      expect(normalizeAnchorPart('ToDo')).toBe('todo');
      expect(normalizeAnchorPart('API')).toBe('api');
    });

    it('should trim whitespace', () => {
      expect(normalizeAnchorPart('  tldr  ')).toBe('tldr');
      expect(normalizeAnchorPart('\ttodo\n')).toBe('todo');
    });

    it('should handle empty input', () => {
      expect(normalizeAnchorPart('')).toBe('');
      expect(normalizeAnchorPart('   ')).toBe('');
    });
  });

  describe('extractAnchorParts', () => {
    it('should extract single anchor part', () => {
      expect(extractAnchorParts(':ga:tldr')).toEqual(['tldr']);
      expect(extractAnchorParts(':ga:TODO')).toEqual(['todo']);
    });

    it('should extract array of anchor parts', () => {
      expect(extractAnchorParts(':ga:[fix,sec,p0]')).toEqual(['fix', 'sec', 'p0']);
      expect(extractAnchorParts(':ga:[  tldr  ,  todo  ]')).toEqual(['tldr', 'todo']);
    });

    it('should extract anchor part from JSON payload', () => {
      const payloads = [
        ':ga:{"token":"api"}',
        ':ga:{"token":"api","version":"2.0"}',
        ':ga:{"data":"test","token":"config"}',
      ];

      expect(extractAnchorParts(payloads[0])).toEqual(['api']);
      expect(extractAnchorParts(payloads[1])).toEqual(['api']);
      expect(extractAnchorParts(payloads[2])).toEqual(['config']);
    });

    it('should handle invalid JSON gracefully', () => {
      expect(extractAnchorParts(':ga:{"invalid"}')).toEqual([]);
      expect(extractAnchorParts(':ga:{not json}')).toEqual([]);
    });

    it('should filter invalid anchor parts from arrays', () => {
      expect(extractAnchorParts(':ga:[valid,123,also-valid]')).toEqual(['valid']);
      expect(extractAnchorParts(':ga:[,,,valid,,,]')).toEqual(['valid']);
    });

    it('should handle empty arrays', () => {
      expect(extractAnchorParts(':ga:[]')).toEqual([]);
      expect(extractAnchorParts(':ga:[,,,]')).toEqual([]);
    });

    it('should handle malformed anchors', () => {
      expect(extractAnchorParts(':ga:')).toEqual([]);
      expect(extractAnchorParts(':ga: ')).toEqual([]);
      expect(extractAnchorParts(':ga:{}')).toEqual([]);
    });

    it('should normalize all extracted anchor parts', () => {
      expect(extractAnchorParts(':ga:[TLDR,TODO,FIX]')).toEqual(['tldr', 'todo', 'fix']);
      expect(extractAnchorParts(':ga:UPPERCASE')).toEqual(['uppercase']);
    });

    it('should remove duplicate anchor parts', () => {
      expect(extractAnchorParts(':ga:[tldr,todo,tldr,todo]')).toEqual(['tldr', 'todo']);
      expect(extractAnchorParts(':ga:[TLDR,tldr,TlDr]')).toEqual(['tldr']);
    });

    it('should handle complex mixed cases', () => {
      const testCases = [
        { input: ':ga:[api,123,test]', expected: ['api', 'test'] }, // 123 invalid
        { input: ':ga:[  , valid ,  ]', expected: ['valid'] },
        { input: ':ga:{"token":"TEST","other":"data"}', expected: ['test'] },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(extractAnchorParts(input)).toEqual(expected);
      });
    });
  });
});