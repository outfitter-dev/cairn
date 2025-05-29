<!-- :A: tldr PR #26 feedback organized by priority with dependencies -->

# PR #26 Monorepo Conversion - Feedback Checklist

This document organizes all feedback from the PR review, sorted by priority with dependencies tracked.

## Checklist

### Critical Issues (Must Fix)
- [ ] Fix async/await in CLI bin.ts
- [ ] Add missing newline in pnpm-workspace.yaml
- [ ] Fix TypeScript config issues with verbatimModuleSyntax
- [ ] Add proper error handling to critical functions
- [ ] Fix test coverage gaps

### High Priority (Dependencies & Breaking Changes)
- [ ] Update all `:ga:` references to `:A:` in documentation
- [ ] Fix import paths that may break with monorepo structure
- [ ] Add missing dependencies in package.json files
- [ ] Fix ESLint rule issues in custom plugin
- [ ] Resolve type export issues between packages

### Medium Priority (Code Quality)
- [ ] Improve Result pattern usage consistency
- [ ] Add comprehensive CLI tests
- [ ] Add proper JSDoc documentation
- [ ] Fix grammar and typos in documentation
- [ ] Consolidate duplicate code patterns

### Low Priority (Nice to Have)
- [ ] Add plugin metadata to ESLint plugin
- [ ] Improve function signatures for future implementations
- [ ] Add more examples to documentation
- [ ] Clean up unused mock functions in tests
- [ ] Consider performance optimizations

## Detailed Issues by Category

### 1. Async/Await & Promise Handling

**File: `src/cli/bin.ts`**
- **Issue**: CLI execution not properly awaited
- **Priority**: Critical
- **Fix**: 
  ```typescript
  // Current
  const cli = new CLI();
  cli.run();
  
  // Should be
  const cli = new CLI();
  await cli.run();
  ```
- **Dependencies**: None

**File: `packages/cli/src/index.ts`**
- **Issue**: `parseCommand` method should be async
- **Priority**: High
- **Fix**: Change method signature to `private async parseCommand()`

### 2. TypeScript Configuration

**File: `tsconfig.base.json`**
- **Issue**: `verbatimModuleSyntax` requires explicit type imports
- **Priority**: Critical
- **Fix**: Update all imports to use `import type` where appropriate
- **Dependencies**: Must update all import statements across packages

**File: Various package.json files**
- **Issue**: Missing or incorrect TypeScript dependencies
- **Priority**: High
- **Fix**: Ensure all packages have proper TypeScript references

### 3. Test Coverage

**File: `src/__tests__/cli.test.ts`**
- **Issue**: Minimal test coverage for CLI
- **Priority**: High
- **Suggested Tests**:
  - Command registration and parsing
  - Error handling scenarios
  - Output formatting
  - Integration with core functionality

**File: `packages/*/src/__tests__/*.test.ts`**
- **Issue**: Missing tests for critical functionality
- **Priority**: Medium
- **Fix**: Add comprehensive test suites for each package

### 4. Documentation Updates

**Files: All docs/**
- **Issue**: Inconsistent use of `:ga:` vs `:A:`
- **Priority**: High
- **Fix**: Global find/replace all `:ga:` with `:A:`
- **Dependencies**: Must be done before merging to avoid confusion

**Grammar/Typo Issues**:
- `docs/conventions/combinations.md`: "greap" → "grepa"
- `docs/project/ideas/grepa-updates-2.md`: Various grammar fixes
- `README.md`: Spelling and formatting issues

### 5. Error Handling

**File: `packages/core/src/lib/error.ts`**
- **Issue**: Missing error context preservation
- **Priority**: Medium
- **Fix**: Add cause tracking to AppError class

**File: `packages/core/src/lib/result.ts`**
- **Issue**: Incomplete Result pattern implementation
- **Priority**: Medium
- **Fix**: Add additional utility methods for error handling

### 6. Package Structure

**File: `.gitignore`**
- **Issue**: Duplicate patterns for `.claude` files
- **Priority**: Low
- **Fix**: Consolidate to single pattern `**/.claude/*.local.*`

**File: `pnpm-workspace.yaml`**
- **Issue**: Missing newline at end of file
- **Priority**: Critical (may cause parsing issues)
- **Fix**: Add newline character

### 7. ESLint Plugin

**File: `packages/utils/eslint-plugin/src/enforce-result-pattern.js`**
- **Issue**: Rule implementation could be more robust
- **Priority**: Medium
- **Fix**: Add proper TypeScript awareness to the rule

**File: `packages/utils/eslint-plugin/src/index.js`**
- **Issue**: Missing plugin metadata
- **Priority**: Low
- **Fix**: Add meta object with name and version

### 8. MCP Server Stub

**File: `packages/mcp/src/index.ts`**
- **Issue**: Function returns void instead of server instance
- **Priority**: Low (stub implementation)
- **Fix**: Update signature to return Promise<McpServer> or McpServer

### 9. Import/Export Issues

**Various files**
- **Issue**: Type imports not using `import type` syntax
- **Priority**: High (required by verbatimModuleSyntax)
- **Fix**: Update all type imports across the codebase

### 10. Configuration Files

**File: `.changeset/config.json`**
- **Issue**: Using experimental unsafe options
- **Priority**: Medium
- **Fix**: Document risks and monitor for updates

**File: `.eslintrc.json`**
- **Issue**: Disabled rules that should be enabled
- **Priority**: Medium
- **Fix**: Re-enable rules after fixing violations

## Implementation Order

1. **Fix Critical Issues First**
   - CLI async/await
   - pnpm-workspace.yaml newline
   - TypeScript config

2. **Update Documentation**
   - Global `:ga:` → `:A:` replacement
   - Fix grammar and typos

3. **Fix Dependencies**
   - Update import statements for verbatimModuleSyntax
   - Add missing package dependencies

4. **Improve Test Coverage**
   - Add CLI tests
   - Add package-specific tests

5. **Code Quality Improvements**
   - Error handling enhancements
   - Result pattern consistency
   - JSDoc documentation

6. **Nice-to-Have Enhancements**
   - Plugin metadata
   - Performance optimizations
   - Additional examples

## Notes

- Many issues are interconnected; fixing TypeScript config will require updating imports across all packages
- Documentation updates should be done in a single pass to ensure consistency
- Test coverage can be improved incrementally after core issues are resolved
- Some "nitpick" items can be deferred to future PRs if needed