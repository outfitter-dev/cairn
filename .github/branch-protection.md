# Branch Protection Rules

<!-- :A: tldr Documentation for required GitHub branch protection settings -->

This file documents the recommended branch protection rules for the `main` branch.

## Required Status Checks

Configure these status checks as required before merging:

- **CI / Test (18)** - Tests pass on Node.js 18
- **CI / Test (20)** - Tests pass on Node.js 20  
- **CI / Build** - Project builds successfully
- **CI / Lint** - Code passes linting (currently non-blocking)

## Recommended Settings

1. **Require pull request reviews before merging**
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from CODEOWNERS

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - Status checks listed above

3. **Require conversation resolution before merging**

4. **Require linear history** (optional, for cleaner git history)

5. **Include administrators** (recommended for consistency)

## Setting Up

1. Go to Settings → Branches in your GitHub repository
2. Add a rule for the `main` branch
3. Configure the settings listed above
4. Save the protection rule