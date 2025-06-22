<!-- !tldr ::: ##docs:@waymark/proposals/enclosures Waymark sectional enclosures using reversed anchor syntax for content boundaries #proposal -->

# Waymark Sectional Enclosures

A proposal for adding sectional content boundaries to waymarks using reversed anchor syntax, enabling precise content extraction while maintaining backward compatibility.

## Overview

This proposal extends waymarks with **optional sectional enclosures** that allow marking content boundaries within files. The system uses a simple pattern:

- **Section Start**: Any waymark with a canonical anchor (`!!marker ::: ##anchor description`)
- **Section End**: Reversed anchor syntax (`##anchor :::`)

Sections are **completely optional** - regular waymarks continue working unchanged. Only when a closure is present does the waymark become sectional.

## Core Pattern

### Regular Waymarks (Unchanged)
```javascript
// todo ::: implement JWT validation #auth
// fixme ::: session timeout bug #critical  
// note ::: see authentication docs #docs:@company/auth
```

### Sectional Waymarks (New)
```javascript
// !todo ::: ##docs:@company/auth/architecture Auth service design patterns
// Authentication implementation details...
// Security considerations and best practices...
// Multiple subsections of extensive content...
// ##docs:@company/auth/architecture :::
```

### Section End Pattern Specification

**Canonical Form**: `^\s*##[^:]+:[^\s]+\s*:::\s*$`

**Valid Section End Examples:**
```javascript
// ##docs:@company/auth/architecture :::
// ##config:@company/billing/stripe :::
<!--##docs:@company/auth/security :::-->
# ##api:@company/user/v2 :::
```

**Invalid Section End Examples:**
```javascript
// ##docs:@company/auth/architecture ::: this is invalid (no comments after)
//##docs:@company/auth/architecture::: (no spaces around anchor)
```

## Key Principles

### 1. **Additive, Not Breaking**
- All existing waymarks continue working exactly as before
- Sections only exist when explicitly closed
- Zero syntax changes to existing patterns

### 2. **Closure Indicates Section**
- Presence of `##anchor :::` makes any waymark sectional
- Without closure = regular waymark
- With closure = sectional waymark

### 3. **Any Marker Can Be Sectional**
```javascript
// !important ::: ##security:@company/auth Security implementation
// Content...
// ##security:@company/auth :::

// !fixme ::: ##bug:@company/payment/timeout Payment timeout handling
// Bug details and investigation...
// ##bug:@company/payment/timeout :::

// *todo ::: ##feature:@company/mobile/checkout Mobile checkout feature
// Feature implementation details...
// ##feature:@company/mobile/checkout :::
```

### 4. **Section Anchor Uniqueness Rules**

**Within File**: Multiple sections with different anchors are allowed
```javascript
// !config ::: ##config:@company/auth/jwt JWT configuration
// JWT settings...
// ##config:@company/auth/jwt :::

// !config ::: ##config:@company/auth/oauth OAuth configuration  
// OAuth settings...
// ##config:@company/auth/oauth :::
```

**Across Repository**: Each sectional anchor should be unique globally
- **Allowed**: Same content, different anchors (`##config:@company/auth/jwt` vs `##config:@company/auth/oauth`)
- **Disallowed**: Same anchor in multiple sections (`##config:@company/auth/jwt` in two different files/sections)

**Validation Rules:**
- **Error**: Duplicate sectional anchors across repository
- **Warning**: Unclosed sections (start without end)
- **Warning**: Orphaned closures (end without start)

## Real-World Examples

### Configuration Sections
```json
// config/services.json
// !config ::: ##config:@company/services/complete Complete service configuration
{
  "auth": {
    "jwt": { "secret": "...", "expiry": "1h" },
    "oauth": { "google": {...}, "github": {...} }
  },
  "billing": {
    "stripe": { "key": "...", "webhook": "..." },
    "plans": [...]
  },
  "database": {
    "primary": { "host": "db1.company.com" },
    "replica": { "host": "db2.company.com" }
  }
}
// ##config:@company/services/complete :::
```

