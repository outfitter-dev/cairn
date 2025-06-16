<!-- tldr ::: comprehensive waymark conversion examples for unified hash syntax migration -->

# Waymark Conversion Examples

This document provides conversion examples for migrating existing waymarks to the unified hash syntax. Each current waymark is shown with three alternative conversion approaches to establish migration guidelines.

## Core Waymark Types

Updated core types: `tldr`, `todo`, `fix`, `refactor`, `note`, `alert`, `temp`, `idea`, `about`, `example`, `ci`, `always`

## Deprecated/Non-Core Types Found in Documentation

**High frequency deprecated types:** `stub` (21), `review` (17), `deprecated` (16), `done` (13), `check` (9), `must` (6), `test` (5), `sec` (5), `draft` (5), `audit` (5)

**Medium frequency:** `needs` (8), `blocked` (7), `risk` (4), `new` (4), `important` (3), `hack` (3), `docs` (3)  

**Low frequency:** `warn` (2), `summary` (2), `shipped` (2), `prefix` (2), `old` (2), `notice` (2), `hold` (2), `cleanup` (2), `auth` (2), `assert` (2), `queue` (1), `perf` (1), `monitoring` (1), `mem` (1), `marker` (1), `lint` (1), `investigation` (1), `hotpath` (1), `flag` (1), `documentation` (1), `custom` (1), `compliance` (1), `closing` (1), `bug` (1), `before` (1), `alerting` (1)

---

## 1. Basic Properties Without Hash

### Current:
```javascript
// todo ::: priority:high implement OAuth
// fix ::: memory leak in auth service
// todo ::: @alice implement caching priority:high
```

### Conversion Options:

**Option A - Direct Hash Conversion:**
```javascript
// todo ::: #priority:high implement OAuth
// fix ::: memory leak in auth service
// todo ::: @alice implement caching #priority:high
```

**Option B - Full Property Hash:**
```javascript
// todo ::: implement OAuth #priority:high
// fix ::: memory leak in auth service
// todo ::: @alice implement caching #priority:high
```

**Option C - Contextual Tags:**
```javascript
// todo ::: implement OAuth #priority:high
// fix ::: memory leak in auth service
// todo ::: @alice implement caching #priority:high
```

---

## 2. Reference Values Without Hash

### Current:
```javascript
// todo ::: implement auth flow fixes:#234
// fix ::: waiting on API changes depends:#123
// fix ::: payment validation fixes:#567
```

### Conversion Options:

**Option A - Reference Hash Only:**
```javascript
// todo ::: implement auth flow #fixes:#234
// fix ::: waiting on API changes #depends:#123
// fix ::: payment validation #fixes:#567
```

**Option B - Property and Reference Hash:**
```javascript
// todo ::: implement auth flow #fixes:#234
// fix ::: waiting on API changes #depends:#123
// fix ::: payment validation #fixes:#567
```

**Option C - Contextual Reference:**
```javascript
// todo ::: implement auth flow #fixes:#234
// fix ::: waiting on API changes #depends:#123
// fix ::: payment validation #fixes:#567
```

---

## 3. Legacy +tag Syntax

### Current:
```javascript
// todo ::: implement caching +api +backend
// fix ::: button contrast issue +ui +frontend +a11y
// refactor ::: move shared types +ui-kit +types
// todo ::: update all services for new auth +security +breaking-change
```

### Conversion Options:

**Option A - Direct + to # Replacement:**
```javascript
// todo ::: implement caching #api #backend
// fix ::: button contrast issue #ui #frontend #a11y
// refactor ::: move shared types #ui-kit #types
// todo ::: update all services for new auth #security #breaking-change
```

**Option B - Contextual Tag Grouping:**
```javascript
// todo ::: implement caching #area:api #area:backend
// fix ::: button contrast issue #area:ui #area:frontend #category:a11y
// refactor ::: move shared types #package:ui-kit #type:types
// todo ::: update all services for new auth #category:security #type:breaking-change
```

**Option C - Mixed Context Approach:**
```javascript
// todo ::: implement caching #component:api #component:backend
// fix ::: button contrast issue #ui #frontend #accessibility
// refactor ::: move shared types #package:ui-kit #types
// todo ::: update all services for new auth #security #breaking-change
```

