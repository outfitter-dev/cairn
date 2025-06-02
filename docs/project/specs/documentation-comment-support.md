# Grepa Documentation Comment Support
<!-- :A: tldr Proposal for enhanced grepa tooling to handle documentation comments -->
<!-- :A: spec Grepa tooling enhancements for JSDoc, docstrings, and other doc systems -->

**Status**: Proposal  
**Version**: 1.0  
**Date**: 2025-06-02  

## Overview

This proposal outlines enhancements to grepa tooling to provide seamless support for Magic Anchors within documentation comments (JSDoc, Python docstrings, Rustdoc, etc.). These enhancements will enable filtering, combining, and advanced search capabilities specifically tailored to documentation-embedded anchors.

## Current State

Magic Anchors already work within documentation comments since they're just comment content. However, grepa tooling lacks specific support for:

1. **Documentation-aware filtering** - Separating doc comments from regular comments
2. **Combined searches** - Finding anchors with their documentation context
3. **Documentation format detection** - Understanding different doc comment styles
4. **Enhanced output formatting** - Showing anchors with their full documentation context

## Proposed Enhancements

### 1. Documentation Comment Detection

**Feature**: `--doc-comments` flag to filter results to documentation comments only

```bash
# Find anchors only in documentation comments
grepa ":A: api" --doc-comments

# Exclude documentation comments (regular comments only)
grepa ":A: todo" --no-doc-comments
```

**Implementation**: Pattern matching for documentation comment formats:
- JavaScript/TypeScript: `/** ... */`
- Python: `""" ... """` or `''' ... '''`
- Rust: `/// ...` or `//! ...`
- Go: `// ...` (function/type preceding)
- Java: `/** ... */`
- C#: `/// ...`
- Swift: `/// ...`
- Ruby: `## ...`
- PHP: `/** ... */`

### 2. Combined Documentation Context

**Feature**: `--with-docs` flag to show anchors with their full documentation context

```bash
# Show anchors with their complete documentation blocks
grepa ":A: api" --with-docs

# Output example:
# src/auth.js:23-35
# /**
#  * :A: api Primary authentication endpoint
#  * :A: sec validate all inputs before processing
#  * 
#  * @description Authenticates users with JWT tokens
#  * @param {string} token - JWT token to validate
#  * @returns {Promise<User>} Authenticated user object
#  */
```

### 3. Documentation Format Filtering

**Feature**: `--doc-format` flag to filter by specific documentation formats

```bash
# Find anchors only in JSDoc comments
grepa ":A:" --doc-format=jsdoc

# Find anchors in Python docstrings
grepa ":A:" --doc-format=docstring

# Find anchors in Rust documentation
grepa ":A:" --doc-format=rustdoc
```

**Supported formats**:
- `jsdoc` - JavaScript/TypeScript JSDoc blocks (`/** ... */`)
- `docstring` - Python docstrings (`""" ... """`)
- `rustdoc` - Rust doc comments (`/// ...`)
- `godoc` - Go documentation comments
- `javadoc` - Java documentation blocks
- `xmldoc` - C# XML documentation (`/// <summary>`)
- `rdoc` - Ruby RDoc comments (`## ...`)
- `phpdoc` - PHP documentation blocks

### 4. Language-Aware Search Patterns

**Feature**: Automatic language detection with appropriate documentation patterns

```bash
# Automatically detect language and use appropriate doc comment patterns
grepa ":A: api" --auto-doc-detect

# Language-specific shortcuts
grepa ":A:" --js-docs    # JavaScript JSDoc only
grepa ":A:" --py-docs    # Python docstrings only  
grepa ":A:" --rust-docs  # Rust doc comments only
```

### 5. Documentation Quality Analysis

**Feature**: `--doc-analysis` flag for analyzing documentation coverage and quality

