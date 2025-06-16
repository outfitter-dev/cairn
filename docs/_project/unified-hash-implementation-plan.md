<!-- tldr ::: implementation plan for unified hash syntax migration -->
# Unified Hash Syntax Implementation Plan

Implementation plan for migrating waymark to unified `#` syntax as defined in the [unified hash syntax proposal](./proposals/unified-hash-syntax.md).

## Overview

This plan outlines the concrete steps to implement the unified hash syntax change across the waymark codebase. The implementation follows a documentation-first approach, then updates core parsing logic, and finally provides migration tools.

## Phase 1: Documentation Updates

### Priority 1: Core Specification Files

**Files to Update:**
- [ ] `docs/syntax/SPEC.md` - Update with unified hash syntax rules
- [ ] `docs/syntax/syntax-full.md` - Update examples and terminology
- [ ] `docs/README.md` - Update quick examples
- [ ] `README.md` - Update project examples

**Changes Required:**
1. **Terminology Updates:**
   - `sigil` → `waymark sign` (referring to `:::`)
   - `marker` → `waymark type` (when referring to todo, fix, etc.)

2. **Core Waymark Types Update:**
   - Update to final list: `tldr`, `todo`, `fix`, `refactor`, `note`, `alert`, `temp`, `idea`, `about`, `example`, `ci`, `always`
   - Remove `deprecated` from core types (replaced with `temp`)

3. **Grammar Updates:**
   - Update EBNF to show unified `#` syntax
   - Add validation rules for `#` prefix requirements
   - Update examples to use `#` consistently

4. **New Validation Rules:**
   ```jsonc
   // Add to SPEC.md
   {
     "validation": {
       "reference_hash_required": "error",
       "ambiguous_values": "error",
       "tag_prefix_required": "error"
     }
   }
   ```

### Priority 2: Supporting Documentation

**Files to Update:**
- [ ] `docs/tooling/cli/README.md` - Update command examples
- [ ] `package.json` - Update description if needed
- [ ] Any tutorial/guide files

**Expected Changes per File:**
- 10-20 terminology replacements per file
- 5-10 syntax example updates per file
- New validation rule examples

## Phase 2: Core Parser Updates

### Parser Logic (`packages/core/src/parser/`)

**Files to Modify:**
- [ ] `waymark-parser.ts` - Core parsing logic
- [ ] `schemas/index.ts` - Validation schemas
- [ ] `__tests__/parser.test.ts` - Parser tests

**Implementation Changes:**

1. **Extend Tag Recognition:**
   ```typescript
   // Current: recognizes +tag
   // New: recognize both +tag and #tag, prefer #tag
   
   interface TagPattern {
     prefix: '+' | '#';
     value: string;
     deprecated?: boolean; // mark +prefix as deprecated
   }
   ```

2. **Add Hash Validation:**
   ```typescript
   // New validation rules
   const HASH_REQUIRED_PATTERNS = [
     /:\d+(?!\w)/,           // :123 (issue references)
     /:[A-Z]+-\d+(?!\w)/,    // :PROJ-456 (ticket references)
   ];
   
   const AMBIGUOUS_VALUES = [
     'high', 'medium', 'low', 'critical', 'major', 'minor'
   ];
   ```

3. **Auto-fix Capability:**
   ```typescript
   interface AutoFix {
     original: string;
     fixed: string;
     confidence: number;
   }
   
   function generateAutoFixes(waymark: string): AutoFix[] {
     // Convert priority:high → #priority:high
     // Convert fixes:123 → #fixes:#123
     // Convert +backend → #backend
   }
   ```

### Search Logic (`packages/core/src/search/`)

**Files to Modify:**
- [ ] `waymark-search.ts` - Search pattern updates
- [ ] `__tests__/search.test.ts` - Search tests

**Implementation Changes:**

1. **Backwards Compatible Search:**
   ```typescript
   // Support both old and new syntax during transition
   const UNIVERSAL_SEARCH_PATTERNS = {
     issues: /(:|#)\d+\b/,              // Finds both :123 and #123
     priorities: /#priority:(high|low)/, // New syntax
     tags: /[#+]\w+/                     // Both + and # prefixes
   };
   ```

2. **Migration Helper Searches:**
   ```typescript
   function findUnconvertedPatterns(): string[] {
     // Find patterns that need migration
     return [
       ':::.*[a-z]+:[^#@\\s]+',  // Properties without #
       ':::.*\\+\\w+',           // Old +tag syntax
       ':::.*:(\\d+|[A-Z]+-\\d+)' // References without #
     ];
   }
   ```

## Phase 3: CLI Tool Updates

### Linter (`packages/cli/src/commands/lint.ts`)

**New Validation Rules:**
```typescript
interface ValidationRule {
  id: string;
  level: 'error' | 'warn';
  pattern: RegExp;
  message: string;
  autoFix?: (match: string) => string;
}

const UNIFIED_HASH_RULES: ValidationRule[] = [
  {
    id: 'reference-hash-required',
    level: 'error',
    pattern: /:::\s*[^#]*[a-z]+:(\d+|[A-Z]+-\d+)\b/,
    message: 'Reference values must use # prefix',
    autoFix: (match) => match.replace(/:(\d+|[A-Z]+-\d+)/, ':#$1')
  },
  {
    id: 'tag-prefix-required', 
    level: 'error',
    pattern: /:::\s*[^#]*\s+[a-z]+:[^#@\s]+/,
    message: 'Tags must use # prefix',
    autoFix: (match) => match.replace(/\s+([a-z]+:)/, ' #$1')
  },
  {
    id: 'ambiguous-values',
    level: 'error',
    pattern: /:::\s*[^#]*(high|medium|low|critical|major|minor)\b/,
    message: 'Ambiguous value - specify context (e.g., #priority:high)'
  }
];
```