---

## 4. Branch References

### Current:
```javascript
// todo ::: implement OAuth flow branch:feature/auth
// fix ::: payment validation branch:feature/payments fixes:#567
// !!fix ::: critical vulnerability branch:hotfix/security-patch
// note ::: feature freeze in effect branch:release/v2.1
```

### Conversion Options:

**Option A - Branch Hash Only:**
```javascript
// todo ::: implement OAuth flow #branch:feature/auth
// fix ::: payment validation #branch:feature/payments #fixes:#567
// !!fix ::: critical vulnerability #branch:hotfix/security-patch
// note ::: feature freeze in effect #branch:release/v2.1
```

**Option B - Branch Context:**
```javascript
// todo ::: implement OAuth flow #branch:feature/auth
// fix ::: payment validation #branch:feature/payments #fixes:#567
// !!fix ::: critical vulnerability #branch:hotfix/security-patch
// note ::: feature freeze in effect #branch:release/v2.1
```

**Option C - Git Reference Style:**
```javascript
// todo ::: implement OAuth flow #git:feature/auth
// fix ::: payment validation #git:feature/payments #fixes:#567
// !!fix ::: critical vulnerability #git:hotfix/security-patch
// note ::: feature freeze in effect #git:release/v2.1
```

---

## 5. Status Properties

### Current:
```javascript
// fix ::: bug in payment status:blocked
// note ::: production ready status:stable
// todo ::: implement feature priority:high
```

### Conversion Options:

**Option A - Direct Status Hash:**
```javascript
// fix ::: bug in payment #status:blocked
// note ::: production ready #status:stable
// todo ::: implement feature #priority:high
```

**Option B - State Context:**
```javascript
// fix ::: bug in payment #blocked
// note ::: production ready #stable
// todo ::: implement feature #priority:high
```

**Option C - Mixed Approach:**
```javascript
// fix ::: bug in payment #status:blocked
// note ::: production ready #stable
// todo ::: implement feature #priority:high
```

---

## 6. Deprecated Markers to Core Types

### Current:
```javascript
// deprecated ::: use newMethod() instead until:v2.0
// stub ::: basic implementation, needs error handling
// cleanup -todo ::: debug logging before release
```

### Conversion Options:

**Option A - Core Type Replacement:**
```javascript
// temp ::: use newMethod() instead #until:v2.0
// temp ::: basic implementation, needs error handling
// temp ::: debug logging before release
```

**Option B - Note with Context:**
```javascript
// note ::: use newMethod() instead #deprecated #until:v2.0
// note ::: basic implementation, needs error handling #stub
// temp ::: debug logging before release
```

**Option C - Mixed Core Types:**
```javascript
// temp ::: use newMethod() instead #until:v2.0
// idea ::: basic implementation, needs error handling
// temp ::: debug logging before release
```

---

## 7. Signal Combinations

### Current:
```javascript
// *!todo ::: critical - must fix before merge
// !!alert ::: patch data-loss vulnerability
// ?note ::: does pagination handle zero items?
// -todo ::: obsolete after migrating to v5 SDK
```

### Conversion Options:

**Option A - Preserve Signals:**
```javascript
// *!todo ::: critical - must fix before merge
// !!alert ::: patch data-loss vulnerability
// ?note ::: does pagination handle zero items?
// -temp ::: obsolete after migrating to v5 SDK
```

**Option B - Signals with Context Tags:**
```javascript
// *!todo ::: critical - must fix before merge #blocker
// !!alert ::: patch data-loss vulnerability #critical #security
// ?note ::: does pagination handle zero items? #clarification
// -temp ::: obsolete after migrating to v5 SDK #remove
```

**Option C - Tag-Based Priority:**
```javascript
// *todo ::: critical - must fix before merge #critical #blocker
// alert ::: patch data-loss vulnerability #critical #security
// note ::: does pagination handle zero items? #question #review
// temp ::: obsolete after migrating to v5 SDK #deprecated
```

---

## 8. Multi-Tag Patterns

### Current:
```javascript
// todo ::: implement auth tags:[auth,api,security]
// review check ::: files:['auth.js','lib/utils.js']
```

### Conversion Options:

