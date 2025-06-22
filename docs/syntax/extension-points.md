<!-- !tldr ::: ##wm:docs/extension-points Documented grammar extension points for waymark v1.0 -->

# Waymark Grammar Extension Points

The waymark v1.0 grammar defines a solid core with explicit extension points. This document details where and how the grammar can be extended while maintaining compatibility.

## Philosophy

1. **Core is Required**: Base patterns that all tools MUST support
2. **Extensions are Optional**: Alternative patterns that tools MAY support
3. **All Patterns are Valid**: Extensions aren't "wrong", just optional
4. **Greppability is Sacred**: All patterns must remain searchable
5. **Progressive Enhancement**: Tools can support patterns at different levels

## Array Pattern Extensions

### Base Pattern (Required)

All waymark tools MUST support comma-separated arrays with no spaces:

```javascript
// Standard array syntax - universally supported
// todo ::: notify team #cc:@alice,@bob,@charlie
// fixme ::: fix issues #fixes:#123,#456,#789
// notice ::: impacts #affects:#api,#billing,#frontend
```

### Extension Patterns (Optional)

Tools MAY support these alternative array patterns:

#### 1. Bracketed Arrays `[value1 value2 value3]`

**Pattern**: Space-separated values within square brackets  
**Use Case**: Many values, clear boundaries, package lists  
**Example**:
```javascript
// todo ::: add dependencies #deps:[lodash react typescript @types/node]
// test ::: supported platforms #platforms:[linux macos windows android ios]
// config ::: build targets #targets:[esm cjs umd]
```

**Grep**: `rg "#deps:\["`

#### 2. Parentheses Groups `(value1, value2, value3)`

**Pattern**: Comma-separated with optional spaces, parentheses boundaries  
**Use Case**: Logical grouping, human-readable lists  
**Example**:
```javascript
// notice ::: deployment #affects:(api, frontend, mobile)
// todo ::: test cases #scenarios:(happy-path, edge-case, error)
// wip ::: supported regions #regions:(us-east-1, eu-west-1, ap-south-1)
```

**Grep**: `rg "#affects:\("`

#### 3. Quoted Values `"value1, value2, value3"`

**Pattern**: Single string containing comma-separated values  
**Use Case**: Values with spaces, natural language lists  
**Example**:
```javascript
// note ::: sprint goals #goals:"Bug fixes, Performance improvements, New features"
// example ::: keywords #tags:"machine learning, artificial intelligence, deep learning"
// todo ::: error messages #messages:"File not found, Access denied, Invalid input"
```

**Grep**: `rg '#goals:"'`

#### 4. Object-Like `{key1:val1, key2:val2}`

**Pattern**: Key-value pairs within braces  
**Use Case**: Configuration, structured data, settings  
**Example**:
```javascript
// config ::: environment #env:{prod:true, debug:false, region:us-east}
// test ::: browser matrix #browsers:{chrome:latest, firefox:esr, safari:16}
// notice ::: feature flags #flags:{newUI:true, darkMode:false, beta:true}
```

**Grep**: `rg "#env:\{"`

#### 5. Pipeline/Sequence `[step1 -> step2 -> step3]`

**Pattern**: Arrow-separated sequence within brackets  
**Use Case**: Ordered processes, workflows, data flows  
**Example**:
```javascript
// todo ::: deployment flow #workflow:[build -> test -> staging -> production]
// example ::: data pipeline #pipeline:[extract -> transform -> validate -> load]
// note ::: auth flow #sequence:[login -> 2fa -> redirect -> dashboard]
```

**Grep**: `rg "#workflow:\[.*->"`

## Tool Support Levels

Tools can declare their support level for array patterns:

### Level 0: String Treatment
- Treats array value as opaque string
- No parsing, just stores `"@alice,@bob,@charlie"`
- Minimum viable support

### Level 1: Pattern Recognition
- Recognizes it's an array pattern
- Can identify pattern type (bracketed, quoted, etc.)
- No parsing of individual values

### Level 2: Value Parsing
- Parses individual array values
- Handles separators correctly
- Returns array of values

### Level 3: Semantic Understanding
- Understands value types (actors, references, etc.)
- Validates array contents
- Provides rich tooling support

## Implementation Guidelines

### For Tool Authors

1. **Always Support Base**: Comma-separated is non-negotiable
2. **Document Support**: Clearly state which patterns you support
3. **Graceful Degradation**: Unknown patterns should degrade to strings
4. **Preserve Greppability**: Never break basic search

### For Users

1. **Start Simple**: Use base patterns until you need more
2. **Be Consistent**: Pick patterns and stick with them
3. **Document Usage**: Note which patterns your project uses
4. **Consider Tools**: Ensure your tools support your patterns

## Examples in Practice

### Mixed Pattern Usage

```javascript
// Base pattern for simple lists
// todo ::: notify #cc:@alice,@bob

// Bracketed for many items
// todo ::: update packages #deps:[react react-dom typescript eslint prettier jest]

// Object-like for configuration
// config ::: build settings #build:{minify:true, sourcemaps:false, target:es2020}

// Pipeline for processes
// note ::: request flow #flow:[client -> nginx -> app -> database -> cache]

// Quoted for natural language
// example ::: benefits #pros:"Easy to learn, Fast to implement, Well documented"
```

### Tool Support Declaration

```json
{
  "waymarkSupport": {
    "version": "1.0",
    "arrayPatterns": {
      "base": "full",
      "bracketed": "full",
      "parentheses": "parse-only",
      "quoted": "string-only",
      "objectLike": "none",
      "pipeline": "full"
    }
  }
}
```

## Future Extension Points

While array patterns are the first official extension point, the grammar architecture allows for future extensions:

- Alternative signal syntaxes
- Extended anchor patterns  
- Rich tag value types
- Custom marker modifiers

Each would follow the same philosophy: solid core, optional extensions, progressive enhancement.

## See Also

- [Grammar Schema](../packages/schema/src/spec/core/grammar.schema.json)
- [Custom Tags](../docs/usage/patterns/custom-tags.md)
- [v1.0 Simplification](../project/proposals/waymark-1.0-simplification.md)