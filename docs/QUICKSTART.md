<!-- tldr ::: 5-minute guide to get started with waymarks -->
# Waymark Quick Start Guide

Get started with waymarks in 5 minutes. This guide shows you the essentials.

## What is a Waymark?

A **waymark** is a searchable comment that marks important spots in your code. Like breadcrumbs in a forest, they help you (and AI agents) navigate your codebase.

```javascript
// todo ::: implement error handling
// fixme ::: memory leak when user disconnects
// tldr ::: handles websocket connections
```

The `:::` sign makes waymarks instantly searchable with grep.

## TLDR: File Summaries

Every important file should start with a `tldr` waymark:

```javascript
// tldr ::: user authentication service handling OAuth flows #auth #api
```

Best practices for TLDR waymarks:
- Place at the very top of the file
- Keep descriptions under 80 characters
- Add relevant tags (#api, #component, #tooling)
- Consider canonical anchors for stable references:
  ```javascript
  // tldr ::: ##auth/service main authentication service #auth
  ```

## Your First Waymark

### 1. Add a Waymark

Add waymarks to mark important code:

```javascript
// tldr ::: user authentication service
class AuthService {
  // todo ::: add rate limiting
  async login(email, password) {
    // important ::: passwords are hashed with bcrypt
    const user = await db.users.findByEmail(email);
    
    // fixme ::: timing attack vulnerability
    if (!user || !await bcrypt.compare(password, user.hash)) {
      throw new Error('Invalid credentials');
    }
    
    return generateToken(user);
  }
}
```

### 2. Search Your Code

Find waymarks with ripgrep:

```bash
# Find all waymarks
rg ":::"

# Find specific markers
rg "todo :::"
rg "fixme :::"

# Find with context
rg -C2 "fixme :::"  # Shows 2 lines before/after
```

## Essential Patterns

### Work Items

```javascript
// todo ::: implement feature
// fixme ::: bug to fix
// refactor ::: clean up this mess
// test ::: add edge case tests
```

### Priority with Signals

```javascript
// !!todo ::: critical security fix      // P0 - Critical
// !todo ::: important feature           // P1 - High priority
// todo ::: regular task                 // P2 - Normal
// todo ::: nice to have #p3             // P3 - Low (rare)
```

### Assignment with Actors

```javascript
// todo ::: @alice implement OAuth
// review ::: @bob check security implications
// fixme ::: @charlie fix race condition
```

### Tags for Context

```javascript
// Simple tags
// todo ::: add validation #backend #security

// Issue references (always include #)
// fixme ::: null pointer error #fixes:#123

// Multiple owners
// todo ::: implement RBAC #owner:@alice,@bob
```

## Branch Work with `*`

Mark work that MUST be done before merging:

```javascript
// *todo ::: fix failing tests
// *fixme ::: remove debug code
// *!todo ::: critical bug blocking PR
```

## Stable Reference Points

Create anchors for important code locations:

```javascript
// about ::: ##auth/login Main login flow
class LoginController {
  // ... code ...
}

// Elsewhere in the codebase:
// todo ::: update error handling #refs:#auth/login
```

## Common Tag Patterns

### Work Relationships
- `#fixes:#123` - Fixes an issue
- `#blocks:#456` - Blocks other work
- `#depends:#789` - Has dependencies

### References
- `#pr:#234` - Pull request reference
- `#docs:/path/to/file.md` - Documentation link
- `#link:https://example.com` - External link

### Context
- `#affects:#billing,#auth` - Systems impacted
- `#cc:@security,@ops` - Keep informed

## Quick Search Reference

```bash
# Find by priority
rg "!!todo"           # Critical todos
rg "!todo"            # Important todos
rg "\*todo"           # Branch work

# Find by person
rg "@alice"           # All Alice's items
rg "#owner:@alice"    # Alice owns

# Find by issue
rg "#123\b"           # References to issue 123
rg "#fixes:#\d+"      # All fixes

# Find by tag
rg "#security"        # Security-related
rg "#backend"         # Backend code
```

## Markdown Files

Use HTML comments in markdown so waymarks are searchable but not rendered:

```markdown
<!-- tldr ::: API documentation for auth service -->
<!-- todo ::: @alice add OAuth examples -->

# Authentication API

This guide covers authentication...
```

## Waymark Tools

Check and maintain waymark quality:

```bash
# Audit all waymarks for v1.0 compliance
node scripts/audit-waymarks.js

# Check TLDR quality
node scripts/tldr-check.js
node scripts/tldr-check.js --require tags  # Ensure TLDRs have tags

# Auto-tag violations for fixing
node scripts/blaze.js --dry-run
```

## Next Steps

1. **Add your first waymark**: Start with `// tldr :::` at the top of a file
2. **Search your code**: Try `rg ":::"` to see all waymarks
3. **Adopt gradually**: Begin with `todo` and `fixme`, add more as needed
4. **Be consistent**: Pick patterns and stick with them

## Tips

- **Start simple**: Just `todo :::` and `fixme :::` go a long way
- **Be specific**: "fix auth bug" is better than "fix bug"
- **Clean as you go**: Remove completed waymarks
- **Think grep-first**: If you can't grep it, it's not useful

## Learn More

- [Syntax Overview](./syntax/README.md) - Complete syntax guide
- [Full Specification](./syntax/SPEC.md) - Detailed reference
- [Search Patterns](./usage/search/ripgrep-patterns.md) - Advanced searching

Remember: Waymarks are breadcrumbs, not novels. Keep them short, searchable, and actionable.