# Payload Types
<!-- :A: tldr Three payload types: bare tokens, JSON objects, and arrays -->
<!-- :A: notation Detailed payload type specifications and examples -->

Payloads define what comes after the `:A:` sigil. Grepa supports three payload types.

## Bare Tokens

Simple string identifiers. Most common and readable.

### Format
- Alphanumeric characters, dots, dashes, underscores
- Optional `@` prefix for mentions
- Case-sensitive

### Examples
```javascript
// :A: todo
// :A: v1.2.3
// :A: high-priority
// :A: @alice
// :A: api_endpoint

## Parameterised Tokens

Sometimes a token needs a specific *parameter* (e.g., an issue number or RFC).  Append the parameter in parentheses – the combination is still treated as **one token**.

### Format
- `marker(parameter)` – no spaces inside parentheses
- Use a hash (`#`) or hyphen (`-`) as the internal delimiter if needed (`issue#4`, not `issue/4`)

### Examples
```javascript
// :A: gh(issue#4)     // links to GitHub issue 4
// :A: rfc(9110)       // references RFC 9110
// :A: feature(flag-x) // feature flag
```

### When to use
- Linking to external trackers (issues, PRs, tickets)
- Pointing at standards or documents (RFCs, ADRs)
- Feature toggles / AB-tests (`abtest(group-a)`) 
```

## Parentheses `()` - Parameters

Used for structured parameters and arguments associated with markers.

### Format
- `marker(param:value)` - single parameter
- `marker(p1:v1,p2:v2)` - multiple parameters
- Parameters use colon syntax internally

### Examples
```javascript
// :A: blocked(issue:4)           // blocked by issue
// :A: depends(auth-service)      // simple dependency
// :A: config(timeout:30,retry:3) // multiple params
// :A: todo(assign:@alice,priority:high) // task params
```

### Common Parameter Patterns
```javascript
// Work item parameters
// :A: todo(bug:auth-timeout)      // bug specification
// :A: todo(epic:user-onboarding)  // epic grouping
// :A: todo(sprint:next)           // sprint planning

// Relationship parameters  
// :A: blocked(issue:AUTH-123)     // external blocker
// :A: depends(service:redis)      // service dependency
// :A: emits(event:user-created)   // event publishing
```

## Brackets `[]` - Arrays

Used for multiple values. Optional for single values.

### Format
- `marker:[value1,value2]` - array of values
- `marker:value` - single value (brackets optional)
- Values can be identifiers, mentions, or quoted strings

### Examples
```javascript
// :A: blocked:[4,7,12]           // multiple blockers
// :A: tags:[auth,api,security]   // multiple tags
// :A: owner:[@alice,@bob]        // multiple owners
// :A: files:['auth.js','api.js'] // quoted paths
```

## Universal Parameter Groups

Parameters are organized into six semantic families that work with any marker:

| Group | Purpose | Examples |
|-------|---------|----------|
| **mention** | People/entities | `owner:@alice`, `assign:@bob`, `team:@frontend` |
| **relation** | Links/references | `parent:epic-123`, `depends:auth-svc`, `path:src/auth.js` |
| **workflow** | Coordination | `blocked:[4,7]`, `blocking:12`, `reason:compliance` |
| **priority** | Importance/risk | `priority:high`, `severity:critical`, `complexity:high` |
| **lifecycle** | Time/state | `since:1.2.0`, `until:2.0.0`, `status:in-progress` |
| **scope** | Environment | `env:prod`, `platform:ios`, `region:us-east` |

### Mention Parameters
```javascript
// Direct mentions
// :A: @alice                 // standalone mention
// :A: owner:@alice           // ownership mention
// :A: assign:@bob            // assignment
// :A: team:@security         // team mention

// Multiple mentions
// :A: reviewers:[@alice,@bob]
// :A: cc:[@alice,@security-team]
```

## Quoting Rules

Quotes are used for strings with special characters:

### Simple Values (No Quotes)
```javascript
// :A: priority:high
// :A: version(2.0.1)
// :A: owner:@alice
```

### Quoted Values (Required for Special Characters)  
```javascript
// Single quotes for literals
// :A: match('user-123')              // string match
// :A: path('src/data migration.sql') // spaces
// :A: message('Can\'t connect')      // escaped quote

// Arrays with quoted elements
// :A: files:['auth.js','lib/utils.js']
// :A: matches:['user-123','admin-456']
```

## Marker Combinations

Multiple markers are separated by commas:

```javascript
// Simple combination
// :A: todo,security

// With parameters
// :A: todo(priority:high),security(severity:critical)

// Mixed styles
// :A: todo,owner:@alice,priority:high
```

**Rule**: If `todo` appears, it must be the first marker.