### Documentation Sections  
```markdown
<!-- docs/auth-guide.md -->
<!-- !important ::: ##docs:@company/auth/security Security implementation guide -->

# Authentication Security Guide

## Threat Model
Our authentication system addresses these security threats:
- Session hijacking
- Token theft
- Brute force attacks

## Security Controls
We implement these security measures:
- JWT with RS256 signing
- Rate limiting on auth endpoints  
- Secure session management

## Best Practices
Follow these guidelines when working with authentication:
- Always validate tokens server-side
- Use HTTPS for all auth-related requests
- Implement proper logout functionality

<!-- ##docs:@company/auth/security ::: -->
```

### Test Suite Sections
```javascript
// tests/auth.test.js
// !test ::: ##test:@company/auth/complete Complete authentication test coverage

describe('Authentication Service', () => {
  describe('Login Functionality', () => {
    it('should authenticate valid users', () => {
      // Test implementation...
    });
    
    it('should reject invalid credentials', () => {
      // Test implementation...
    });
  });
  
  describe('Token Management', () => {
    it('should generate valid JWT tokens', () => {
      // Test implementation...
    });
    
    it('should refresh expired tokens', () => {
      // Test implementation...
    });
  });
  
  describe('Session Handling', () => {
    it('should create secure sessions', () => {
      // Test implementation...
    });
    
    it('should cleanup expired sessions', () => {
      // Test implementation...
    });
  });
});

// ##test:@company/auth/complete :::
```

### Multi-Schema Definitions
```json
// schemas/api-models.json
// !schema ::: ##schema:@company/api/models Complete API data models
{
  "User": {
    "type": "object",
    "properties": {
      "id": { "type": "string", "format": "uuid" },
      "email": { "type": "string", "format": "email" },
      "roles": { "type": "array", "items": { "type": "string" } }
    }
  },
  
  "Order": {
    "type": "object", 
    "properties": {
      "id": { "type": "string", "format": "uuid" },
      "userId": { "type": "string", "format": "uuid" },
      "items": { "type": "array", "items": { "$ref": "#/definitions/OrderItem" } },
      "total": { "type": "number", "minimum": 0 }
    }
  },
  
  "OrderItem": {
    "type": "object",
    "properties": {
      "productId": { "type": "string", "format": "uuid" },
      "quantity": { "type": "integer", "minimum": 1 },
      "price": { "type": "number", "minimum": 0 }
    }
  }
}
// ##schema:@company/api/models :::
```

## Search Patterns

### Quick Reference Cheat Sheet

```bash
# Essential section searches
rg "::: ##"                           # All section starts
rg "##.*:::"                          # All section ends  
rg "##[^:]+:[^\s]+\s*:::\s*$"         # Valid section ends only

# Section validation
rg "::: ##" --no-filename > starts    # Find unclosed sections
rg "##.*:::" --no-filename > ends     # Find orphaned closures

# Content extraction
sed -n '/!.*::: ##anchor/,/##anchor :::/p' file.js    # Extract section content

# Universal canonical search
rg "##[^:]+"                          # All canonical anchors (regular + sectional)
```

### Basic Discovery
```bash
# All waymarks (regular + sectional)
rg ":::"

# Only section starts
rg "::: ##"

# Only section ends  
rg "^[^:]*##.*:::"

# Both start and end for specific anchor
rg "##docs:@company/auth/architecture"
```

### Advanced Queries
```bash
# Find all sectional todos
rg "todo ::: ##" 

# Find all auth-related sections (start and end)
rg "##.*@company/auth"

# Find only section beginnings for auth
rg "::: ##.*@company/auth" 

# Find only section endings for auth  
rg "##.*@company/auth.*:::"

# All critical sections
rg "!!.*::: ##"
```

### Validation Queries
```bash
# Find potential unclosed sections (section starts)
rg "::: ##" --no-filename | sed 's/.*::: //' > starts.txt

# Find section ends  
rg "##.*:::" --no-filename | sed 's/ :::$//' | sed 's/.*##/##/' > ends.txt

# Compare to find unclosed sections
comm -23 <(sort starts.txt) <(sort ends.txt)
```

## Tool Intelligence

### Section Detection
Tools can automatically identify sectional waymarks:

```javascript
// Regular waymark - no special handling needed
// todo ::: implement OAuth #auth

// Sectional waymark - extract content between markers
// !!important ::: ##security:@company/auth Security policies
// ... tool extracts all content until closure ...
// ##security:@company/auth :::
```