```bash
# Analyze documentation anchor coverage
grepa --doc-analysis

# Output example:
# Documentation Analysis Report
# ============================
# 
# Files with doc comments: 45/67 (67%)
# Functions with :A: tldr: 23/89 (26%)
# API functions with :A: api: 67/67 (100%)
# Security anchors in docs: 12
# 
# Missing documentation anchors:
# - src/utils.js:15 - function validateEmail (missing :A: tldr)
# - src/auth.js:45 - function hashPassword (missing :A: sec)

# Quality checks
grepa --doc-quality
# - Verify :A: tldr exists for all public functions
# - Check :A: api for exported functions/classes
# - Ensure :A: sec for security-critical functions
```

### 6. Enhanced Output Formats

**Feature**: Multiple output formats optimized for documentation context

```bash
# Markdown output for documentation
grepa ":A: api" --output=markdown

# JSON output for tool integration  
grepa ":A:" --output=json --doc-comments

# HTML output with syntax highlighting
grepa ":A:" --output=html --with-docs
```

**Markdown output example**:
```markdown
## API Documentation Anchors

### src/auth.js

#### authenticateUser (line 23)
```javascript
/**
 * :A: api Primary authentication endpoint
 * :A: sec validate all inputs before processing
 * 
 * @description Authenticates users with JWT tokens
 * @param {string} token - JWT token to validate
 * @returns {Promise<User>} Authenticated user object
 */
```

**Tags**: `api`, `sec`  
**Context**: Authentication, Security
```

### 7. Documentation Template Generation

**Feature**: Generate documentation templates with Magic Anchors

```bash
# Generate JSDoc template with anchors
grepa --generate-template=jsdoc --function=authenticateUser

# Output:
# /**
#  * :A: tldr [Brief description]
#  * :A: api [Public interface description]  
#  * :A: sec [Security considerations]
#  * 
#  * @description [Detailed description]
#  * @param {type} param - [Parameter description]
#  * @returns {type} [Return value description]
#  */

# Generate Python docstring template
grepa --generate-template=docstring --function=process_data

# Generate templates for multiple functions
grepa --generate-templates --missing-docs
```

### 8. Documentation Anchor Validation

**Feature**: Validate that documentation follows Magic Anchor conventions

```bash
# Validate documentation anchor usage
grepa --validate-docs

# Check for common issues:
# - Missing space after :A:
# - Inconsistent anchor placement
# - Missing essential anchors (tldr, api for public functions)
# - Orphaned anchors (not in documentation context)

# Validation rules configuration
grepa --validate-docs --rules=strict
# - All public functions must have :A: tldr
# - All API endpoints must have :A: api
# - All security functions must have :A: sec
```

### 9. Documentation Search Combinations

**Feature**: Advanced search combinations for documentation-specific workflows

```bash
# Find functions missing API documentation
grepa --missing-anchor="api" --doc-comments --functions

# Find security functions without security anchors
grepa --missing-anchor="sec" --pattern="auth|password|token|security"

# Find deprecated functions still in documentation
grepa ":A: deprecated" --with-docs --show-usage

# Find TODO items in documentation that need AI attention
grepa ":A: todo.*@agent" --doc-comments --priority-high
```

### 10. Integration with Documentation Generators

**Feature**: Export Magic Anchor metadata for documentation tools

```bash
# Export anchor metadata for JSDoc
grepa --export-jsdoc-metadata > anchors.json

# Generate additional JSDoc tags from anchors
grepa --convert-to-jsdoc-tags
# Converts ":A: api" to "@api" tags
# Converts ":A: deprecated" to "@deprecated" tags

# Integration with other doc tools
grepa --export-sphinx-metadata    # For Python Sphinx
grepa --export-rustdoc-metadata   # For Rust documentation
grepa --export-godoc-metadata     # For Go documentation
```

## Implementation Architecture

### Core Components

#### 1. Documentation Comment Parser

