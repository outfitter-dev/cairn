// :A: tldr Unified JSON formatter for all output types
import type { IFormatter, FormatterInput } from '../interfaces/unified-formatter.interface.js';

export class JsonFormatter implements IFormatter {
  // :A: api format any input as JSON with improved security and type safety
  format(input: FormatterInput): string {
    try {
      // :A: sec handle all known types consistently and securely
      if (input.type === 'search' || input.type === 'list' || 
          input.type === 'parse' || input.type === 'markers') {
        return JSON.stringify(input.data, this.jsonReplacer, 2);
      }
      
      // :A: sec for unknown types, only serialize safe data to avoid exposing internal structure
      return JSON.stringify({ 
        type: 'unknown', 
        data: null 
      }, this.jsonReplacer, 2);
    } catch (error) {
      // :A: ctx fallback for circular references or other JSON issues
      return JSON.stringify({
        error: 'Failed to serialize data',
        type: input.type,
        message: error instanceof Error ? error.message : 'Unknown error'
      }, null, 2);
    }
  }

  // :A: sec JSON replacer to sanitize sensitive data
  private jsonReplacer(key: string, value: any): any {
    // :A: sec remove potentially sensitive fields
    if (key === 'password' || key === 'token' || key === 'secret' || key === 'key') {
      return '[REDACTED]';
    }
    
    // :A: sec handle circular references
    if (typeof value === 'object' && value !== null) {
      if (value.__seen) {
        return '[Circular]';
      }
      value.__seen = true;
    }
    
    return value;
  }
}