**Option A - Array to Multiple Tags:**
```javascript
// todo ::: implement auth #auth #api #security
// note ::: files need review #files:auth.js #files:lib/utils.js
```

**Option B - Comma-Separated Hash Tags:**
```javascript
// todo ::: implement auth #tags:auth,api,security
// note ::: files need review #files:auth.js,lib/utils.js
```

**Option C - Mixed Context:**
```javascript
// todo ::: implement auth #component:auth #layer:api #category:security
// note ::: files need review #review:auth.js #review:lib/utils.js
```

---

## 9. Complex Properties

### Current:
```javascript
// todo ::: add retry logic config(timeout:30,retry:3)
// alert ::: connection error message('Can\'t connect')
// fix ::: migration at path('src/data migration.sql')
```

### Conversion Options:

**Option A - Direct Hash Conversion:**
```javascript
// todo ::: add retry logic #config:timeout:30,retry:3
// alert ::: connection error #message:"Can't connect"
// fix ::: migration at #path:"src/data migration.sql"
```

**Option B - Property Context:**
```javascript
// todo ::: add retry logic #timeout:30 #retry:3
// alert ::: connection error #message:"Can't connect"
// fix ::: migration at #path:"src/data migration.sql"
```

**Option C - Simplified Context:**
```javascript
// todo ::: add retry logic #config:timeout:30,retry:3
// alert ::: connection error #error:"Can't connect"
// fix ::: migration at #file:"src/data migration.sql"
```

---

## 10. AI Agent Assignments

### Current:
```javascript
// todo ::: @agent add error handling for network failures
// refactor ::: @agent extract this into a utility function
// note ::: @agent database schema changes require migration script
```

### Conversion Options:

**Option A - Preserve @agent:**
```javascript
// todo ::: @agent add error handling for network failures
// refactor ::: @agent extract this into a utility function
// note ::: @agent database schema changes require migration script
```

**Option B - @agent with Context:**
```javascript
// todo ::: @agent add error handling for network failures #network #error-handling
// refactor ::: @agent extract this into a utility function #refactor #utils
// note ::: @agent database schema changes require migration script #database #migration
```

**Option C - Agent with Priority:**
```javascript
// todo ::: @agent add error handling for network failures #priority:medium
// refactor ::: @agent extract this into a utility function #priority:low
// note ::: @agent database schema changes require migration script #priority:high
```

---

## 11. Outdated Non-Core Markers

### Current:
```javascript
// must ::: security review required before merge
// check ::: manual QA needed on staging
// pure note ::: Important assumptions or constraints
```

### Conversion Options:

**Option A - Convert to Core Types:**
```javascript
// alert ::: security review required before merge
// todo ::: manual QA needed on staging
// note ::: Important assumptions or constraints
```

**Option B - Core Types with Context:**
```javascript
// alert ::: security review required before merge #required #security
// todo ::: manual QA needed on staging #qa #manual
// note ::: Important assumptions or constraints #assumptions
```

**Option C - Mixed Approach:**
```javascript
// ci ::: security review required before merge
// ci ::: manual QA needed on staging
// note ::: Important assumptions or constraints
```

---

## 12. Environment and Context

### Current:
```javascript
// alert check ::: config env:production
// todo ::: handle user match('user-123')
```

### Conversion Options:

**Option A - Environment Hash:**
```javascript
// alert ::: config check #env:production
// todo ::: handle user #match:"user-123"
```

**Option B - Context-Specific:**
```javascript
// alert ::: config check #environment:production
// todo ::: handle user #pattern:"user-123"
```

**Option C - Simplified:**
```javascript
// alert ::: config check #production
// todo ::: handle user #user-123
```

---

## 13. High-Frequency Deprecated Types

### `stub` → Core Type Migration (21 instances)

**Current:**
```javascript
// stub ::: basic implementation, needs error handling
// stub ::: Document pending completion
// stub ::: placeholder for auth logic
```

**Option A - Convert to `temp`:**
```javascript
// temp ::: basic implementation, needs error handling
// temp ::: Document pending completion  
// temp ::: placeholder for auth logic
```

**Option B - Convert to `idea` with context:**
```javascript
// idea ::: basic implementation, needs error handling #stub
// note ::: Document pending completion #stub
// idea ::: placeholder for auth logic #stub
```

