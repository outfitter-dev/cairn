// :ga:tldr Token extraction, validation, and normalization utilities

/**
 * :ga:tldr Validates if a token string is valid according to grepa rules
 * @param token - The token to validate
 * @returns true if valid, false otherwise
 */
export function validateToken(token: string): boolean {
  // Must start with a letter, only contain letters and numbers, max 50 chars
  return /^[a-zA-Z][a-zA-Z0-9]{0,49}$/.test(token);
}

/**
 * :ga:tldr Normalizes a token to lowercase and trims whitespace
 * @param token - The token to normalize
 * @returns The normalized token
 */
export function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

/**
 * :ga:tldr Extracts and validates tokens from an anchor string
 * @param anchor - The anchor string (e.g., ':ga:tldr', ':ga:[fix,sec]')
 * @returns Array of valid, normalized tokens
 */
export function extractTokens(anchor: string): string[] {
  const tokens: string[] = [];
  
  // Remove :ga: prefix
  const content = anchor.replace(/^:ga:/, '').trim();
  
  if (!content) {
    return [];
  }
  
  // Handle array syntax: [token1,token2,...]
  if (content.startsWith('[') && content.endsWith(']')) {
    const arrayContent = content.slice(1, -1);
    const parts = arrayContent.split(',');
    
    for (const part of parts) {
      const normalized = normalizeToken(part);
      if (normalized && validateToken(normalized)) {
        tokens.push(normalized);
      }
    }
  }
  // Handle JSON syntax: {"token":"value",...}
  else if (content.startsWith('{') && content.endsWith('}')) {
    try {
      const json = JSON.parse(content);
      if (json.token && typeof json.token === 'string') {
        const normalized = normalizeToken(json.token);
        if (validateToken(normalized)) {
          tokens.push(normalized);
        }
      }
    } catch {
      // Invalid JSON, return empty
      return [];
    }
  }
  // Handle single token
  else {
    const normalized = normalizeToken(content);
    if (validateToken(normalized)) {
      tokens.push(normalized);
    }
  }
  
  // Remove duplicates
  return [...new Set(tokens)];
}