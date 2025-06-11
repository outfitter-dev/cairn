# Migration Guide: Grepa → Cairn

<!-- :M: tldr Complete migration guide for upgrading from Grepa to Cairn -->

This guide helps existing Grepa users migrate to the new Cairn ecosystem. This represents a **complete rebrand and API overhaul** requiring significant changes to your codebase.

## 📋 **Overview**

**Cairn** (formerly Grepa) is a code navigation system using searchable comment markers. The new version introduces:

- **New Theme**: Exploration & hiking (Cairns as navigation markers)
- **Acronym**: "Comment Anchors: Inline References & Notes"  
- **Consistent Terminology**: Simplified and clear naming throughout
- **Enhanced Pattern**: `:M:` for better visibility and uniqueness

## 🚨 **Breaking Changes**

This is a **major version update** (v2.0.0) with breaking changes:

### **1. Package Names**
```bash
# Old
npm install @grepa/core @grepa/cli @grepa/formatters

# New  
npm install @cairn/core @cairn/cli @cairn/formatters
```

### **2. CLI Binary**
```bash
# Old
grepa search "todo"

# New
cairn search "todo"
```

### **3. Core Pattern**
```javascript
// Old pattern
// :M: todo implement validation
// :M: security check permissions

// New pattern
// :M: todo implement validation  
// :M: security check permissions
```

### **4. API Changes**
```typescript
// Old API
import { GrepaSearch } from '@grepa/core';

interface SearchOptions {
  markers?: string[];
}

const results = await GrepaSearch.search(['**/*.ts'], { markers: ['todo'] });
const unique = GrepaSearch.getUniqueMarkers(results);

// New API
import { CairnSearch } from '@cairn/core';

interface SearchOptions {
  contexts?: string[];
}

const results = await CairnSearch.search(['**/*.ts'], { contexts: ['todo'] });
const unique = CairnSearch.getUniqueContexts(results);
```

### **5. Type Definitions**
```typescript
// Old interface
interface MagicAnchor {
  markers: string[];
  // ...
}

// New interface  
interface Cairn {
  contexts: string[];
  // ...
}
```

## 🔄 **Migration Steps**

### **Step 1: Update Package Dependencies**

```bash
# Remove old packages
npm uninstall @grepa/core @grepa/cli @grepa/formatters @grepa/types

# Install new packages
npm install @cairn/core @cairn/cli @cairn/formatters @cairn/types
```

### **Step 2: Update Imports**

```typescript
// Before
import { GrepaSearch } from '@grepa/core';
import type { SearchOptions, MagicAnchor } from '@grepa/types';
import { JsonFormatter } from '@grepa/formatters';

// After
import { CairnSearch } from '@cairn/core';
import type { SearchOptions, Cairn } from '@cairn/types';
import { JsonFormatter } from '@cairn/formatters';
```

### **Step 3: Update API Calls**

```typescript
// Before
const results = await GrepaSearch.search(['**/*.ts'], { markers: ['todo'] });
const contexts = GrepaSearch.getUniqueMarkers(results.data);
const grouped = GrepaSearch.groupByMarker(results.data);

// After
const results = await CairnSearch.search(['**/*.ts'], { contexts: ['todo'] });
const contexts = CairnSearch.getUniqueContexts(results.data);
const grouped = CairnSearch.groupByContext(results.data);
```

### **Step 4: Update Property Access**

```typescript
// Before
results.data.forEach(result => {
  console.log(result.anchor.markers); // Array of markers
});

// After
results.data.forEach(result => {
  console.log(result.anchor.contexts); // Array of contexts
});
```

### **Step 5: Update CLI Usage**

```bash
# Before
grepa search "todo" --markers security,performance
grepa parse --format json --markers-only

# After
cairn search "todo" --contexts security,performance  
cairn parse --format json --contexts-only
```

### **Step 6: Update Code Patterns**

Use find-and-replace tools to update your codebase:

```bash
# Update all :M: patterns to :M:
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.md" \) \
  -exec sed -i 's/:M:/:M:/g' {} +

# Update search commands in documentation  
find . -name "*.md" -exec sed -i 's/rg ":M:"/rg ":M:"/g' {} +
```

### **Step 7: Update Configuration**