**Option C - Mixed core types:**
```javascript
// temp ::: basic implementation, needs error handling
// note ::: Document pending completion #draft
// todo ::: placeholder for auth logic #needs-implementation
```

### `review` → Core Type Migration (17 instances)

**Current:**
```javascript
// review ::: check error handling logic
// review check ::: files:['auth.js','lib/utils.js']
// review ::: @alice verify security implementation
```

**Option A - Convert to `note`:**
```javascript
// note ::: check error handling logic #review
// note ::: files need review #files:auth.js #files:lib/utils.js
// note ::: @alice verify security implementation #review
```

**Option B - Convert to `todo` with review context:**
```javascript
// todo ::: check error handling logic #review
// todo ::: review files #auth.js #lib/utils.js
// todo ::: @alice verify security implementation #security-review
```

**Option C - Mixed approach:**
```javascript
// ci ::: check error handling logic #review
// ci ::: files need review #auth.js #lib/utils.js
// todo ::: @alice verify security implementation #security
```

### `done` → Core Type Migration (13 instances)

**Current:**
```javascript
// done ::: implemented OAuth flow
// done ::: payment validation complete
// done ::: security review passed
```

**Option A - Remove (completed work):**
```javascript
// Remove completely - no waymark needed for completed work
```

**Option B - Convert to `note` with completion context:**
```javascript
// note ::: implemented OAuth flow #completed
// note ::: payment validation complete #done
// note ::: security review passed #completed
```

**Option C - Convert to documentation:**
```javascript
// about ::: implemented OAuth flow
// note ::: payment validation complete
// note ::: security review passed
```

---

## 14. Medium-Frequency Deprecated Types

### `check` → Core Type Migration (9 instances)

**Current:**
```javascript
// check ::: manual QA needed on staging
// check ::: verify database constraints
// alert check ::: config env:production
```

**Option A - Convert to `todo`:**
```javascript
// todo ::: manual QA needed on staging #check
// todo ::: verify database constraints #verification
// alert ::: config check #env:production
```

**Option B - Convert to `ci`:**
```javascript
// ci ::: manual QA needed on staging
// ci ::: verify database constraints
// alert ::: config check #env:production
```

**Option C - Context-specific conversion:**
```javascript
// ci ::: manual QA needed on staging #manual
// todo ::: verify database constraints #verification
// alert ::: config check #env:production
```

### `must` → Core Type Migration (6 instances)

**Current:**
```javascript
// must ::: security review required before merge
// !must ::: array length must be power of two
// *must ::: security review required before merge
```

**Option A - Convert to `alert`:**
```javascript
// alert ::: security review required before merge #required
// !alert ::: array length must be power of two #requirement
// *alert ::: security review required before merge #required
```

**Option B - Convert to `ci` with requirements:**
```javascript
// ci ::: security review required before merge #requirement
// !ci ::: array length must be power of two #constraint
// *ci ::: security review required before merge #requirement
```

**Option C - Context-sensitive conversion:**
```javascript
// ci ::: security review required before merge #required
// note ::: array length must be power of two #constraint
// *ci ::: security review required before merge #required
```

### `needs` → Core Type Migration (8 instances)

**Current:**
```javascript
// needs ::: @carol help from @dave
// needs ::: database migration before deploy
// needs ::: API update to support new feature
```

**Option A - Convert to `todo` with dependency:**
```javascript
// todo ::: @carol get help from @dave #needs-help
// todo ::: database migration before deploy #dependency
// todo ::: API update to support new feature #dependency
```

**Option B - Convert to `note` with requirements:**
```javascript
// note ::: @carol needs help from @dave #requires-help
// note ::: database migration before deploy #prerequisite
// note ::: API update to support new feature #requires-api
```

**Option C - Mixed conversion:**
```javascript
// todo ::: @carol collaborate with @dave
// ci ::: database migration before deploy #prerequisite
// todo ::: API update to support new feature #api
```

### `blocked` → Core Type Migration (7 instances)

**Current:**
```javascript
// blocked ::: waiting for API approval
// fix ::: bug in payment status:blocked
// todo ::: payment update blocking:[PAY-45,UI-77]
```

