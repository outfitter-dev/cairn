# Custom Anchor Patterns

While `:ga:` (grep-anchor) is the recommended default, you can define your own anchor pattern that makes sense for your team or project.

## Why Custom Anchors?

Sometimes teams want their own identity:
- **Company branding**: `:acme:` for Acme Corp
- **Project identity**: `:proj:` for a specific project  
- **Avoiding collisions**: If `:ga:` is already used in your codebase
- **Legacy systems**: Gradual migration from existing markers

## How to Choose an Anchor

Good anchors are:
- **Short**: 2-4 characters is ideal
- **Unique**: Unlikely to appear in normal code or comments
- **Memorable**: Easy for your team to remember
- **Consistent**: Same pattern as `:ga:` (colon-text-colon)

### Good Examples
```javascript
// :ga:    - grep-anchor (default)
// :td:    - tech debt (if that's your main focus)
// :ai:    - AI instructions (for AI-first codebases)
// :proj:  - project-specific
// :acme:  - company name
// :v2:    - version-specific migration
```

### Bad Examples
```javascript
// :TODO:  - Too similar to existing convention
// :x:     - Too short, likely to collide
// :this-is-my-anchor: - Too long
// ::      - Not meaningful
// :123:   - Not memorable
```

## Implementation

### Step 1: Choose Your Anchor
Pick one anchor for your entire project:

```javascript
// If your company is "TechCorp", you might choose:
// :tc:todo implement validation
// :tc:security check permissions
```

### Step 2: Document It
Add to your README.md:

```markdown
## Code Markers

This project uses `:tc:` markers (TechCorp anchors) for code navigation.

Search all markers: `rg ":tc:"`
```

### Step 3: Configure Tools
Update your tooling to use your custom anchor:

```bash
# .bashrc or .zshrc
alias find-anchors='rg ":tc:"'
alias find-todos='rg ":tc:todo"'
```

```json
// .vscode/settings.json
{
  "search.quickOpen.includePattern": ":tc:",
  "todo-tree.regex.regex": ":tc:(\\w+)"
}
```

## Monorepo Strategies

In monorepos, **use tags instead of different anchors**:

### ❌ Don't: Multiple Anchors
```javascript
// In auth service
// :auth:todo implement OAuth

// In web app  
// :web:todo add loading state

// In shared lib
// :lib:todo add types
```

This makes searching across the monorepo difficult.

### ✅ Do: One Anchor + Tags
```javascript
// In auth service
// :ga:auth,todo implement OAuth

// In web app
// :ga:web,todo add loading state  

// In shared lib
// :ga:lib,todo add types
```

Now you can search:
```bash
rg ":ga:"          # All markers
rg ":ga:auth"      # Just auth service
rg ":ga:todo"      # All todos
rg ":ga:web,todo"  # Web app todos
```

## Migration Guide

If you need to change anchors:

### From Nothing to Custom
```bash
# Start adding your anchor to existing TODOs
sed -i 's/TODO:/TODO :tc:/g' **/*.js

# Gradually move to pure anchors
sed -i 's/TODO :tc:/:tc:todo/g' **/*.js
```

### From :ga: to Custom
```bash
# Simple replacement
find . -type f -name "*.js" -exec sed -i 's/:ga:/:tc:/g' {} +

# Verify the change
rg ":ga:" # Should return nothing
rg ":tc:" # Should show all markers
```

### From Custom to :ga:
```bash
# If you decide to standardize on :ga:
find . -type f -name "*.js" -exec sed -i 's/:tc:/:ga:/g' {} +
```

## Team Adoption

### For New Projects
1. Discuss as a team
2. Document in README
3. Add to onboarding docs
4. Include in PR template

### For Existing Projects
1. Pick a migration strategy
2. Update one file as example
3. Share with team
4. Migrate gradually

## Common Patterns

### Company-Wide Standard
Large organizations might standardize:
```
:ga:   - Default for all projects
:goog: - Google's internal marker
:meta: - Meta's internal marker
```

### Domain-Specific
```
:ml:   - Machine learning projects
:ops:  - DevOps tooling
:sec:  - Security-focused codebases
```

### Project-Specific
```
:app:  - Mobile app
:api:  - Backend API
:web:  - Web frontend
```

## Remember

- **One anchor per codebase** - Consistency is key
- **Document your choice** - Make it discoverable
- **Use tags for namespacing** - Not different anchors
- **Keep it simple** - The goal is discoverability

Whether you use `:ga:` or `:yourteam:`, the important thing is that your code becomes more navigable for both humans and AI agents.