```typescript
interface DocCommentParser {
  detectFormat(content: string, language: string): DocFormat;
  extractDocBlocks(content: string, format: DocFormat): DocBlock[];
  findAnchorsInDocs(blocks: DocBlock[]): AnchorInDoc[];
}

interface DocBlock {
  format: DocFormat;
  startLine: number;
  endLine: number;
  content: string;
  anchors: Anchor[];
  associatedCode?: CodeBlock;
}

interface AnchorInDoc extends Anchor {
  documentationContext: DocBlock;
  isInDocumentation: boolean;
}
```

#### 2. Language-Specific Doc Handlers

```typescript
abstract class DocHandler {
  abstract detectDocComments(content: string): DocBlock[];
  abstract validateDocAnchor(anchor: Anchor, context: DocBlock): ValidationResult;
  abstract generateTemplate(codeElement: CodeElement): string;
}

// Language-specific implementations
class JSDocHandler extends DocHandler { /* ... */ }
class PythonDocstringHandler extends DocHandler { /* ... */ }
class RustDocHandler extends DocHandler { /* ... */ }
// ... other language handlers
```

#### 3. Documentation Analysis Engine

```typescript
interface DocAnalyzer {
  analyzeCoverage(files: FileInfo[]): CoverageReport;
  validateQuality(anchors: AnchorInDoc[]): QualityReport;
  findMissingDocumentation(codeElements: CodeElement[]): MissingDoc[];
  generateRecommendations(analysis: AnalysisResult): Recommendation[];
}

interface CoverageReport {
  totalFunctions: number;
  functionsWithDocs: number;
  functionsWithAnchors: number;
  anchorsByType: Map<string, number>;
  missingEssentialAnchors: MissingAnchor[];
}
```

#### 4. Enhanced Search Engine

```typescript
interface DocAwareSearchEngine extends SearchEngine {
  searchInDocumentation(pattern: string, options: DocSearchOptions): SearchResult[];
  combineWithContext(results: SearchResult[]): ContextualResult[];
  filterByDocFormat(results: SearchResult[], format: DocFormat): SearchResult[];
}

interface DocSearchOptions extends SearchOptions {
  docCommentsOnly?: boolean;
  includeDocContext?: boolean;
  docFormat?: DocFormat;
  languageSpecific?: boolean;
}
```

### CLI Interface Extensions

```bash
# Documentation-specific commands
grepa docs                          # Alias for --doc-comments
grepa docs:api                      # Find API documentation anchors
grepa docs:missing                  # Find missing documentation
grepa docs:validate                 # Validate documentation quality
grepa docs:generate                 # Generate documentation templates

# Analysis commands  
grepa analyze:docs                  # Documentation coverage analysis
grepa analyze:quality               # Documentation quality report
grepa analyze:missing-anchors       # Find missing essential anchors

# Export commands
grepa export:jsdoc                  # Export JSDoc metadata
grepa export:sphinx                 # Export Sphinx metadata
grepa export:markdown               # Export as Markdown report
```

## Configuration

### Documentation Rules Configuration

```yaml
# .grepa/docs-config.yml
documentation:
  rules:
    required_anchors:
      public_functions: ["tldr", "api"]
      security_functions: ["sec"]
      deprecated_functions: ["deprecated"]
    
    quality_checks:
      enforce_tldr: true
      enforce_api_for_exports: true
      max_missing_anchors: 5
    
    formats:
      javascript: "jsdoc"
      typescript: "jsdoc" 
      python: "docstring"
      rust: "rustdoc"
      go: "godoc"
    
    templates:
      jsdoc: |
        /**
         * :A: tldr [Brief description]
         * :A: api [Interface description]
         * 
         * @description [Detailed description]
         * @param {type} param - [Description]
         * @returns {type} [Description]
         */
      
      docstring: |
        """
        :A: tldr [Brief description]
        :A: api [Interface description]
        
        [Detailed description]
        
        Args:
            param: [Description]
        
        Returns:
            [Description]
        """
```

## Usage Examples

### Basic Documentation Search

