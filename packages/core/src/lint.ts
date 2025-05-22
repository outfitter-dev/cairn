// :ga:tldr Lint anchors according to configured rules
// :ga:cmd:lint Core linting engine

import type { Anchor, Config, LintResult, LintViolation } from './types';

// :ga:tldr Run all lint rules on anchors
// :ga:api,cmd:lint Main lint function
export function lintAnchors(
  anchors: Anchor[],
  config: Config
): LintResult {
  const violations: LintViolation[] = [];
  
  for (const anchor of anchors) {
    // :ga:algo Check forbidden tokens
    violations.push(...checkForbiddenTokens(anchor, config));
    
    // :ga:algo Check age constraints
    violations.push(...checkAgeConstraints(anchor, config));
    
    // :ga:algo Validate token format
    violations.push(...validateTokenFormat(anchor));
  }
  
  return {
    passed: violations.length === 0,
    violations
  };
}

// :ga:tldr Check for forbidden tokens
// :ga:sec Policy enforcement
function checkForbiddenTokens(
  anchor: Anchor,
  config: Config
): LintViolation[] {
  const violations: LintViolation[] = [];
  const forbidden = config.lint?.forbid || [];
  
  for (const token of anchor.tokens) {
    if (token.type === 'bare' && forbidden.includes(token.value)) {
      violations.push({
        type: 'forbidden',
        anchor,
        message: `Forbidden token '${token.value}' found`
      });
    }
  }
  
  return violations;
}

// :ga:tldr Check version age constraints
// :ga:algo Version comparison
function checkAgeConstraints(
  anchor: Anchor,
  config: Config
): LintViolation[] {
  const violations: LintViolation[] = [];
  const maxAgeDays = config.lint?.maxAgeDays;
  const versionField = config.lint?.versionField || 'since';
  
  if (!maxAgeDays) return violations;
  
  // :ga:algo Look for version in tokens
  for (const token of anchor.tokens) {
    if (token.type === 'json' && versionField in token.value) {
      const version = token.value[versionField];
      if (typeof version === 'string') {
        // :ga:algo Parse date from version
        const date = parseVersionDate(version);
        if (date) {
          const ageInDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
          if (ageInDays > maxAgeDays) {
            violations.push({
              type: 'outdated',
              anchor,
              message: `Anchor is ${Math.floor(ageInDays)} days old (max: ${maxAgeDays})`
            });
          }
        }
      }
    }
  }
  
  return violations;
}

// :ga:tldr Validate token format
// :ga:parse Token validation
function validateTokenFormat(anchor: Anchor): LintViolation[] {
  const violations: LintViolation[] = [];
  
  if (anchor.tokens.length === 0) {
    violations.push({
      type: 'invalid',
      anchor,
      message: 'Anchor has no valid tokens'
    });
  }
  
  return violations;
}

// :ga:tldr Parse date from version string
// :ga:algo Date parsing
function parseVersionDate(version: string): Date | null {
  // :ga:algo Try ISO date format
  const isoDate = new Date(version);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }
  
  // :ga:algo Try v1.2.3 format with date suffix
  const versionMatch = version.match(/v\d+\.\d+\.\d+\s*\((\d{4}-\d{2}-\d{2})\)/);
  if (versionMatch && versionMatch[1]) {
    return new Date(versionMatch[1]);
  }
  
  return null;
}