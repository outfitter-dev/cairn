// :A: tldr Test utilities for Result pattern assertions
import { expect } from 'vitest';
import type { Result, AppError } from '../lib/result.js';
import type { ErrorCode } from '../lib/error.js';

// :A: api Result pattern test helpers
export function expectSuccess<T>(result: Result<T, AppError>): asserts result is { ok: true; data: T } {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`Expected success but got error: ${result.error.code} - ${result.error.message}`);
  }
}

export function expectFailure<T>(result: Result<T, AppError>): asserts result is { ok: false; error: AppError } {
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error('Expected failure but got success');
  }
}

export function expectErrorCode<T>(result: Result<T, AppError>, expectedCode: ErrorCode): void {
  expectFailure(result);
  expect(result.error.code).toBe(expectedCode);
}

export function expectErrorMessage<T>(result: Result<T, AppError>, expectedMessage: string): void {
  expectFailure(result);
  expect(result.error.message).toBe(expectedMessage);
}

// :A: api Type guard test helpers
export function expectType<T>(value: unknown, guard: (val: unknown) => val is T): asserts value is T {
  expect(guard(value)).toBe(true);
}

export function expectNotType<T>(value: unknown, guard: (val: unknown) => val is T): void {
  expect(guard(value)).toBe(false);
}

// :A: api Array assertion helpers  
export function expectArrayLength<T>(array: readonly T[], expectedLength: number): void {
  expect(array).toHaveLength(expectedLength);
}

export function expectArrayContains<T>(array: readonly T[], item: T): void {
  expect(array).toContain(item);
}

// :A: api Magic Anchor test helpers
export function createMockAnchor(overrides: Partial<{
  line: number;
  column: number;
  raw: string;
  markers: readonly string[];
  prose?: string;
  file?: string;
}> = {}): {
  readonly line: number;
  readonly column: number;
  readonly raw: string;
  readonly markers: readonly string[];
  readonly prose?: string;
  readonly file?: string;
} {
  return {
    line: 1,
    column: 5,
    raw: '// :A: todo implement',
    markers: ['todo'] as const,
    prose: 'implement',
    ...overrides,
  };
}