### Content Extraction
```bash
# Extract section content between markers
sed -n '/!!important ::: ##security:@company\/auth/,/##security:@company\/auth :::/p' file.js
```

### Validation Rules
```javascript
// Valid patterns
// todo ::: description                           ✅ (regular waymark)
// !!todo ::: ##anchor description               ✅ (section start)  
// ##anchor :::                                  ✅ (section end, if has opener)

// Invalid patterns  
// ##anchor :::                                  ❌ (orphaned close - no opener)
// !!todo ::: ##anchor ... EOF                  ⚠️  (unclosed section)
```

### Editor Integration
- **Syntax highlighting**: Differentiate section boundaries
- **Code folding**: Collapse/expand sectional content
- **Navigation**: Jump between section start and end
- **Validation**: Real-time detection of unclosed sections

## Benefits

### 1. **Precise Content Boundaries**
Instead of guessing where documentation, configuration, or test coverage ends, sections provide explicit boundaries.

### 2. **Backward Compatibility**
Existing waymarks continue working unchanged. Sections are purely additive functionality.

### 3. **Flexible Granularity**
Any marker can be sectional. Use the marker that best describes the content type.

### 4. **Tool-Friendly**
Simple pattern enables sophisticated tooling:
- Content extraction
- Section validation  
- Cross-reference resolution
- Documentation generation

### 5. **Search Precision**
```bash
# Want just the reference? Search for the anchor
rg "##docs:@company/auth/architecture"

# Want just section starts? 
rg "::: ##docs:@company/auth/architecture"

# Want the full section content?
sed -n '/::.*##docs:@company\/auth\/architecture/,/##docs:@company\/auth\/architecture :::/p'
```

## Integration with Canonical References

Sectional enclosures work perfectly with the canonical reference system:

```javascript
// Service description
// about ::: The @company/auth service handles authentication and authorization #services

// Sectional documentation with typed canonical anchor
// !!important ::: ##docs:@company/auth/security Complete security implementation guide
// 
// # Security Architecture
// Detailed security considerations...
// 
// # Threat Model  
// Identified threats and mitigations...
//
// # Implementation Details
// Step-by-step security implementation...
//
// ##docs:@company/auth/security :::

// References to the sectional content
// todo ::: review security model #see:#docs:@company/auth/security
// fixme ::: implement rate limiting #security #see:#docs:@company/auth/security
```

## Migration Strategy

### Phase 1: Identify Long-Form Content
Look for existing waymarks that reference extensive content:
- Long documentation sections
- Complex configuration blocks  
- Comprehensive test suites
- Multi-part implementations

### Phase 2: Add Closures Selectively
Add closures only where content boundaries add value:
- When referencing the section should include all content
- When content spans many lines or concepts
- When validation of completeness is important

### Phase 3: Tool Enhancement
Update tooling to recognize and leverage sections:
- Content extraction capabilities
- Section validation
- Enhanced navigation
- Improved documentation generation

### Future Tooling Possibilities

**Section Auto-Generation**: `waymark enclose --anchor ##docs:@company/auth` wraps selected content
**LSP Hover Integration**: VS Code shows full section content when hovering over references
**Graph Visualization**: Include sectional content in knowledge graph exports
**Content Validation**: Verify section content matches referenced anchor purpose

## Examples in Practice

### Before (Regular Waymarks)
```javascript
// important ::: see auth security guide for implementation details #security
// (Content boundaries unclear - where does the guide start/end?)
```

### After (Sectional Waymarks)  
```javascript
// !!important ::: ##docs:@company/auth/security Complete security implementation guide
// 
// # Authentication Security Guide
// Comprehensive security considerations...
// [50+ lines of detailed security guidance]
//
// ##docs:@company/auth/security :::

// todo ::: implement rate limiting #see:#docs:@company/auth/security
// (Tools can now extract the entire security guide content)
```

## See Also

- [Canonical Reference System](canonical-refs.md) - Typed canonical anchors
- [Waymark 1.0 Simplification](waymark-1.0-simplification.md) - Core waymark patterns
- [Grammar Extension Points](../docs/syntax/extension-points.md) - Waymark grammar extensions