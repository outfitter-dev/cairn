// :ga:tldr Parse grep-anchors from text content
import type { ParseOptions } from './types';

interface SimpleAnchor {
  token: string;
  line: number;
  file: string;
  raw: string;
  comment?: string;
  payload?: string;
}

// :ga:tldr Parse anchors from text content  
export function parseAnchors(
  content: string,
  filePath: string,
  options: ParseOptions = { includeComment: true }
): SimpleAnchor[] {
  const anchors: SimpleAnchor[] = [];
  const lines = content.split('\n');
  
  // Match any :ga: pattern
  const regex = /:ga:([^\s\n]*)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const raw = match[0];
    const payload = match[1] || '';
    
    // Find line number
    const position = match.index;
    const lineNumber = content.substring(0, position).split('\n').length;
    
    // Extract tokens from payload
    const tokens = extractTokensFromPayload(payload);
    
    // Get comment if requested
    let comment: string | undefined;
    if (options.includeComment !== false && lineNumber > 0 && lineNumber <= lines.length) {
      const line = lines[lineNumber - 1];
      if (line) {
        const anchorEnd = line.indexOf(raw) + raw.length;
        const commentText = line.substring(anchorEnd).trim();
        comment = commentText || undefined;
      }
    }
    
    // Add an anchor for each token
    for (const token of tokens) {
      anchors.push({
        token,
        line: lineNumber,
        file: filePath,
        raw,
        ...(comment !== undefined && { comment }),
        ...(payload.startsWith('{') && { payload })
      });
    }
  }
  
  return anchors;
}

// :ga:tldr Extract tokens from anchor payload
function extractTokensFromPayload(payload: string): string[] {
  if (!payload) return [];
  
  // Handle array syntax [token1,token2]
  if (payload.startsWith('[') && payload.endsWith(']')) {
    const inner = payload.slice(1, -1);
    return inner.split(',')
      .map(t => t.trim())
      .filter(t => t && /^[a-zA-Z][a-zA-Z0-9]*$/.test(t));
  }
  
  // Handle JSON syntax {"token":"value"}
  if (payload.startsWith('{') && payload.endsWith('}')) {
    try {
      const json = JSON.parse(payload);
      if (json.token && typeof json.token === 'string') {
        return [json.token];
      }
    } catch {
      // Invalid JSON
    }
    return [];
  }
  
  // Handle single token
  if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(payload)) {
    return [payload.toLowerCase()];
  }
  
  return [];
}