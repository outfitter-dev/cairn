#!/bin/bash
# :A: tldr Script to publish beta versions for testing

# Ensure we're on a clean working directory
if [[ -n $(git status -s) ]]; then
  echo "Error: Working directory has uncommitted changes"
  exit 1
fi

# Build all packages
echo "Building packages..."
pnpm build

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
BETA_VERSION="${CURRENT_VERSION}-beta.$(date +%s)"

echo "Publishing beta version: $BETA_VERSION"

# Temporarily update versions
pnpm -r exec npm version $BETA_VERSION --no-git-tag-version

# Publish with beta tag
pnpm -r publish --tag beta --no-git-checks

# Revert version changes
git checkout -- '**/package.json'

echo "Beta published! Install with:"
echo "  npm install -g @grepa/cli@beta"