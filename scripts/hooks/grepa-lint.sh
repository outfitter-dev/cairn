#!/bin/bash
# :ga:tldr Pre-commit hook to run grepa lint
# :ga:ci Block commits with forbidden anchors

set -e

# :ga:config Check if grepa is installed
if ! command -v grepa &> /dev/null; then
    echo "Error: grepa CLI not found. Please install it first:"
    echo "  npm install -g @grepa/cli"
    exit 1
fi

echo "Running grepa lint..."

# :ga:ci Run lint in CI mode
if ! grepa lint --ci; then
    echo ""
    echo "❌ Commit blocked: grep-anchor violations found"
    echo "Please fix the issues above before committing."
    exit 1
fi

echo "✅ All grep-anchor checks passed"