**VS Code settings.json:**
```json
{
  // Before
  "todo-tree.regex.regex": ":M: (\\w+)",
  
  // After
  "todo-tree.regex.regex": ":M: (\\w+)"
}
```

**Git hooks:**
```bash
#!/bin/sh
# Before
if git diff --cached | grep -q ":M: temp"; then

# After  
if git diff --cached | grep -q ":M: temp"; then
```

## 🔧 **Automated Migration Script**

Save this as `migrate-to-cairn.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Migrating from Grepa to Cairn..."

# Update package.json dependencies
echo "📦 Updating package dependencies..."
if [ -f package.json ]; then
  sed -i 's/@grepa\//@cairn\//g' package.json
fi

# Update TypeScript/JavaScript imports
echo "📝 Updating imports..."
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -exec sed -i 's/@grepa\//@cairn\//g' {} +

find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -exec sed -i 's/GrepaSearch/CairnSearch/g' {} +

# Update code patterns
echo "🔄 Updating :M: to :M: patterns..."
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.md" -o -name "*.txt" \) \
  -not -path "./node_modules/*" \
  -exec sed -i 's/:M:/:M:/g' {} +

# Update property names
echo "🏷️ Updating API property names..."
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -exec sed -i 's/\.markers/\.contexts/g' {} +

find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -exec sed -i 's/markers:/contexts:/g' {} +

# Update CLI commands in scripts
echo "⚙️ Updating CLI commands..."
find . -type f \( -name "*.json" -o -name "*.sh" -o -name "*.md" \) \
  -not -path "./node_modules/*" \
  -exec sed -i 's/grepa /cairn /g' {} +

echo "✅ Migration complete!"
echo "Next steps:"
echo "1. Run 'npm install' to install new packages"
echo "2. Update your CI/CD scripts"  
echo "3. Test your application thoroughly"
echo "4. Update documentation and README files"
```

Make executable and run:
```bash
chmod +x migrate-to-cairn.sh
./migrate-to-cairn.sh
```

## 📚 **Terminology Reference**

| Old Term | New Term | Context |
|----------|----------|---------|
| Grepa | Cairn | Project name |
| grepa | cairn | CLI command |
| @grepa/* | @cairn/* | Package namespace |
| Magic Anchors | Cairns | Core concept |
| :M: | :M: | Pattern identifier |
| marker | context | Individual tags (todo, security, etc.) |
| sigil | identifier | Technical term for :M:/:M: |
| GrepaSearch | CairnSearch | Main search class |

## 🧪 **Testing Your Migration**

After migration, verify everything works:

```bash
# Install new packages
npm install

# Test CLI  
cairn --version
cairn search "todo" --contexts security

# Test programmatic usage
node -e "
  const { CairnSearch } = require('@cairn/core');
  console.log('✅ Import successful');
"

# Search for any remaining old patterns
grep -r ":M:" . --exclude-dir=node_modules || echo "✅ No :M: patterns found"
grep -r "@grepa" . --exclude-dir=node_modules || echo "✅ No @grepa references found"
```

## 🆘 **Troubleshooting**

### **Import Errors**
```bash
# Error: Cannot find module '@grepa/core'
# Solution: Ensure all imports are updated to @cairn/*
grep -r "@grepa" . --exclude-dir=node_modules
```

### **Property Access Errors**  
```bash
# Error: Cannot read property 'markers' of undefined
# Solution: Update property access to 'contexts'
grep -r "\.markers" . --exclude-dir=node_modules
```

### **CLI Command Not Found**
```bash
# Error: grepa: command not found
# Solution: Update all scripts to use 'cairn'
grep -r "grepa " . --exclude-dir=node_modules
```

## 📞 **Support**

If you encounter issues during migration:

1. **Check the changelog**: Review breaking changes in detail
2. **Search issues**: Look for similar migration problems
3. **Create an issue**: Provide migration context and error details
4. **Join discussions**: Community support for migration questions

## 🎯 **Benefits of Migration**

After completing the migration you'll get:

- **Clearer terminology**: "contexts" vs "markers" 
- **Better visibility**: `:M:` pattern is more unique and searchable
- **Consistent branding**: Hiking/exploration theme throughout
- **Improved APIs**: Better type safety and clearer method names
- **Enhanced tooling**: Updated VS Code extensions and integrations

**Welcome to Cairn!** 🏔️ Your code navigation just got better.