### Formatter (`packages/cli/src/commands/format.ts`)

**Auto-fix Implementation:**
```typescript
function applyUnifiedHashFixes(content: string): string {
  return content
    // Convert properties to hash syntax
    .replace(/(:::.*?)([a-z]+):([^#@\s]+)/g, '$1#$2:#$3')
    // Convert +tags to #tags  
    .replace(/(:::.*?)\+([a-z]\w*)/g, '$1#$2')
    // Ensure # in reference values
    .replace(/(#[a-z]+):(\d+|[A-Z]+-\d+)\b/g, '$1:#$2');
}
```

## Phase 4: Test Updates

### Test Files to Update

**Parser Tests:**
- [ ] `packages/core/src/__tests__/parser.test.ts`
- [ ] `packages/core/src/__tests__/search.test.ts` 
- [ ] `packages/core/src/__tests__/streaming.test.ts`

**CLI Tests:**
- [ ] `packages/cli/src/__tests__/security.test.ts`

**Formatter Tests:**
- [ ] `packages/formatters/src/__tests__/formatter.test.ts`

**New Test Cases Needed:**

1. **Hash Syntax Validation:**
   ```typescript
   describe('unified hash syntax', () => {
     it('should require # prefix for reference values', () => {
       const input = 'todo ::: fix bug fixes:123';
       expect(parser.validate(input)).toContainError('reference-hash-required');
     });
     
     it('should auto-fix missing hash prefixes', () => {
       const input = 'todo ::: fix bug fixes:123';
       const expected = 'todo ::: fix bug #fixes:#123';
       expect(formatter.autoFix(input)).toBe(expected);
     });
   });
   ```

2. **Backwards Compatibility:**
   ```typescript
   describe('search compatibility', () => {
     it('should find issues in both old and new format', () => {
       const oldFormat = 'todo ::: fix bug fixes:123';
       const newFormat = 'todo ::: fix bug #fixes:#123';
       
       expect(search.findIssues('123')).toContain(oldFormat);
       expect(search.findIssues('123')).toContain(newFormat);
     });
   });
   ```

## Phase 5: Migration Tooling

### Migration Scripts Location
- [ ] `scripts/migrate-unified-hash.sh` - Main migration script
- [ ] `scripts/validate-migration.sh` - Validation script
- [ ] `scripts/terminology-update.sh` - Documentation updates

### Migration Report Format
```
Unified Hash Migration Report
=============================
Files processed: 156
Syntax changes: 342
  - Properties converted: 89  (priority:high → #priority:high)
  - References fixed: 67      (fixes:123 → #fixes:#123) 
  - Tags converted: 186       (+backend → #backend)

Validation issues: 12
  - Ambiguous values: 8       (Require manual review)
  - Complex patterns: 4       (Require manual conversion)

Files requiring manual review:
  - src/complex-example.ts:45  (nested properties)
  - docs/advanced-guide.md:78  (complex example)
```

## Expected Timeline

**Phase 1 (Documentation)**: ~1-2 days
- Quick terminology updates
- Grammar and example changes
- Validation rule documentation

**Phase 2 (Parser Core)**: ~2-3 days  
- Parser logic updates
- Schema validation changes
- Search pattern updates

**Phase 3 (CLI Tools)**: ~2-3 days
- Linter rule implementation
- Formatter auto-fix logic
- Error message updates

**Phase 4 (Testing)**: ~1-2 days
- Test fixture updates
- New test cases
- Validation testing

**Phase 5 (Migration)**: ~1 day
- Script development
- Migration execution
- Validation reporting

**Total Estimated Time: 7-11 days**

## Risk Mitigation

### Backwards Compatibility
- Keep old search patterns working during transition
- Provide clear migration warnings, not errors initially
- Support both `+` and `#` syntax temporarily

### Validation Strategy
- Comprehensive test coverage before migration
- Automated validation reports
- Manual review for complex cases

### Rollback Plan
- Full backup of all modified files
- Ability to revert parser changes
- Documented rollback procedures

## Success Criteria

1. **All documentation updated** with new terminology and syntax
2. **Parser successfully validates** unified hash syntax
3. **Migration scripts complete** without data loss
4. **All tests pass** with new syntax
5. **Search patterns work** for both old and new syntax during transition
6. **Linter catches** all validation rule violations
7. **Auto-fix capabilities** handle 90%+ of common conversions

## Post-Implementation

### Deprecation Timeline
- **Month 1**: Warnings for old syntax, auto-fix available
- **Month 2**: Errors for old syntax in strict mode
- **Month 3**: Remove old syntax support entirely

### Documentation Maintenance
- Update any remaining examples found in the wild
- Create comprehensive migration guide for external users
- Update any external documentation or blog posts