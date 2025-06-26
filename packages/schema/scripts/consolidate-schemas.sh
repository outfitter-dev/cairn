#!/bin/bash
# tldr ::: Remove redundant schema files after grammar + dictionary consolidation

# Script to consolidate waymark schemas
# This removes redundant files now that we have the grammar + dictionary system

echo "Consolidating waymark schemas..."

# Base directory
SPEC_DIR="../src/spec"

# Files to remove (redundant with grammar + dictionary)
echo "Removing redundant schema files..."

# Remove temp entry file
rm -f "$SPEC_DIR/temp-entry.jsonc"

# Remove pattern schemas (now in grammar/dictionary)
rm -rf "$SPEC_DIR/patterns/"

# Remove tag pattern schemas (now in grammar)
rm -rf "$SPEC_DIR/base/tag-patterns/"

# Remove redundant base schemas
rm -f "$SPEC_DIR/base/marker-base.schema.jsonc"
rm -f "$SPEC_DIR/base/tag-base.schema.jsonc"

# Clean up tags directory (remove our temporary work files)
rm -f "$SPEC_DIR/tags/consolidated-tags.schema.jsonc"
rm -f "$SPEC_DIR/tags/core.schema.jsonc"
rm -f "$SPEC_DIR/tags/tag-template.schema.jsonc"

echo "Schema consolidation complete!"
echo ""
echo "Remaining structure:"
echo "  - core/grammar.schema.json (syntax rules)"
echo "  - core/dictionary.schema.json (vocabulary)"
echo "  - config.schema.json (project config)"
echo "  - runtime/node.schema.json (runtime representation)"
echo "  - runtime/location.schema.json (source tracking)"
echo "  - index.schema.json (main entry point)"