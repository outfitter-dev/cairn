// :M: tldr Type guards and assertion functions
import type { MagicAnchor, ParseError } from '@cairn/types';

// :M: api Basic type guards
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isNonNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

// :M: api Object property existence guard
export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return obj != null && typeof obj === 'object' && key in obj;
}

// :M: api Magic Anchor type guard
export function isMagicAnchor(value: unknown): value is MagicAnchor {
  return (
    typeof value === 'object' &&
    value !== null &&
    'line' in value &&
    'column' in value &&
    'raw' in value &&
    'contexts' in value &&
    typeof (value as MagicAnchor).line === 'number' &&
    typeof (value as MagicAnchor).column === 'number' &&
    typeof (value as MagicAnchor).raw === 'string' &&
    Array.isArray((value as MagicAnchor).contexts)
  );
}

// :M: api Parse error type guard
export function isParseError(value: unknown): value is ParseError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'line' in value &&
    'column' in value &&
    'message' in value &&
    'raw' in value &&
    typeof (value as ParseError).line === 'number' &&
    typeof (value as ParseError).column === 'number' &&
    typeof (value as ParseError).message === 'string' &&
    typeof (value as ParseError).raw === 'string'
  );
}

// :M: api Assertion functions
export function assert(condition: unknown, message?: string | (() => string)): asserts condition {
  if (!condition) {
    throw new Error(typeof message === 'function' ? message() : message ?? 'Assertion failed');
  }
}

export function assertNonNull<T>(
  value: T | null | undefined,
  message?: string | (() => string)
): asserts value is T {
  assert(value != null, message ?? `Value should be non-null, but received ${String(value)}`);
}

// :M: api Exhaustive check for switch statements
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${JSON.stringify(value)}`);
}