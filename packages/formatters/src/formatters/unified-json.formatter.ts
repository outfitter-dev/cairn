// tldr ::: Unified JSON formatter for all output types
import type { IFormatter, FormatterInput } from '../interfaces/unified-formatter.interface.js';

export class JsonFormatter implements IFormatter {
  // notice ::: track visited objects to detect circular references without mutation #security
  private visited = new WeakSet<any>();

  // ::: api format any input as JSON with improved security and type safety
  format(input: FormatterInput): string {
    // Reset visited set for each format call
    this.visited = new WeakSet<any>();
    
    try {
      // notice ::: handle all known types consistently and securely #security
      if (input.type === 'search' || input.type === 'list' || 
          input.type === 'parse' || input.type === 'contexts') {
        return JSON.stringify(input.data, this.jsonReplacer, 2);
      }
      
      // notice ::: for unknown types, only serialize safe data to avoid exposing internal structure #security
      return JSON.stringify({ 
        type: 'unknown', 
        data: null 
      }, this.jsonReplacer, 2);
    } catch (error) {
      // ::: ctx fallback for circular references or other JSON issues
      return JSON.stringify({
        error: 'Failed to serialize data',
        type: input.type,
        message: error instanceof Error ? error.message : 'Unknown error'
      }, null, 2);
    }
  }

  // notice ::: JSON replacer to sanitize sensitive data - arrow function to maintain 'this' context #security
  private jsonReplacer = (key: string, value: any): any => {
    // notice ::: enhanced sensitive field detection with case-insensitive substring matching #security
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credential', 'apikey', 'accesstoken'];
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      return '[REDACTED]';
    }
    
    // notice ::: handle circular references without mutating original objects #security
    if (typeof value === 'object' && value !== null) {
      if (this.visited.has(value)) {
        return '[Circular]';
      }
      this.visited.add(value);
    }
    
    return value;
  };
}