**Option A - Convert to `note` with blocked status:**
```javascript
// note ::: waiting for API approval #blocked
// fix ::: bug in payment #status:blocked
// todo ::: payment update #blocking:#PAY-45 #blocking:#UI-77
```

**Option B - Convert to `alert` for blockers:**
```javascript
// alert ::: waiting for API approval #blocked
// fix ::: bug in payment #blocked
// alert ::: payment update #blocks:#PAY-45,#UI-77
```

**Option C - Context-specific conversion:**
```javascript
// note ::: waiting for API approval #awaiting-approval
// fix ::: bug in payment #status:blocked
// todo ::: payment update #depends:#PAY-45 #depends:#UI-77
```

---

## 15. Specialized Deprecated Types

### `test`/`sec`/`audit` → Core Type Migration

**Current:**
```javascript
// test ::: add integration tests for auth
// sec ::: validate all user inputs
// audit ::: log all financial transactions
// test review ::: check edge cases
```

**Option A - Convert to `todo` with context:**
```javascript
// todo ::: add integration tests for auth #testing
// alert ::: validate all user inputs #security
// note ::: log all financial transactions #audit
// todo ::: check edge cases #testing #review
```

**Option B - Convert to `ci` for process-related:**
```javascript
// ci ::: add integration tests for auth
// ci ::: validate all user inputs #security
// ci ::: log all financial transactions #audit
// ci ::: check edge cases #testing
```

**Option C - Mixed specialized conversion:**
```javascript
// todo ::: add integration tests for auth
// alert ::: validate all user inputs #security-critical
// always ::: log all financial transactions #audit
// todo ::: check edge cases #testing
```

### `risk`/`warn`/`important` → Core Type Migration

**Current:**
```javascript
// risk ::: potential data loss in migration
// warn ::: deprecated API will be removed
// important ::: critical performance bottleneck
// risk assessment ::: evaluate security implications
```

**Option A - Convert to `alert`:**
```javascript
// alert ::: potential data loss in migration #risk
// alert ::: deprecated API will be removed #warning
// alert ::: critical performance bottleneck #important
// alert ::: evaluate security implications #risk-assessment
```

**Option B - Signal-based conversion:**
```javascript
// !note ::: potential data loss in migration #risk
// !note ::: deprecated API will be removed #deprecation
// !!note ::: critical performance bottleneck #performance
// note ::: evaluate security implications #risk-assessment
```

**Option C - Context-specific conversion:**
```javascript
// alert ::: potential data loss in migration #migration #risk
// note ::: deprecated API will be removed #deprecation #warning
// alert ::: critical performance bottleneck #performance #critical
// todo ::: evaluate security implications #security #assessment
```

---

## 16. Workflow/Status Deprecated Types

### `draft`/`new`/`hold`/`shipped` → Core Type Migration

**Current:**
```javascript
// draft ::: initial implementation notes
// new ::: feature request from customer
// hold ::: waiting for legal approval
// shipped ::: feature deployed to production
```

**Option A - Convert to appropriate core types:**
```javascript
// note ::: initial implementation notes #draft
// idea ::: feature request from customer #feature-request
// note ::: waiting for legal approval #on-hold
// note ::: feature deployed to production #completed
```

**Option B - Status-based conversion:**
```javascript
// temp ::: initial implementation notes #draft
// todo ::: feature request from customer #new-feature
// todo ::: waiting for legal approval #blocked
// about ::: feature deployed to production
```

**Option C - Contextual conversion:**
```javascript
// idea ::: initial implementation notes #draft
// todo ::: feature request from customer #enhancement
// note ::: waiting for legal approval #awaiting-approval
// note ::: feature deployed to production #deployed
```

### Low-Frequency Specialized Types

**Current:**
```javascript
// perf ::: optimize database queries
// mem ::: memory leak in image processing
// lint ::: fix ESLint warnings
// hack ::: temporary workaround for SSL issue
// cleanup ::: remove debug logging
// docs ::: update API documentation
// compliance ::: ensure GDPR requirements
// monitoring ::: add health check endpoint
```

