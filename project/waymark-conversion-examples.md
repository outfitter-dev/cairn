<!-- tldr ::: comprehensive waymark conversion examples for v1.0 syntax migration -->

# Waymark Conversion Examples

This document provides conversion examples for migrating existing waymarks to the Waymark v1.0 syntax based on the [simplification proposal](./proposals/waymark-1.0-simplification.md).

## Core Waymark Types (v1.0)

- **Top-level**: `tldr`
- **Work**: `todo`, `fixme`, `refactor`, `review`, `wip`, `stub`, `temp`, `done`, `deprecated`, `test`
- **Info**: `note`, `idea`, `about`, `example`
- **Attention**: `notice`, `risk`, `important`

## Deprecated Markers

**High frequency:** `alert` (→ `notice`), `fix` (→ `fixme`), `always` (→ `important`), `check` (→ `todo`), `must` (→ `!notice`), `ci` (→ appropriate type), `needs` (→ `todo`), `blocked` (→ `todo`)

**Security/Performance:** `sec` (→ `[!!,!]risk`), `audit` (→ `important`), `perf` (→ `todo`), `hotpath` (→ `todo` + `#hotpath`)

**Status/Lifecycle:** `draft` (→ `wip`), `new` (→ `todo`), `hold` (→ `note`), `shipped` (→ `note`), `cleanup` (→ `temp`), `hack` (→ `temp`)

---

## 1. Basic Properties → Signals and Tags

### Current:
```javascript
// todo ::: priority:high implement OAuth
// fix ::: memory leak in auth service
// todo ::: @alice implement caching priority:high
```

### v1.0 Conversion:

**Recommended - Use Signals for Priority:**
```javascript
// !todo ::: implement OAuth              // P1 - high priority
// fixme ::: memory leak in auth service  // fix → fixme
// !todo ::: @alice implement caching     // P1 - high priority
```

**Alternative - Explicit Low Priority Only:**
```javascript
// !todo ::: implement OAuth              // P1 - high
// fixme ::: memory leak in auth service
// todo ::: @alice implement caching #p3  // P3 - explicit low (rare)
```

**NOT RECOMMENDED - Old Property Syntax:**
```javascript
// DON'T USE: todo ::: implement OAuth #priority:high  // We don't use this anymore
```

---

## 2. Reference Values - Always Include #

### Current:
```javascript
// todo ::: implement auth flow fixes:234      // Missing # in value
// fix ::: waiting on API changes depends:123   // Missing # in value
// fix ::: payment validation fixes:#567        // Correct
```

### v1.0 Conversion:

**Required - Always Include # in References:**
```javascript
// todo ::: implement auth flow #fixes:#234
// fixme ::: waiting on API changes #depends:#123  // fix → fixme
// fixme ::: payment validation #fixes:#567
```

**With Arrays (comma-separated, no spaces):**
```javascript
// todo ::: implement feature #depends:#123,#456,#789
// fixme ::: payment bug #blocks:#234,#567
// notice ::: deployment #affects:#billing,#auth,#api
```

---

## 3. Legacy +tag Syntax → Simple Tags

### Current:
```javascript
// todo ::: implement caching +api +backend
// fix ::: button contrast issue +ui +frontend +a11y
// refactor ::: move shared types +ui-kit +types
// todo ::: update all services for new auth +security +breaking-change
```

### v1.0 Conversion:

**Recommended - Simple Tags:**
```javascript
// todo ::: implement caching #api #backend
// fixme ::: button contrast issue #ui #frontend #a11y  // fix → fixme
// refactor ::: move shared types #ui-kit #types
// todo ::: update all services for new auth #security #breaking-change
```

**NOT RECOMMENDED - Hierarchical Tags:**
```javascript
// DON'T USE: todo ::: implement auth #auth/oauth/google  // Too complex
// USE THIS: todo ::: implement auth #auth #oauth #google  // Simple and clear
```

---

## 4. Branch References - Single Values Only

### Current:
```javascript
// todo ::: implement OAuth flow branch:feature/auth
// fix ::: payment validation branch:feature/payments fixes:#567
// !!fix ::: critical vulnerability branch:hotfix/security-patch
// note ::: feature freeze in effect branch:release/v2.1
```

### v1.0 Conversion:

