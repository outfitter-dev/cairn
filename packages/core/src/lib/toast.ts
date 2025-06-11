// :M: tldr Toast wrapper utilities for future UI integration
import type { Result } from './result.js';
import type { AppError, ErrorCode } from './error.js';

// :M: api Mock toast interface (replace with actual library when UI is added)
interface Toast {
  success(title: string, options?: { description?: string; duration?: number; id?: string }): void;
  error(title: string, options?: { description?: string; duration?: number; id?: string }): void;
  loading(message: string): string;
}

// :M: ctx Mock implementation for development
const mockToast: Toast = {
  success: (title, options) => console.log(`✅ ${title}`, options?.description || ''),
  error: (title, options) => console.error(`❌ ${title}`, options?.description || ''),
  loading: (message) => {
    console.log(`⏳ ${message}`);
    return Math.random().toString(36);
  },
};

// :M: api Use this when adding a real toast library
// import { toast } from 'sonner';
const toast = mockToast;

type ToastOptions = {
  loading?: string;
  duration?: number;
};

// :M: api Human-readable error messages
export function humanise(err: AppError): string {
  const messages: Record<ErrorCode, string> = {
    // Parse errors
    'parse.invalidSyntax': 'Invalid Cairn syntax found',
    'parse.missingSpace': 'Missing required space after :M: context',
    'parse.emptyPayload': 'Cairn payload cannot be empty',
    'parse.invalidContext': 'Invalid context format',
    'parse.tooManyContexts': 'Too many contexts on a single line',
    'file.notFound': 'The requested file could not be found',
    'file.readError': 'Unable to read the file',
    'file.accessDenied': "You don't have permission to access this file",
    'file.tooLarge': 'File size exceeds the maximum allowed limit',
    'file.invalidPath': 'The file path is invalid',
    'file.unsupportedType': 'This file type is not supported',
    
    // Search errors
    'search.noResults': 'No results found matching your search criteria',
    'search.invalidPattern': 'Invalid search pattern provided',
    'search.tooManyResults': 'Too many results found. Please refine your search',
    
    // CLI errors
    'cli.invalidCommand': 'Invalid command. Run with --help for usage',
    'cli.missingArgument': 'Required argument is missing',
    'cli.invalidOption': 'Invalid option provided',
    
    // Security errors
    'security.rateLimitExceeded': 'Rate limit exceeded. Please try again later',
    'security.maliciousContent': 'Malicious content detected',
    'security.contentTooLarge': 'Content too large for security processing',
    
    // Validation errors
    'validation': `Invalid input: ${err.message}`,
    'validation.schema': 'Input does not match expected format',
    'validation.type': 'Invalid data type provided',
    
    // System errors
    'system.outOfMemory': 'Out of memory. Try processing fewer files',
    'system.timeout': 'Operation timed out. Please try again',
    'network': 'Network error occurred. Please check your connection',
    'unexpected': 'An unexpected error occurred. Please try again',
  };

  const message = messages[err.code];
  
  // :M: ctx log unmapped error codes for debugging
  if (!message && err.code) {
    console.warn(`Unmapped error code: ${err.code}`, { error: err });
  }

  return message ?? err.message ?? 'An unknown error occurred';
}

// :M: api Display toast based on Result status
export function showResultToast<T>(
  title: string,
  res: Result<T, AppError>,
  options?: Pick<ToastOptions, 'duration'> & { showSuccess?: boolean }
): res is { ok: true; data: T } {
  if (res.ok) {
    if (options?.showSuccess) {
      toast.success(title, {
        description: 'Operation completed successfully',
        ...(options?.duration !== undefined ? { duration: options.duration } : {}),
      });
    }
  } else {
    toast.error(title, {
      description: humanise(res.error),
      ...(options?.duration !== undefined ? { duration: options.duration } : {}),
    });
  }
  return res.ok;
}

// :M: api Wrap async operation with loading/success/error toasts
export async function withToast<T>(
  promise: Promise<Result<T, AppError>>,
  messages: {
    loading: string;
    success: string;
    error?: string;
  },
  toastOptions?: Pick<ToastOptions, 'duration'>
): Promise<Result<T, AppError>> {
  const id = toast.loading(messages.loading);
  const result = await promise;

  if (result.ok) {
    toast.success(messages.success, { 
      id, 
      ...(toastOptions?.duration !== undefined ? { duration: toastOptions.duration } : {}) 
    });
  } else {
    toast.error(messages.error ?? 'Operation failed', {
      id,
      description: humanise(result.error),
      ...(toastOptions?.duration !== undefined ? { duration: toastOptions.duration } : {}),
    });
  }

  return result;
}