**Option A - Convert to appropriate core types:**
```javascript
// todo ::: optimize database queries #performance
// fix ::: memory leak in image processing #memory
// todo ::: fix ESLint warnings #linting
// temp ::: temporary workaround for SSL issue #hack
// temp ::: remove debug logging #cleanup
// todo ::: update API documentation #documentation
// ci ::: ensure GDPR requirements #compliance
// todo ::: add health check endpoint #monitoring
```

**Option B - Context-rich conversion:**
```javascript
// refactor ::: optimize database queries #performance
// fix ::: memory leak in image processing #memory-leak
// ci ::: fix ESLint warnings #linting
// temp ::: temporary workaround for SSL issue #workaround
// temp ::: remove debug logging #debug
// todo ::: update API documentation #docs
// always ::: ensure GDPR requirements #compliance
// ci ::: add health check endpoint #health-check
```

**Option C - Mixed approach:**
```javascript
// todo ::: optimize database queries #perf
// fix ::: memory leak in image processing #memory
// ci ::: fix ESLint warnings
// temp ::: temporary workaround for SSL issue
// temp ::: remove debug logging
// todo ::: update API documentation
// note ::: ensure GDPR requirements #compliance
// todo ::: add health check endpoint #monitoring
```

---

## 17. Complex Property Patterns

### Nested and Complex Properties

**Current:**
```javascript
// todo ::: implement feature priority:high status:in-progress assign:@alice
// fix ::: bug in payment env:production severity:critical blocking:[PAY-45,UI-77]
// alert ::: security issue config(timeout:30,retry:3) tags:[auth,api,security]
// todo ::: handle payments listens(payment-completed) triggers(workflow:deploy)
```

**Option A - Direct hash conversion:**
```javascript
// todo ::: implement feature #priority:high #status:in-progress @alice
// fix ::: bug in payment #env:production #severity:critical #blocking:#PAY-45,#UI-77
// alert ::: security issue #config:timeout:30,retry:3 #auth #api #security
// todo ::: handle payments #listens:payment-completed #triggers:workflow:deploy
```

**Option B - Structured hash properties:**
```javascript
// todo ::: implement feature #priority:high #status:in-progress @alice
// fix ::: bug in payment #env:production #severity:critical #blocks:#PAY-45 #blocks:#UI-77
// alert ::: security issue #timeout:30 #retry:3 #auth #api #security
// todo ::: handle payments #listens:payment-completed #triggers:workflow:deploy
```

**Option C - Simplified contextual:**
```javascript
// todo ::: implement feature @alice #priority:high #in-progress
// fix ::: bug in payment #production #critical #blocks:#PAY-45 #blocks:#UI-77
// alert ::: security issue #auth #api #security #timeout:30 #retry:3
// todo ::: handle payments #payment-events #workflow-trigger
```

### String Literals and Paths

**Current:**
```javascript
// alert ::: connection error message('Can\'t connect to database')
// fix ::: migration at path('src/data migration.sql')
// todo ::: handle user match('user-123')
// review check ::: files:['auth.js','lib/utils.js']
```

**Option A - Quoted hash values:**
```javascript
// alert ::: connection error #message:"Can't connect to database"
// fix ::: migration at #path:"src/data migration.sql"
// todo ::: handle user #match:"user-123"
// note ::: files need review #files:"auth.js,lib/utils.js"
```

**Option B - Simplified hash values:**
```javascript
// alert ::: connection error #error:"Can't connect to database"
// fix ::: migration at #file:"src/data migration.sql"
// todo ::: handle user #pattern:"user-123"
// todo ::: review files #auth.js #lib/utils.js
```

**Option C - Context-specific conversion:**
```javascript
// alert ::: connection error #database-error
// fix ::: migration at #migration-file:"src/data migration.sql"
// todo ::: handle user #user-pattern:"user-123"
// ci ::: review files #auth.js #lib/utils.js
```

---

## 18. Signal Combinations with Deprecated Types

### Complex Signal + Deprecated Type Patterns

**Current:**
```javascript
// !!stub ::: critical placeholder needs implementation
// !review ::: important security audit required
// *check ::: verify before merge
// -done ::: completed work to remove
// ?needs ::: unclear if database migration required
// --draft ::: remove this draft implementation
```