**Required Format:**
```javascript
// todo ::: implement OAuth flow #branch:feature/auth
// fixme ::: payment validation #branch:feature/payments #fixes:#567
// !!fixme ::: critical vulnerability #branch:hotfix/security-patch
// note ::: feature freeze in effect #branch:release/v2.1
```

**Note:** Branch references don't support arrays (unlike #owner:, #depends:, etc.):
```javascript
// ✅ CORRECT: #branch:feature/auth
// ❌ WRONG: #branch:main,develop  // Not supported
```

---

## 5. Status Properties → Tags or Signals

### Current:
```javascript
// fix ::: bug in payment status:blocked
// note ::: production ready status:stable  
// todo ::: implement feature priority:high
```

### v1.0 Conversion:

**Recommended:**
```javascript
// fixme ::: bug in payment #blocked      // Simple tag
// note ::: production ready #stable       // Simple tag
// !todo ::: implement feature             // Use signal for priority
```

**Alternative with Relational Tags:**
```javascript
// fixme ::: bug in payment #blocked:#456   // Blocked by specific issue
// note ::: production ready #stable
// !todo ::: implement feature #owner:@alice // Assigned work
```

---

## 6. Deprecated Markers → v1.0 Core Types

### Current:
```javascript
// alert ::: security warning              // 'alert' is deprecated
// fix ::: bug in payment logic           // 'fix' is deprecated  
// check ::: verify user permissions      // 'check' is deprecated
// cleanup ::: remove debug logging       // 'cleanup' is deprecated
```

### v1.0 Conversion:

**Required Conversions:**
```javascript
// notice ::: security warning            // alert → notice
// fixme ::: bug in payment logic        // fix → fixme
// todo ::: verify user permissions #verify  // check → todo + tag
// temp ::: remove debug logging #cleanup    // cleanup → temp + tag
```

**More Examples:**
```javascript
// Old: must ::: validate input          → New: !notice ::: validate input
// Old: sec ::: check permissions        → New: !!risk ::: check permissions #security
// Old: draft ::: initial implementation  → New: wip ::: initial implementation #draft
// Old: perf ::: optimize query          → New: todo ::: optimize query #perf
```

---

## 7. Signal Combinations - Position First

### Current:
```javascript
// *!todo ::: critical - must fix before merge
// !!alert ::: patch data-loss vulnerability
// ?note ::: does pagination handle zero items?
// -todo ::: obsolete after migrating to v5 SDK
```

### v1.0 Conversion:

**Correct Signal Order (position then intensity):**
```javascript
// *!todo ::: critical - must fix before merge       // Star + bang
// !!notice ::: patch data-loss vulnerability        // alert → notice
// ?note ::: does pagination handle zero items?      // Question signal
// -temp ::: obsolete after migrating to v5 SDK      // Tombstone signal
```

**Signal Meanings:**
- `*` = Branch-scoped (must finish before PR merge)
- `!` / `!!` = Important → Critical
- `?` / `??` = Needs clarification → Highly uncertain
- `-` / `--` = Mark for removal → Remove ASAP

---

## 8. Arrays for Relationships

### Current:
```javascript
// todo ::: implement feature owner:@alice owner:@bob
// fix ::: bug blocking PAY-45 blocking UI-77
// notice ::: affects billing affects payments
```

### v1.0 Conversion:

**Use Comma-Separated Arrays (no spaces):**
```javascript
// todo ::: implement feature #owner:@alice,@bob
// fixme ::: bug #blocks:#PAY-45,#UI-77
// notice ::: deployment #affects:#billing,#payments,#auth
```

**Array Parsing Rules:**
- Values are comma-separated
- Each value parsed independently
- Follow standard conventions: tags with `#`, actors with `@`

**Tags That Support Arrays:**
- `#owner:@alice,@bob`
- `#cc:@team1,@team2`
- `#depends:#123,#456`
- `#blocks:#789,#234`
- `#affects:#system1,#system2`

---

## 9. Anchor System for Stable References

### Current:
```javascript
// about ::: Main authentication module
// todo ::: fix bug in auth (see line 234)
// note ::: related to payment processing
```

### v1.0 Conversion with Anchors:

