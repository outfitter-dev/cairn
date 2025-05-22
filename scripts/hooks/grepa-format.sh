#!/bin/bash
# :ga:tldr Pre-commit hook to format TODO/FIXME comments
# :ga:ci Convert legacy comments to anchors

set -e

# :ga:config Check if grepa is installed
if ! command -v grepa &> /dev/null; then
    echo "Error: grepa CLI not found. Please install it first:"
    echo "  npm install -g @grepa/cli"
    exit 1
fi

echo "Checking for TODO/FIXME comments to convert..."

# :ga:ci Check if there are any changes to make
if grepa format --dry-run | grep -q "No convertible comments found"; then
    echo "✅ No TODO/FIXME comments to convert"
else
    echo "Converting TODO/FIXME comments to grep-anchors..."
    
    # :ga:ci Apply formatting
    grepa format
    
    # :ga:ci Stage the modified files
    git add -u
    
    echo "✅ Converted comments to grep-anchors and staged changes"
fi