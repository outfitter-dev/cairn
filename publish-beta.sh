#!/bin/bash
# :A: tldr Script to publish beta versions for testing

set -euo pipefail

# Function to handle errors and cleanup
cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    echo "Error occurred! Attempting to restore package.json files..."
    # Use find to reliably restore all package.json files
    find . -name "package.json" -not -path "./node_modules/*" -exec git checkout -- {} \;
    echo "Cleanup completed."
  fi
  exit $exit_code
}

# Set trap to cleanup on error
trap cleanup EXIT

# Ensure we're on a clean working directory
if [[ -n $(git status -s) ]]; then
  echo "Error: Working directory has uncommitted changes"
  exit 1
fi

# Build all packages
echo "Building packages..."
if ! pnpm build; then
  echo "Error: Build failed"
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
BETA_VERSION="${CURRENT_VERSION}-beta.$(date +%s)"

echo "Publishing beta version: $BETA_VERSION"

# Temporarily update versions
echo "Updating package versions..."
if ! pnpm -r exec npm version $BETA_VERSION --no-git-tag-version; then
  echo "Error: Failed to update package versions"
  exit 1
fi

# Publish with beta tag
echo "Publishing packages..."
if ! pnpm -r publish --tag beta --no-git-checks; then
  echo "Error: Failed to publish packages"
  # Cleanup will be handled by trap
  exit 1
fi

# Revert version changes using find for reliability
echo "Reverting version changes..."
find . -name "package.json" -not -path "./node_modules/*" -exec git checkout -- {} \;

echo "Beta published successfully! Install with:"
echo "  npm install -g @grepa/cli@beta"