**Option A - Convert type, preserve signal:**
```javascript
// !!temp ::: critical placeholder needs implementation
// !note ::: important security audit required #review
// *ci ::: verify before merge
// -note ::: completed work to remove #completed
// ?note ::: unclear if database migration required #question
// --temp ::: remove this draft implementation
```

**Option B - Signal + context tags:**
```javascript
// !!todo ::: critical placeholder needs implementation #stub #critical
// !todo ::: important security audit required #security #review
// *todo ::: verify before merge #verification
// Remove completely (completed work)
// ?todo ::: unclear if database migration required #database #clarification
// --temp ::: remove this draft implementation #draft
```

**Option C - Contextual signal conversion:**
```javascript
// !!temp ::: critical placeholder needs implementation #blocker
// !ci ::: important security audit required #security
// *ci ::: verify before merge
// Remove waymark (work completed)
// ?note ::: unclear if database migration required #needs-clarification
// --temp ::: remove this draft implementation
```

---

## 19. Edge Cases and Malformed Waymarks

### Malformed Signals

**Current:**
```javascript
// !*todo ::: wrong signal order
// _*todo ::: can't combine underscore with star
// **todo ::: double star not valid
// todo fix ::: multiple markers
```

**Option A - Fix signal order, convert type:**
```javascript
// *!todo ::: wrong signal order (fixed)
// *todo ::: can't combine underscore with star (underscore removed)
// *todo ::: double star not valid (simplified)
// todo ::: multiple markers (choose one primary)
```

**Option B - Remove invalid signals:**
```javascript
// !todo ::: wrong signal order #corrected
// todo ::: can't combine underscore with star #note
// todo ::: double star not valid #simplified
// todo ::: multiple markers #consolidated
```

**Option C - Convert to valid patterns:**
```javascript
// *!todo ::: critical branch work (corrected order)
// *todo ::: branch work (underscore conflicts resolved)
// !!todo ::: critical work (double-bang for critical)
// fix ::: choose primary marker type
```

### Case Sensitivity Issues

**Current:**
```javascript
// TODO ::: uppercase marker
// TLDR ::: uppercase tldr
// Test ::: mixed case
// todo FIX ::: mixed case content
```

**Option A - Normalize to lowercase:**
```javascript
// todo ::: uppercase marker (normalized)
// tldr ::: uppercase tldr (normalized)
// todo ::: mixed case (normalized to core type)
// todo ::: mixed case content (normalized)
```

**Option B - Preserve with context:**
```javascript
// todo ::: uppercase marker #legacy-format
// tldr ::: uppercase tldr #legacy-format
// todo ::: mixed case #normalized
// todo ::: mixed case content
```

**Option C - Strict normalization:**
```javascript
// todo ::: implement feature
// tldr ::: file summary
// todo ::: implement feature
// todo ::: fix implementation
```

---

## Migration Guidelines Summary

Based on these comprehensive examples, the recommended approach is:

### Core Conversion Rules:
1. **Direct Hash Prefix**: All properties and references get `#` prefix
2. **Preserve Actor Syntax**: Keep `@actor` unchanged
3. **Core Type Migration Map**:
   - `deprecated` → `temp`
   - `stub` → `temp` or `idea`
   - `review` → `note` or `ci` with `#review`
   - `done` → Remove completely or convert to `note` with `#completed`
   - `check` → `ci` or `todo` with `#verification`
   - `must` → `alert` or `ci` with `#required`
   - `needs` → `todo` with `#dependency` or `#requires`
   - `blocked` → `note` or `alert` with `#blocked`
   - `test`/`audit`/`sec` → `ci` or `todo` with context tags
   - `risk`/`warn`/`important` → `alert` with context tags
   - `draft`/`new`/`hold`/`shipped` → Context-appropriate core types
4. **Reference Values**: Always use `#property:#value` format  
5. **Tag Consistency**: Convert `+tag` to `#tag`
6. **Signal Preservation**: Keep position and intensity signals unchanged, fix malformed signals
7. **Context Addition**: Add meaningful context tags when converting deprecated types
8. **Case Normalization**: Convert all waymark types to lowercase
9. **Multiple Markers**: Choose single primary core type, add context as tags
10. **Completed Work**: Remove `done` waymarks or convert to documentation with `#completed`