<!-- tldr ::: delimiter usage and semantics in waymark syntax -->

# Waymark Delimiters

Delimiters in waymark syntax provide structure and meaning. Each delimiter has a specific purpose that enables clear, searchable, and parseable waymarks.

## The `:::` Sigil

The three-colon sigil is the heart of waymark syntax, separating the marker from the content:

```javascript
// marker ::: content
// todo ::: implement authentication
// note ::: this assumes Redis is available
```

### Sigil Rules

1. **Exactly three colons** - Not two, not four
2. **One space before** (when marker present) - `todo ::: content`
3. **One space after** - Always exactly one ASCII space
4. **Can stand alone** - `// ::: just a note` (no marker)

### Why Three Colons?

- **Visual clarity** - Easy to spot when scanning code
- **Fast typing** - Quick triple-tap pattern
- **Grep-friendly** - Unique pattern unlikely in regular code
- **Searchable** - `rg ":::"` finds all waymarks instantly

## The `#` Hash - Tags and References

The hash symbol introduces tags and references in the prose section:

### Simple Tags
Classify and categorize waymarks:

```javascript
// todo ::: implement caching #backend #performance
// fixme ::: memory leak #critical #memory
// note ::: uses experimental API #experimental
```

### Relational Tags
Express relationships with `#key:value` syntax:

```javascript
// todo ::: implement feature #fixes:#123
// fixme ::: resolve bug #blocks:#456,#789
// review ::: security audit #owner:@alice
// note ::: migration required #affects:#billing,#payments
```

### Tag Rules

1. **Always include `#` in references** - `#fixes:#123` not `#fixes:123`
2. **No spaces in arrays** - `#cc:@alice,@bob` not `#cc:@alice, @bob`
3. **Tags appear in prose** - After the `:::` sigil
4. **Case sensitive** - `#API` differs from `#api`

## The `@` At - Actors and Mentions

The at symbol identifies people, teams, and agents:

### As Assignment (First Token)
```javascript
// todo ::: @alice implement feature      // Assigned to alice
// review ::: @security-team audit code   // Assigned to team
```

### As Mention (In Prose)
```javascript
// note ::: discussed with @bob          // References bob
// todo ::: @alice coordinate with @dave  // Assigned to alice, mentions dave
```

### In Tags
```javascript
// todo ::: implement feature #owner:@alice
// notice ::: breaking change #cc:@frontend,@mobile
```

## The `##` Double-Hash - Anchors

Anchors provide stable reference points in code:

### Anchor Definition (First Token)
```javascript
// about ::: ##auth/login Main authentication entry point
// note ::: ##payment/stripe Stripe payment integration
```

### Anchor Reference (In Tags)
```javascript
// todo ::: update logic #refs:#auth/login
// fixme ::: bug in handler #for:#payment/stripe
```

### Anchor Rules

1. **Definition must be first token** - `// about ::: ##name description`
2. **References use single `#`** - `#refs:#auth/login`
3. **Hierarchical naming** - `##module/component/feature`
4. **Stable identifiers** - Don't change anchor names

## Special Characters in Values

### Simple Values (No Quotes)
<!-- todo ::: Examples below use deprecated `#priority:high`; replace with signal-based priority (`!todo` / `!!todo`) per v1.0 spec #wm:fix -->
Most values need no special handling:

```javascript
// todo ::: task #priority:high
// note ::: requires #version:1.2.3
// fixme ::: bug #issue:ABC-123
```

### Complex Values (Quotes Required)
Use quotes for values with spaces or special characters:

```javascript
// note ::: #message:"Can't connect to database"
// todo ::: #path:"src/data migration.sql"
// review ::: #reason:"waiting for approval"
```

## Delimiter Combinations

Understanding how delimiters work together:

### Standard Pattern
```javascript
// [marker] ::: [@actor|##anchor] prose #tags
// todo ::: @alice implement caching #backend #perf
```

### With Signals
```javascript
// !todo ::: @bob fix critical bug #fixes:#123
// *fixme ::: memory leak blocking PR #blocks:#456
```

### Complex Examples
<!-- todo ::: Example below uses deprecated `#priority:high`; update to signals #wm:fix -->
```javascript
// !!notice ::: ##api/v2 Breaking change #affects:#frontend,#mobile
// review ::: @security audit endpoints #pr:#234 #priority:high
// todo ::: @alice implement with @bob #depends:#auth-service
```

## What NOT to Do

### Don't Use Dots for Structure
```javascript
// ❌ Wrong - dots are for literals only
// todo ::: implement user.auth.login

// ✅ Correct - use descriptive prose
// todo ::: implement user login authentication
```

### Don't Mix Delimiter Meanings
<!-- todo ::: Correct example below recommends deprecated `#priority:high` tag; adjust to signals in v1.0 #wm:fix -->
```javascript
// ❌ Wrong - @ not for tags
// todo ::: implement feature @high-priority

// ✅ Correct - use appropriate syntax
// todo ::: implement feature #priority:high
```

### Don't Forget Spaces
```javascript
// ❌ Wrong - missing spaces
// todo:::implement feature
// todo ::: implement #cc:@alice,@bob,@charlie

// ✅ Correct - proper spacing
// todo ::: implement feature
// todo ::: implement #cc:@alice,@bob,@charlie
```

## Search Patterns

Leverage delimiters for powerful searches:

```bash
# Find all waymarks
rg ":::"

# Find assignments to alice
rg ":::\s*@alice"

# Find issue references
rg "#fixes:#\d+"

# Find anchor definitions
rg ":::\s*##"

# Find high priority items
<!-- todo ::: Search pattern relies on deprecated `#priority:high`; update grep example to `!!todo` and `!todo` search patterns #wm:fix -->
rg "#priority:high"

# Find tags related to auth
rg "#auth"
```

## Best Practices

### 1. Consistent Spacing
Always use exactly one space around `:::`:

```javascript
// ✅ Correct
// todo ::: implement feature

// ❌ Wrong
// todo:::implement feature
// todo  :::  implement feature
```

### 2. Choose the Right Delimiter
Each delimiter has a specific purpose:

- `:::` - Separates marker from content
- `#` - Introduces tags and classifications
- `@` - Identifies actors (people/teams/agents)
- `##` - Defines stable anchor points

### 3. Keep References Searchable
Always include delimiters in references:

```javascript
// ✅ Searchable
// todo ::: fix bug #fixes:#123

// ❌ Less searchable
// todo ::: fix bug fixes:123
```

### 4. Use Quotes Sparingly
Only quote when necessary:

```javascript
// Simple values - no quotes
// note ::: #version:1.2.3 #status:active

// Complex values - quotes required
// error ::: #message:"Connection refused: timeout"
```

## Summary

Waymark delimiters create a simple but powerful syntax:

- `:::` - The core sigil that makes waymarks greppable
- `#` - Tags for classification and relationships
- `@` - Actors for people and assignments  
- `##` - Anchors for stable code references

Together, they enable a breadcrumb system that's both human-readable and tool-friendly.

## See Also

- [Markers](./markers.md) - Core waymark markers
- [Signals](./signals.md) - Priority and scope modifiers
- [Actors](./actors.md) - Assignment system
- [Tags](./tags/) - Classification patterns
- [Syntax Specification](./SPEC.md) - Complete v1.0 specification