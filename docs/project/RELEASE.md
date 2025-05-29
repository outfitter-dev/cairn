<!-- :A: tldr Release process using changesets -->

# Release Process

This project uses [changesets](https://github.com/changesets/changesets) to manage releases.

## Making Changes

1. Make your changes on a feature branch
2. Before committing, create a changeset:
   ```bash
   pnpm changeset
   ```
3. Select the type of change (patch/minor/major)
4. Write a summary of your changes
5. Commit both your code and the generated changeset file

## Release Workflow

### Automated (via GitHub Actions)

When changes are merged to `main`:
1. GitHub Action creates a "Version Packages" PR
2. This PR updates versions and changelogs
3. Merge the PR to trigger a release to npm

### Manual Release

1. Update versions:
   ```bash
   pnpm version
   ```
2. Review and commit the changes
3. Build and publish:
   ```bash
   pnpm release
   ```

## Version Strategy

- **Patch** (0.0.x): Bug fixes, dependency updates
- **Minor** (0.x.0): New features, non-breaking changes
- **Major** (x.0.0): Breaking changes

## Pre-release Checks

The `prerelease` script automatically runs:
- Tests (`pnpm test`)
- Type checking (`pnpm typecheck`)

Add more checks as needed in package.json.