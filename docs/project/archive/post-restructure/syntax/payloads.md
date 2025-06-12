# Payload Types
<!-- :M: tldr Payload types: bare tokens, parameters, and arrays -->
<!-- :M: syntax Detailed payload type specifications and examples -->

Payloads define what comes after the `:M:` identifier. Waymark supports three payload types.

## Bare Tokens

Simple string identifiers. Most common and readable.

### Format
- Alphanumeric characters, dots, dashes, underscores
- Optional `@` prefix for mentions
- Case-sensitive

### Examples
```javascript
// :M: todo
// :M: v1.2.3
// :M: high-priority
// :M: @alice
// :M: api_endpoint

## Parameterised Tokens

Sometimes a token needs a specific *parameter* (e.g., an issue number or RFC).  Append the parameter in parentheses – the combination is still treated as **one token**.

### Format
- `marker(parameter)` – no spaces inside parentheses
- Use a hash (`#`) or hyphen (`-`) as the internal delimiter if needed (`issue#4`, not `issue/4`)

### Examples
```javascript
// :M: gh(issue#4)     // links to GitHub issue 4
// :M: rfc(9110)       // references RFC 9110
// :M: feature(flag-x) // feature flag
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
// :M: blocked(issue:4)           // blocked by issue
// :M: depends(auth-service)      // simple dependency
// :M: config(timeout:30,retry:3) // multiple params
// :M: todo(assign:@alice,priority:high) // task params
```

### Common Parameter Patterns
```javascript
// Work item parameters
// :M: todo(bug:auth-timeout)      // bug specification
// :M: todo(epic:user-onboarding)  // epic grouping
// :M: todo(sprint:next)           // sprint planning

// Relationship parameters  
// :M: blocked(issue:AUTH-123)     // external blocker
// :M: depends(service:redis)      // service dependency
// :M: emits(event:user-created)   // event publishing
```

## Brackets `[]` - Arrays

Used for multiple values. Optional for single values.

### Format
- `marker:[value1,value2]` - array of values
- `marker:value` - single value (brackets optional)
- Values can be identifiers, mentions, or quoted strings

### Examples
```javascript
// :M: blocked:[4,7,12]           // multiple blockers
// :M: tags:[auth,api,security]   // multiple tags
// :M: owner:[@alice,@bob]        // multiple owners
// :M: files:['auth.js','api.js'] // quoted paths
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
// :M: @alice                 // standalone mention
// :M: owner:@alice           // ownership mention
// :M: assign:@bob            // assignment
// :M: team:@security         // team mention

// Multiple mentions
// :M: reviewers:[@alice,@bob]
// :M: cc:[@alice,@security-team]
```

## Quoting Rules

Quotes are used for strings with special characters:

### Simple Values (No Quotes)
```javascript
// :M: priority:high
// :M: version(2.0.1)
// :M: owner:@alice
```

### Quoted Values (Required for Special Characters)  
```javascript
// Single quotes for literals
// :M: match('user-123')              // string match
// :M: path('src/data migration.sql') // spaces
// :M: message('Can\'t connect')      // escaped quote

// Arrays with quoted elements
// :M: files:['auth.js','lib/utils.js']
// :M: matches:['user-123','admin-456']
```

## Marker Combinations

Multiple markers are separated by commas:

```javascript
// Simple combination
// :M: todo,security

// With parameters
// :M: todo(priority:high),security(severity:critical)

// Mixed styles
// :M: todo,owner:@alice,priority:high
```

**Rule**: If `todo` appears, it must be the first marker.