**Define Anchors (use ##):**
```javascript
// about ::: ##auth/oauth/google Google OAuth implementation #auth #security
// about ::: ##payment/stripe-webhook Stripe webhook handler #payments #critical
// tldr ::: ##app/init Main application entry point #entrypoint
```

**Reference Anchors (use #):**
```javascript
// todo ::: fix refresh token bug #refs:#auth/oauth/google
// test ::: webhook retry logic #for:#payment/stripe-webhook
// fixme ::: race condition on startup #see:#app/init
```

**Rules:**
- Each `##name` must be unique
- Hierarchies allowed for anchors
- Reference with normal `#`

---

## 10. Attribute Tags for Code Characteristics

### Current:
```javascript
// todo ::: optimize hot code path
// important ::: security boundary - validate input
// note ::: this is the main entry point
```

### v1.0 Conversion with Attribute Tags:

**Standalone Shortcuts (quick marking):**
```javascript
// todo ::: optimize JSON parser #hotpath
// important ::: validate all user input #boundary #sec:input
// tldr ::: ##app/init initialize system #entrypoint
```

**Category Form (precision):**
```javascript
// todo ::: optimize parser #perf:hotpath,critical
// important ::: input validation #sec:boundary,input,sanitize
// about ::: ##state/store global state #arch:state,singleton
```

**Core Categories:**
- Performance: `#perf:hotpath`, `#critical-path`, `#bottleneck`
- Architecture: `#arch:entrypoint`, `#boundary`, `#singleton`
- Security: `#sec:boundary`, `#sec:input`, `#sec:auth`
- Data: `#data:source`, `#data:transform`, `#data:sensitive`

---

## 11. AI Agent Assignments

### Current:
```javascript
// todo ::: @agent add error handling for network failures
// refactor ::: @agent extract this into a utility function  
// note ::: @agent database schema changes require migration
```

### v1.0 Format (unchanged):

```javascript
// todo ::: @agent add error handling for network failures
// refactor ::: @agent extract this into a utility function
// note ::: @agent database schema changes require migration
```

**Actor placement is flexible:**
```javascript
// todo ::: @alice implement caching         // Actor first
// todo ::: implement caching #owner:@alice  // Actor in tag
// review ::: @security audit this #cc:@ops  // Both positions
```

## 12. Common Migration Patterns

### Deprecated Marker Quick Reference:

| Old | New | Example |
|-----|-----|------|
| `alert` | `notice` | `// notice ::: security warning` |
| `fix` | `fixme` | `// fixme ::: bug in payment` |
| `always` | `important` | `// important ::: critical invariant` |
| `check` | `todo` + `#verify` | `// todo ::: verify permissions #verify` |
| `must` | `!notice` | `// !notice ::: required validation` |
| `sec` | `[!!,!]risk` + `#security` | `// !!risk ::: SQL injection #security` |
| `perf` | `todo` + `#perf` | `// todo ::: optimize query #perf` |
| `cleanup` | `temp` + `#cleanup` | `// temp ::: remove logs #cleanup` |

### Priority Migration:

**Old property syntax → New signal syntax:**
```javascript
// OLD: todo ::: implement feature priority:critical
// NEW: !!todo ::: implement feature              // P0 - critical

// OLD: todo ::: implement feature priority:high  
// NEW: !todo ::: implement feature               // P1 - high

// OLD: todo ::: implement feature priority:medium
// NEW: todo ::: implement feature                // P2 - normal (default)

// OLD: todo ::: implement feature priority:low
// NEW: todo ::: nice to have #p3                 // P3 - explicit low (rare)
```

### Tag Syntax Migration:

**Old +tag syntax → New #tag syntax:**
```javascript
// OLD: todo ::: implement feature +backend +api
// NEW: todo ::: implement feature #backend #api

// OLD: fix ::: UI bug +frontend +urgent +a11y
// NEW: fixme ::: UI bug #frontend #a11y         // Use signals for urgency
```

**Avoid hierarchical tags:**
```javascript
// DON'T USE: todo ::: implement #auth/oauth/google
// USE THIS: todo ::: implement #auth #oauth #google
```

## 13. Search Pattern Examples

### Finding Work by Priority:
```bash
# Critical todos (P0)
rg "!!todo"

# High priority todos (P1)  
rg "!todo"

# All todos with explicit low priority
rg "todo.*#p3"

# Branch-scoped work
rg "\*\w+\s+:::"
```

### Finding References:
```bash
# All references to issue 123
rg "#123\b"

# All fixes
rg "#fixes:#\d+"

# Work blocked by issues
rg "#blocked:#\d+"
```

### Finding by Attributes:
```bash
# All hotpaths (any form)
rg "#(perf:)?hotpath"

# All security boundaries
rg "#(sec:)?boundary"

# Performance category
rg "#perf:"
```

---

## 14. Complete Migration Examples

### Complex Example 1 - Feature Implementation:

**Before:**
```javascript
// stub ::: OAuth implementation
// todo ::: @alice implement OAuth priority:high status:in-progress
// check ::: verify token refresh works
// must ::: security review before deploy
```

**After (v1.0):**
```javascript
// stub ::: OAuth implementation           // 'stub' is v1.0 core marker
// !todo ::: @alice implement OAuth #in-progress
// todo ::: verify token refresh works #verify
// !notice ::: security review required before deploy
```

### Complex Example 2 - Bug Fix with Dependencies:

**Before:**
```javascript
// fix ::: memory leak in auth service fixes:234 depends:123
// blocked ::: waiting on API changes
// perf ::: this is a hotpath - optimize carefully
// sec ::: validate all inputs
```

**After (v1.0):**
```javascript
// fixme ::: memory leak in auth service #fixes:#234 #depends:#123
// todo ::: waiting on API changes #blocked
// todo ::: optimize authentication flow #hotpath #perf:critical
// !!risk ::: validate all inputs #security #sec:input
```

### Complex Example 3 - Multi-Owner Task:

**Before:**
```javascript
// todo ::: implement payment flow +api +backend owner:@alice owner:@bob
// alert ::: breaking change affects:billing affects:payments
// draft ::: API design in progress
```

**After (v1.0):**
```javascript
// todo ::: implement payment flow #api #backend #owner:@alice,@bob
// notice ::: breaking change #affects:#billing,#payments,#api
// wip ::: API design in progress #draft
```

### Complex Example 4 - Performance Hotspot:

**Before:**
```javascript
// hotpath ::: JSON serialization inner loop
// perf ::: optimize this - called 1000x per request
// todo ::: add caching priority:high
```

**After (v1.0):**
```javascript
// todo ::: optimize JSON serialization inner loop #hotpath
// note ::: called 1000x per request #perf:critical-path
// !todo ::: add caching layer
```

### Complex Example 5 - Anchor Usage:

**Before:**
```javascript
// about ::: Main payment processing module
// todo ::: fix race condition (see payment.js line 234)
// note ::: related to stripe webhook handler
```

**After (v1.0):**
```javascript
// about ::: ##payment/stripe-webhook Stripe webhook handler #payments #critical
// todo ::: fix race condition #refs:#payment/stripe-webhook
// test ::: webhook retry logic #for:#payment/stripe-webhook #flaky
```

## 15. Migration Checklist

### Phase 1: Automated Changes
- [ ] Replace `+tag` with `#tag`
- [ ] Replace deprecated markers (see quick reference)
- [ ] Add `#` to reference values (`fixes:123` → `#fixes:#123`)
- [ ] Convert `priority:high/critical` to signals (`!`, `!!`)

### Phase 2: Manual Review
- [ ] Fix signal order (`!*todo` → `*!todo`)
- [ ] Convert multiple same tags to arrays
- [ ] Add attribute tags for code characteristics
- [ ] Create anchors for stable reference points
- [ ] Remove completed `done` waymarks

### Phase 3: Best Practices
- [ ] Use signals for priority, not `#priority:high`
- [ ] Keep tags simple, avoid hierarchies
- [ ] Use relational tags for connections
- [ ] Add `#` to all tag references for greppability
- [ ] Use anchors (`##`) for stable code references

## Summary

The v1.0 simplification focuses on:

1. **Signals over properties** - Use `!` and `!!` for priority
2. **Simple tags** - Just `#tag` and `#rel:value` patterns
3. **Greppability** - Always include `#` in references
4. **Arrays for relationships** - Comma-separated, no spaces
5. **Anchors for stability** - `##` for definitions, `#` for references
6. **Attribute tags** - Describe code characteristics

The result is a cleaner, more consistent system that's easier to learn and use.

