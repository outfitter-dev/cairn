// :ga:tldr Anchor part extraction, validation, and normalization utilities

/**
 * :ga:tldr Validates if an anchor part string is valid according to grepa rules
 * @param part - The anchor part to validate
 * @returns true if valid, false otherwise
 */
export function validateAnchorPart(part: string): boolean {
  // Must start with a letter, only contain letters and numbers, max 50 chars
  return /^[a-zA-Z][a-zA-Z0-9]{0,49}$/.test(part);
}

/**
 * :ga:tldr Normalizes an anchor part to lowercase and trims whitespace
 * @param part - The anchor part to normalize
 * @returns The normalized anchor part
 */
export function normalizeAnchorPart(part: string): string {
  return part.trim().toLowerCase();
}

/**
 * :ga:tldr Extracts and validates anchor parts from an anchor string
 * @param anchor - The anchor string (e.g., ':ga:tldr', ':ga:[fix,sec]')
 * @returns Array of valid, normalized anchor parts
 */
export function extractAnchorParts(anchor: string): string[] {
  const parts: string[] = [];
  
  // Remove :ga: prefix
  const content = anchor.replace(/^:ga:/, '').trim();
  
  if (!content) {
    return [];
  }
  
  // Handle array syntax: [part1,part2,...]
  if (content.startsWith('[') && content.endsWith(']')) {
    const arrayContent = content.slice(1, -1);
    const segments = arrayContent.split(',');
    
    for (const segment of segments) {
      const normalized = normalizeAnchorPart(segment);
      if (normalized && validateAnchorPart(normalized)) {
        parts.push(normalized);
      }
    }
  }
  // Handle JSON syntax: {"token":"value",...}
  else if (content.startsWith('{') && content.endsWith('}')) {
    try {
      const json = JSON.parse(content);
      if (json.token && typeof json.token === 'string') {
        const normalized = normalizeAnchorPart(json.token);
        if (validateAnchorPart(normalized)) {
          parts.push(normalized);
        }
      }
    } catch {
      // Invalid JSON, return empty
      return [];
    }
  }
  // Handle single part
  else {
    const normalized = normalizeAnchorPart(content);
    if (validateAnchorPart(normalized)) {
      parts.push(normalized);
    }
  }
  
  // Remove duplicates
  return [...new Set(parts)];
}

// Backwards compatibility exports (deprecated)
/** @deprecated Use validateAnchorPart instead */
export const validateToken = validateAnchorPart;

/** @deprecated Use normalizeAnchorPart instead */
export const normalizeToken = normalizeAnchorPart;

/** @deprecated Use extractAnchorParts instead */
export const extractTokens = extractAnchorParts;