```bash
# Find all API anchors in documentation comments
grepa ":A: api" --docs

# Find security anchors with their documentation context
grepa ":A: sec" --docs --with-context

# Search for specific documentation format
grepa ":A:" --doc-format=jsdoc --language=javascript
```

### Quality Analysis

```bash
# Comprehensive documentation analysis
grepa analyze:docs --report=detailed

# Find functions missing essential documentation
grepa docs:missing --type=api --severity=high

# Validate documentation follows conventions
grepa docs:validate --rules=strict --fix-suggestions
```

### Template Generation

```bash
# Generate templates for undocumented functions
grepa docs:generate --target=functions --missing-only

# Create documentation for new API endpoints
grepa docs:generate --pattern="route.*api" --template=jsdoc
```

### Integration Workflows

```bash
# Pre-commit hook: validate documentation
grepa docs:validate --fail-on-missing --required="tldr,api"

# CI/CD: Generate documentation report
grepa analyze:docs --output=json | upload-to-docs-site

# IDE integration: Show documentation context for anchor
grepa ":A: api" --line=45 --file=src/auth.js --with-docs --format=tooltip
```

## Benefits

### For Developers

1. **Enhanced Navigation** - Find anchors within their documentation context
2. **Quality Assurance** - Ensure consistent documentation practices
3. **Template Generation** - Quickly create properly structured documentation
4. **IDE Integration** - Rich tooltips and context for Magic Anchors

### For Teams

1. **Documentation Standards** - Enforce consistent anchor usage in docs
2. **Coverage Analysis** - Track documentation completion and quality
3. **Automated Generation** - Reduce manual documentation maintenance
4. **Cross-Language Consistency** - Unified approach across different languages

### For Tools

1. **Rich Metadata** - Export anchor information for other tools
2. **Format Awareness** - Understand different documentation formats
3. **Quality Metrics** - Measurable documentation quality indicators
4. **Integration APIs** - Programmatic access to documentation anchors

## Migration Path

### Phase 1: Core Documentation Detection
- Implement basic documentation comment parsing
- Add `--doc-comments` flag
- Support major formats (JSDoc, docstrings, rustdoc)

### Phase 2: Enhanced Context and Analysis
- Add `--with-docs` context display
- Implement documentation quality analysis
- Add format-specific filtering

### Phase 3: Advanced Features
- Template generation capabilities
- Export functionality for doc tools
- Validation and quality rules

### Phase 4: Tool Integration
- IDE plugin support
- CI/CD integration features
- Advanced reporting and analytics

## Future Considerations

### Additional Documentation Formats
- **Sphinx directives** - Support for reStructuredText directives
- **Asciidoc comments** - Technical documentation format
- **Markdown embedded comments** - Documentation in Markdown files
- **OpenAPI/Swagger** - API documentation formats

### AI Integration
- **Smart template generation** - AI-generated documentation suggestions
- **Anchor recommendations** - Suggest appropriate anchors based on code
- **Quality improvements** - AI-powered documentation enhancement
- **Natural language search** - Find anchors using natural language queries

### Advanced Analytics
- **Documentation trends** - Track documentation quality over time
- **Team insights** - Documentation practices by team/developer
- **Code-doc correlation** - Relationship between code complexity and documentation
- **Maintenance predictions** - Identify documentation that needs updates

## Implementation Priority

**High Priority** (MVP):
1. Documentation comment detection
2. Basic filtering (`--doc-comments`)
3. Context display (`--with-docs`)
4. Format detection for major languages

**Medium Priority**:
1. Quality analysis and validation
2. Template generation
3. Export functionality
4. Enhanced search combinations

**Low Priority** (Future enhancements):
1. AI integration features
2. Advanced analytics
3. Specialized format support
4. Complex workflow automation

This proposal provides a roadmap for making grepa the definitive tool for working with Magic Anchors in documentation contexts, enabling rich search, analysis, and generation capabilities while maintaining the simplicity and universality of the Magic Anchor pattern.