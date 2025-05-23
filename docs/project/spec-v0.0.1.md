# grepa v0.0.1 Specification

## Overview

Version 0.0.1 addresses critical foundational elements that were missing from v0, establishing a solid base for future development. This release focuses on testing, error handling, build verification, CI/CD, package publishing, and developer experience.

## Goals

1. **Comprehensive Test Coverage**: Establish unit, integration, and E2E testing infrastructure
2. **Robust Error Handling**: Implement consistent error patterns across the codebase
3. **Build Verification**: Ensure build artifacts work correctly before publishing
4. **CI/CD Pipeline**: Automate testing, building, and releasing
5. **Package Publishing**: Configure and document the npm publishing workflow
6. **Developer Experience**: Improve local development with watch mode and better tooling

## Technical Strategy

### 1. Testing Infrastructure

:ga:tldr Implement comprehensive testing using Vitest for unit/integration and Playwright for E2E

#### Unit Tests
- Test all core parser functions with edge cases
- Validate config loading and merging logic
- Test file traversal with mock file systems
- Verify token extraction and normalization

#### Integration Tests
- Test CLI commands with fixture repositories
- Validate ripgrep integration
- Test configuration discovery
- Verify output formatting (text/JSON)

#### E2E Tests
- Create test repositories with various anchor patterns
- Test full command workflows
- Validate pre-commit hook behavior
- Test error scenarios and recovery

#### Implementation
```typescript
// :ga:tldr Example test structure for parser
describe('parser', () => {
  describe('parseAnchors', () => {
    it('should parse basic anchors', () => {
      const content = '// :ga:tldr This is a test\nfunction test() {}';
      const anchors = parseAnchors(content, 'test.ts');
      expect(anchors).toHaveLength(1);
      expect(anchors[0].token).toBe('tldr');
    });
    
    it('should handle malformed anchors gracefully', () => {
      // :ga:error Test error handling
      const content = '// :ga: \n// :ga:';
      const anchors = parseAnchors(content, 'test.ts');
      expect(anchors).toHaveLength(0);
    });
  });
});
```

### 2. Error Handling

:ga:tldr Implement consistent error handling with typed errors and user-friendly messages

#### Error Types
```typescript
// :ga:tldr Custom error classes for different scenarios
export class GrepaError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'GrepaError';
  }
}

export class ConfigError extends GrepaError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
  }
}

export class ParseError extends GrepaError {
  constructor(message: string, public file?: string, public line?: number) {
    super(message, 'PARSE_ERROR');
  }
}
```

#### Error Handling Patterns
- Use try-catch blocks at command boundaries
- Provide contextual error messages
- Include recovery suggestions
- Log verbose errors in debug mode
- Exit with appropriate codes in CI mode

### 3. Build Verification

:ga:tldr Verify build artifacts work correctly before publishing

#### Build Verification Script
```bash
#!/bin/bash
# :ga:tldr Verify build artifacts work correctly

# Clean and rebuild
pnpm clean
pnpm build

# Test CLI binary
node packages/cli/dist/cli.js --version

# Test require/import
node -e "require('@grepa/core')"
node -e "import('@grepa/core')" --input-type=module

# Run smoke tests
pnpm test:smoke
```

#### Smoke Tests
- Verify CLI commands execute without errors
- Test basic functionality with minimal fixtures
- Validate package.json exports
- Check TypeScript types are included

### 4. CI/CD Pipeline

:ga:tldr GitHub Actions workflow for automated testing and releasing

#### Main Workflow (.github/workflows/ci.yml)
```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  test:
    # :ga:tldr Run tests on multiple platforms
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20]
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
      - run: pnpm lint
      
  release:
    # :ga:tldr Automated releases with changesets
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 5. Package Publishing

:ga:tldr Configure npm publishing with scoped packages

#### Publishing Configuration
1. Set up npm organization: `@grepa`
2. Configure package access in package.json:
   ```json
   {
     "publishConfig": {
       "access": "public"
     }
   }
   ```
3. Add release script to root package.json:
   ```json
   {
     "scripts": {
       "release": "pnpm build && changeset publish"
     }
   }
   ```

#### Publishing Checklist
- [ ] Verify npm authentication
- [ ] Run build verification script
- [ ] Create changeset with proper version bump
- [ ] Review changeset PR
- [ ] Merge to trigger automated release

### 6. Developer Experience

:ga:tldr Improve local development workflow with watch mode and better tooling

#### Watch Mode
```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "dev:core": "pnpm --filter @grepa/core dev",
    "dev:cli": "pnpm --filter @grepa/cli dev"
  }
}
```

#### Development Tools
- Add `tsx` for running TypeScript directly
- Configure VS Code debugging
- Add development fixtures
- Create contributor scripts

#### VS Code Configuration
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI",
      "program": "${workspaceFolder}/packages/cli/src/cli.ts",
      "args": ["list"],
      "runtimeArgs": ["-r", "tsx/cjs"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

## Implementation Plan

### Week 1: Testing Infrastructure
- [ ] Set up Vitest configuration
- [ ] Write unit tests for core package
- [ ] Write integration tests for CLI commands
- [ ] Set up Playwright for E2E tests

### Week 2: Error Handling & Build
- [ ] Implement error classes
- [ ] Add error handling to all commands
- [ ] Create build verification script
- [ ] Add smoke tests

### Week 3: CI/CD & Publishing
- [ ] Set up GitHub Actions workflow
- [ ] Configure changeset automation
- [ ] Test publishing to npm
- [ ] Document release process

### Week 4: Developer Experience
- [ ] Add watch mode to all packages
- [ ] Configure debugging
- [ ] Create development documentation
- [ ] Add contributor guidelines

## Success Criteria

1. **Test Coverage**: >80% code coverage with comprehensive test scenarios
2. **Error Handling**: All user-facing errors have helpful messages
3. **Build Reliability**: Zero failed builds due to artifact issues
4. **CI/CD**: Automated testing on every PR, automated releases on merge
5. **Publishing**: Successful npm publication with proper versioning
6. **DX**: <2 second feedback loop in watch mode

## Dependencies

- Testing: `vitest`, `@vitest/ui`, `playwright`
- Development: `tsx`, `nodemon`
- CI/CD: GitHub Actions, Changesets
- Publishing: npm registry access

## Migration Guide

No breaking changes from v0. This release only adds:
- Test infrastructure (no production impact)
- Better error messages (improved UX)
- Development tooling (opt-in)
- CI/CD automation (maintainer-only)

## Future Considerations

- Performance benchmarking suite
- API documentation generation
- Code coverage badges
- Release notes automation
- Security scanning integration

## Technical Debt Addressed

1. **Missing Tests**: Establishes testing foundation
2. **Inconsistent Errors**: Standardizes error handling
3. **Manual Releases**: Automates publishing workflow
4. **Slow Development**: Improves feedback loops
5. **Build Fragility**: Adds verification steps

## References

- [Vitest Documentation](https://vitest.dev/)
- [Changesets Guide](https://github.com/changesets/changesets)
- [GitHub Actions for Node.js](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)
- [npm Publishing Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)