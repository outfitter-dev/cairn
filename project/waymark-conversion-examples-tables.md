<!-- tldr ::: table-based waymark conversion cheat-sheet for unified hash syntax migration -->

# Waymark Conversion Examples (Tabular)

This version of the examples document is optimised for **quick, side-by-side comparison**.  
Every legacy waymark appears in the **Current** column, followed by the three proposed conversion approaches.  
Pick the winner in the last column (`✅`).

Legend:

- **Option A** – “direct” conversion (usually strict `#` prefix only).
- **Option B** – “structured” or full-hash style.
- **Option C** – “contextual” or mixed approach.

Tick (`✔︎`) or write the chosen letter in the last column once you decide.

---

## 01 – Basic properties _(bare key:value pairs)_

| Current | Option A – direct `#` | Option B – full hash | Option C – context tags | ✅ |
|---|---|---|---|---|
| `// todo ::: priority:high implement OAuth` | `// todo ::: #priority:high implement OAuth` | `// todo ::: implement OAuth #priority:high` | `// todo ::: implement OAuth #priority:high` | |
| `// fix ::: memory leak in auth service` | `// fix ::: memory leak in auth service` | _same as&nbsp;A_ | _same as&nbsp;A_ | |
| `// todo ::: @alice implement caching priority:high` | `// todo ::: @alice implement caching #priority:high` | `// todo ::: @alice implement caching #priority:high` | `// todo ::: @alice implement caching #priority:high` | |

---

## 02 – Reference values _(fixes / depends)_

| Current | A – reference hash | B – property + hash | C – contextual | ✅ |
|---|---|---|---|---|
| `// todo ::: implement auth flow fixes:#234` | `// todo ::: implement auth flow #fixes:#234` | _same as&nbsp;A_ | _same as&nbsp;A_ | |
| `// fix ::: waiting on API changes depends:#123` | `// fix ::: waiting on API changes #depends:#123` | _same as&nbsp;A_ | _same as&nbsp;A_ | |
| `// fix ::: payment validation fixes:#567` | `// fix ::: payment validation #fixes:#567` | _same as&nbsp;A_ | _same as&nbsp;A_ | |

---

## 03 – Legacy `+tag` syntax

| Current | A – `+`→`#` | B – contextual tagging | C – mixed context | ✅ |
|---|---|---|---|---|
| `// todo ::: implement caching +api +backend` | `// todo ::: implement caching #api #backend` | `// todo ::: implement caching #area:api #area:backend` | `// todo ::: implement caching #component:api #component:backend` | |
| `// fix ::: button contrast issue +ui +frontend +a11y` | `// fix ::: button contrast issue #ui #frontend #a11y` | `// fix ::: button contrast issue #area:ui #area:frontend #category:a11y` | `// fix ::: button contrast issue #ui #frontend #accessibility` | |
| `// refactor ::: move shared types +ui-kit +types` | `// refactor ::: move shared types #ui-kit #types` | `// refactor ::: move shared types #package:ui-kit #type:types` | `// refactor ::: move shared types #package:ui-kit #types` | |
| `// todo ::: update all services for new auth +security +breaking-change` | `// todo ::: update all services for new auth #security #breaking-change` | `// todo ::: update all services for new auth #category:security #type:breaking-change` | `// todo ::: update all services for new auth #security #breaking-change` | |

---

## 04 – Branch references

| Current | A – `#branch:` | B – branch context | C – `#git:` | ✅ |
|---|---|---|---|---|
| `// todo ::: implement OAuth flow branch:feature/auth` | `// todo ::: implement OAuth flow #branch:feature/auth` | _same as&nbsp;A_ | `// todo ::: implement OAuth flow #git:feature/auth` | |
| `// fix ::: payment validation branch:feature/payments fixes:#567` | `// fix ::: payment validation #branch:feature/payments #fixes:#567` | _same as&nbsp;A_ | `// fix ::: payment validation #git:feature/payments #fixes:#567` | |
| `// !!fix ::: critical vulnerability branch:hotfix/security-patch` | `// !!fix ::: critical vulnerability #branch:hotfix/security-patch` | _same as&nbsp;A_ | `// !!fix ::: critical vulnerability #git:hotfix/security-patch` | |
| `// note ::: feature freeze in effect branch:release/v2.1` | `// note ::: feature freeze in effect #branch:release/v2.1` | _same as&nbsp;A_ | `// note ::: feature freeze in effect #git:release/v2.1` | |

---

## 05 – Status / priority properties

| Current | A – direct `#status:` | B – shorthand tag | C – mixed | ✅ |
|---|---|---|---|---|
| `// fix ::: bug in payment status:blocked` | `// fix ::: bug in payment #status:blocked` | `// fix ::: bug in payment #blocked` | `// fix ::: bug in payment #status:blocked` | |
| `// note ::: production ready status:stable` | `// note ::: production ready #status:stable` | `// note ::: production ready #stable` | `// note ::: production ready #stable` | |
| `// todo ::: implement feature priority:high` | `// todo ::: implement feature #priority:high` | _same as&nbsp;A_ | _same as&nbsp;A_ | |

---

## 06 – Deprecated markers ⇒ core types

| Current | A – core replacement | B – note w/ context | C – mixed | ✅ |
|---|---|---|---|---|
| `// deprecated ::: use newMethod() instead until:v2.0` | `// temp ::: use newMethod() instead #until:v2.0` | `// note ::: use newMethod() instead #deprecated #until:v2.0` | `// temp ::: use newMethod() instead #until:v2.0` | |
| `// stub ::: basic implementation, needs error handling` | `// temp ::: basic implementation, needs error handling` | `// note ::: basic implementation, needs error handling #stub` | `// idea ::: basic implementation, needs error handling` | |
| `// cleanup -todo ::: debug logging before release` | `// temp ::: debug logging before release` | `// temp ::: debug logging before release` | `// temp ::: debug logging before release` | |

---

## 07 – Signal combinations

| Current | A – keep signals | B – signal + tags | C – tag-based priority | ✅ |
|---|---|---|---|---|
| `//!*todo ::: critical - must fix before merge` | `//*!todo ::: critical - must fix before merge` | `//*!todo ::: critical - must fix before merge #blocker` | `//*todo ::: critical - must fix before merge #critical #blocker` | |
| `// !!alert ::: patch data-loss vulnerability` | `// !!alert ::: patch data-loss vulnerability` | `// !!alert ::: patch data-loss vulnerability #critical #security` | `// alert ::: patch data-loss vulnerability #critical #security` | |
| `// ?note ::: does pagination handle zero items?` | `// ?note ::: does pagination handle zero items?` | `// ?note ::: does pagination handle zero items? #clarification` | `// note ::: does pagination handle zero items? #question #review` | |
| `// -todo ::: obsolete after migrating to v5 SDK` | `// -temp ::: obsolete after migrating to v5 SDK` | `// -temp ::: obsolete after migrating to v5 SDK #remove` | `// temp ::: obsolete after migrating to v5 SDK #deprecated` | |

---

## 08 – Multi-tag patterns (array / list)

| Current | A – explode array | B – comma list | C – contextual | ✅ |
|---|---|---|---|---|
| `// todo ::: implement auth tags:[auth,api,security]` | `// todo ::: implement auth #auth #api #security` | `// todo ::: implement auth #tags:auth,api,security` | `// todo ::: implement auth #component:auth #layer:api #category:security` | |
| `// review check ::: files:['auth.js','lib/utils.js']` | `// note ::: files need review #files:auth.js #files:lib/utils.js` | `// note ::: files need review #files:auth.js,lib/utils.js` | `// note ::: files need review #review:auth.js #review:lib/utils.js` | |

---

## 09 – Complex property strings

| Current | A – direct hash | B – split properties | C – simplified | ✅ |
|---|---|---|---|---|
| `// todo ::: add retry logic config(timeout:30,retry:3)` | `// todo ::: add retry logic #config:timeout:30,retry:3` | `// todo ::: add retry logic #timeout:30 #retry:3` | `// todo ::: add retry logic #config:timeout:30,retry:3` | |
| `// alert ::: connection error message('Can't connect')` | `// alert ::: connection error #message:"Can't connect"` | _same as&nbsp;A_ | `// alert ::: connection error #error:"Can't connect"` | |
| `// fix ::: migration at path('src/data migration.sql')` | `// fix ::: migration at #path:"src/data migration.sql"` | _same as&nbsp;A_ | `// fix ::: migration at #file:"src/data migration.sql"` | |

---

## 10 – AI agent assignments

| Current | A – keep `@agent` | B – context tags | C – priority tags | ✅ |
|---|---|---|---|---|
| `// todo ::: @agent add error handling for network failures` | `// todo ::: @agent add error handling for network failures` | `// todo ::: @agent add error handling for network failures #network #error-handling` | `// todo ::: @agent add error handling for network failures #priority:medium` | |
| `// refactor ::: @agent extract this into a utility function` | `// refactor ::: @agent extract this into a utility function` | `// refactor ::: @agent extract this into a utility function #refactor #utils` | `// refactor ::: @agent extract this into a utility function #priority:low` | |
| `// note ::: @agent database schema changes require migration script` | `// note ::: @agent database schema changes require migration script` | `// note ::: @agent database schema changes require migration script #database #migration` | `// note ::: @agent database schema changes require migration script #priority:high` | |

---

## 11 – Outdated non-core markers

| Current | A – convert | B – core + tags | C – mixed | ✅ |
|---|---|---|---|---|
| `// must ::: security review required before merge` | `// alert ::: security review required before merge` | `// alert ::: security review required before merge #required #security` | `// ci ::: security review required before merge` | |
| `// check ::: manual QA needed on staging` | `// todo ::: manual QA needed on staging` | `// todo ::: manual QA needed on staging #qa #manual` | `// ci ::: manual QA needed on staging` | |
| `// pure note ::: Important assumptions or constraints` | `// note ::: Important assumptions or constraints` | `// note ::: Important assumptions or constraints #assumptions` | `// note ::: Important assumptions or constraints` | |

---

## 12 – Environment & context strings

| Current | A – `#env:` | B – explicit context | C – shorthand | ✅ |
|---|---|---|---|---|
| `// alert check ::: config env:production` | `// alert ::: config check #env:production` | `// alert ::: config check #environment:production` | `// alert ::: config check #production` | |
| `// todo ::: handle user match('user-123')` | `// todo ::: handle user #match:"user-123"` | `// todo ::: handle user #pattern:"user-123"` | `// todo ::: handle user #user-123` | |

---

<details>
<summary><strong>13 – High-frequency deprecated types</strong> (click to expand)</summary>

### 13.1 `stub` → core

| Current | A – `temp` | B – `idea` w/ tag | C – mixed | ✅ |
|---|---|---|---|---|
| `// stub ::: basic implementation, needs error handling` | `// temp ::: basic implementation, needs error handling` | `// idea ::: basic implementation, needs error handling #stub` | `// temp ::: basic implementation, needs error handling` | |
| `// stub ::: Document pending completion` | `// temp ::: Document pending completion` | `// note ::: Document pending completion #stub` | `// note ::: Document pending completion #draft` | |
| `// stub ::: placeholder for auth logic` | `// temp ::: placeholder for auth logic` | `// idea ::: placeholder for auth logic #stub` | `// todo ::: placeholder for auth logic #needs-implementation` | |

### 13.2 `review` → core

| Current | A – `note` | B – `todo` review | C – mixed | ✅ |
|---|---|---|---|---|
| `// review ::: check error handling logic` | `// note ::: check error handling logic #review` | `// todo ::: check error handling logic #review` | `// ci ::: check error handling logic #review` | |
| `// review check ::: files:['auth.js','lib/utils.js']` | `// note ::: files need review #files:auth.js #files:lib/utils.js` | `// todo ::: review files #auth.js #lib/utils.js` | `// ci ::: files need review #auth.js #lib/utils.js` | |
| `// review ::: @alice verify security implementation` | `// note ::: @alice verify security implementation #review` | `// todo ::: @alice verify security implementation #security-review` | `// todo ::: @alice verify security implementation #security` | |

### 13.3 `done` → handled

| Current | A – remove | B – `note` completed | C – documentation | ✅ |
|---|---|---|---|---|
| `// done ::: implemented OAuth flow` | _(remove)_ | `// note ::: implemented OAuth flow #completed` | `// about ::: implemented OAuth flow` | |
| `// done ::: payment validation complete` | _(remove)_ | `// note ::: payment validation complete #done` | `// note ::: payment validation complete` | |
| `// done ::: security review passed` | _(remove)_ | `// note ::: security review passed #completed` | `// note ::: security review passed` | |

</details>

<details>
<summary><strong>14 – Medium-frequency deprecated types</strong></summary>

### 14.1 `check`

| Current | A – `todo` | B – `ci` | C – context | ✅ |
|---|---|---|---|---|
| `// check ::: manual QA needed on staging` | `// todo ::: manual QA needed on staging #check` | `// ci ::: manual QA needed on staging` | `// ci ::: manual QA needed on staging #manual` | |
| `// check ::: verify database constraints` | `// todo ::: verify database constraints #verification` | `// ci ::: verify database constraints` | `// todo ::: verify database constraints #verification` | |
| `// alert check ::: config env:production` | `// alert ::: config check #env:production` | `// alert ::: config check #env:production` | `// alert ::: config check #env:production` | |

### 14.2 `must`

| Current | A – `alert` | B – `ci` | C – mixed | ✅ |
|---|---|---|---|---|
| `// must ::: security review required before merge` | `// alert ::: security review required before merge #required` | `// ci ::: security review required before merge #requirement` | `// ci ::: security review required before merge #required` | |
| `// !must ::: array length must be power of two` | `// !alert ::: array length must be power of two #requirement` | `// !ci ::: array length must be power of two #constraint` | `// note ::: array length must be power of two #constraint` | |
| `// *must ::: security review required before merge` | `// *alert ::: security review required before merge #required` | `// *ci ::: security review required before merge #requirement` | `// *ci ::: security review required before merge #required` | |

### 14.3 `needs`

| Current | A – `todo` dependency | B – `note` requires | C – mixed | ✅ |
|---|---|---|---|---|
| `// needs ::: @carol help from @dave` | `// todo ::: @carol get help from @dave #needs-help` | `// note ::: @carol needs help from @dave #requires-help` | `// todo ::: @carol collaborate with @dave` | |
| `// needs ::: database migration before deploy` | `// todo ::: database migration before deploy #dependency` | `// note ::: database migration before deploy #prerequisite` | `// ci ::: database migration before deploy #prerequisite` | |
| `// needs ::: API update to support new feature` | `// todo ::: API update to support new feature #dependency` | `// note ::: API update to support new feature #requires-api` | `// todo ::: API update to support new feature #api` | |

### 14.4 `blocked`

| Current | A – note #blocked | B – alert blocker | C – context | ✅ |
|---|---|---|---|---|
| `// blocked ::: waiting for API approval` | `// note ::: waiting for API approval #blocked` | `// alert ::: waiting for API approval #blocked` | `// note ::: waiting for API approval #awaiting-approval` | |
| `// fix ::: bug in payment status:blocked` | `// fix ::: bug in payment #status:blocked` | `// fix ::: bug in payment #blocked` | `// fix ::: bug in payment #status:blocked` | |
| `// todo ::: payment update blocking:[PAY-45,UI-77]` | `// todo ::: payment update #blocking:#PAY-45 #blocking:#UI-77` | `// alert ::: payment update #blocks:#PAY-45,#UI-77` | `// todo ::: payment update #depends:#PAY-45 #depends:#UI-77` | |

</details>

<details>
<summary><strong>15 – Specialised deprecated types</strong></summary>

### 15.1 `test` / `sec` / `audit`

| Current | A – `todo` + ctx | B – `ci` | C – mixed | ✅ |
|---|---|---|---|---|
| `// test ::: add integration tests for auth` | `// todo ::: add integration tests for auth #testing` | `// ci ::: add integration tests for auth` | `// todo ::: add integration tests for auth` | |
| `// sec ::: validate all user inputs` | `// alert ::: validate all user inputs #security` | `// ci ::: validate all user inputs #security` | `// alert ::: validate all user inputs #security-critical` | |
| `// audit ::: log all financial transactions` | `// note ::: log all financial transactions #audit` | `// ci ::: log all financial transactions #audit` | `// always ::: log all financial transactions #audit` | |
| `// test review ::: check edge cases` | `// todo ::: check edge cases #testing #review` | `// ci ::: check edge cases #testing` | `// todo ::: check edge cases #testing` | |

### 15.2 `risk` / `warn` / `important`

| Current | A – `alert` | B – signal note | C – context | ✅ |
|---|---|---|---|---|
| `// risk ::: potential data loss in migration` | `// alert ::: potential data loss in migration #risk` | `//!note ::: potential data loss in migration #risk` | `// alert ::: potential data loss in migration #migration #risk` | |
| `// warn ::: deprecated API will be removed` | `// alert ::: deprecated API will be removed #warning` | `//!note ::: deprecated API will be removed #deprecation` | `// note ::: deprecated API will be removed #deprecation #warning` | |
| `// important ::: critical performance bottleneck` | `// alert ::: critical performance bottleneck #important` | `//!!note ::: critical performance bottleneck #performance` | `// alert ::: critical performance bottleneck #performance #critical` | |
| `// risk assessment ::: evaluate security implications` | `// alert ::: evaluate security implications #risk-assessment` | `// note ::: evaluate security implications #risk-assessment` | `// todo ::: evaluate security implications #security #assessment` | |

</details>

<details>
<summary><strong>16 – Workflow / status markers</strong></summary>

### 16.1 `draft` / `new` / `hold` / `shipped`

| Current | A – core+tag | B – status-based | C – contextual | ✅ |
|---|---|---|---|---|
| `// draft ::: initial implementation notes` | `// note ::: initial implementation notes #draft` | `// temp ::: initial implementation notes #draft` | `// idea ::: initial implementation notes #draft` | |
| `// new ::: feature request from customer` | `// idea ::: feature request from customer #feature-request` | `// todo ::: feature request from customer #new-feature` | `// todo ::: feature request from customer #enhancement` | |
| `// hold ::: waiting for legal approval` | `// note ::: waiting for legal approval #on-hold` | `// todo ::: waiting for legal approval #blocked` | `// note ::: waiting for legal approval #awaiting-approval` | |
| `// shipped ::: feature deployed to production` | `// note ::: feature deployed to production #completed` | `// about ::: feature deployed to production` | `// note ::: feature deployed to production #deployed` | |

### 16.2 Low-frequency specialised

| Current | A – core + tag | B – context-rich | C – mixed | ✅ |
|---|---|---|---|---|
| `// perf ::: optimize database queries` | `// todo ::: optimize database queries #performance` | `// refactor ::: optimize database queries #performance` | `// todo ::: optimize database queries #perf` | |
| `// mem ::: memory leak in image processing` | `// fix ::: memory leak in image processing #memory` | `// fix ::: memory leak in image processing #memory-leak` | `// fix ::: memory leak in image processing #memory` | |
| `// lint ::: fix ESLint warnings` | `// todo ::: fix ESLint warnings #linting` | `// ci ::: fix ESLint warnings #linting` | `// ci ::: fix ESLint warnings` | |
| `// hack ::: temporary workaround for SSL issue` | `// temp ::: temporary workaround for SSL issue #hack` | `// temp ::: temporary workaround for SSL issue #workaround` | `// temp ::: temporary workaround for SSL issue` | |
| `// cleanup ::: remove debug logging` | `// temp ::: remove debug logging #cleanup` | `// temp ::: remove debug logging #debug` | `// temp ::: remove debug logging` | |
| `// docs ::: update API documentation` | `// todo ::: update API documentation #documentation` | `// todo ::: update API documentation #docs` | `// todo ::: update API documentation` | |
| `// compliance ::: ensure GDPR requirements` | `// ci ::: ensure GDPR requirements #compliance` | `// always ::: ensure GDPR requirements #compliance` | `// note ::: ensure GDPR requirements #compliance` | |
| `// monitoring ::: add health check endpoint` | `// todo ::: add health check endpoint #monitoring` | `// ci ::: add health check endpoint #health-check` | `// todo ::: add health check endpoint #monitoring` | |

</details>

<details>
<summary><strong>17 – Complex property patterns</strong></summary>

### 17.1 Nested / multi-prop lines

| Current | A – direct hash | B – structured | C – simplified | ✅ |
|---|---|---|---|---|
| `// todo ::: implement feature priority:high status:in-progress assign:@alice` | `// todo ::: implement feature #priority:high #status:in-progress @alice` | `// todo ::: implement feature #priority:high #status:in-progress @alice` | `// todo ::: implement feature @alice #priority:high #in-progress` | |
| `// fix ::: bug in payment env:production severity:critical blocking:[PAY-45,UI-77]` | `// fix ::: bug in payment #env:production #severity:critical #blocking:#PAY-45,#UI-77` | `// fix ::: bug in payment #env:production #severity:critical #blocks:#PAY-45 #blocks:#UI-77` | `// fix ::: bug in payment #production #critical #blocks:#PAY-45 #blocks:#UI-77` | |
| `// alert ::: security issue config(timeout:30,retry:3) tags:[auth,api,security]` | `// alert ::: security issue #config:timeout:30,retry:3 #auth #api #security` | `// alert ::: security issue #timeout:30 #retry:3 #auth #api #security` | `// alert ::: security issue #auth #api #security #timeout:30 #retry:3` | |
| `// todo ::: handle payments listens(payment-completed) triggers(workflow:deploy)` | `// todo ::: handle payments #listens:payment-completed #triggers:workflow:deploy` | `// todo ::: handle payments #listens:payment-completed #triggers:workflow:deploy` | `// todo ::: handle payments #payment-events #workflow-trigger` | |

### 17.2 String literals & paths

| Current | A – quoted hash | B – simplified hash | C – context | ✅ |
|---|---|---|---|---|
| `// alert ::: connection error message('Can't connect to database')` | `// alert ::: connection error #message:"Can't connect to database"` | `// alert ::: connection error #error:"Can't connect to database"` | `// alert ::: connection error #database-error` | |
| `// fix ::: migration at path('src/data migration.sql')` | `// fix ::: migration at #path:"src/data migration.sql"` | `// fix ::: migration at #file:"src/data migration.sql"` | `// fix ::: migration at #migration-file:"src/data migration.sql"` | |
| `// todo ::: handle user match('user-123')` | `// todo ::: handle user #match:"user-123"` | `// todo ::: handle user #pattern:"user-123"` | `// todo ::: handle user #user-pattern:"user-123"` | |
| `// review check ::: files:['auth.js','lib/utils.js']` | `// note ::: files need review #files:"auth.js,lib/utils.js"` | `// todo ::: review files #auth.js #lib.utils.js` | `// ci ::: review files #auth.js #lib/utils.js` | |

</details>

<details>
<summary><strong>18 – Signals + deprecated types</strong></summary>

| Current | A – keep signal | B – signal + tags | C – contextual | ✅ |
|---|---|---|---|---|
| `// !!stub ::: critical placeholder needs implementation` | `// !!temp ::: critical placeholder needs implementation` | `// !!todo ::: critical placeholder needs implementation #stub #critical` | `// !!temp ::: critical placeholder needs implementation #blocker` | |
| `// !review ::: important security audit required` | `// !note ::: important security audit required #review` | `// !todo ::: important security audit required #security #review` | `// !ci ::: important security audit required #security` | |
| `// *check ::: verify before merge` | `// *ci ::: verify before merge` | `// *todo ::: verify before merge #verification` | `// *ci ::: verify before merge` | |
| `// -done ::: completed work to remove` | `// -note ::: completed work to remove #completed` | _(remove)_ | _(remove)_ | |
| `// ?needs ::: unclear if database migration required` | `// ?note ::: unclear if database migration required #question` | `// ?todo ::: unclear if database migration required #database #clarification` | `// ?note ::: unclear if database migration required #needs-clarification` | |
| `// --draft ::: remove this draft implementation` | `// --temp ::: remove this draft implementation` | `// --temp ::: remove this draft implementation #draft` | `// --temp ::: remove this draft implementation` | |

</details>

<details>
<summary><strong>19 – Edge cases / malformed waymarks</strong></summary>

### 19.1 Malformed signals

| Current | A – fixed order | B – drop signal | C – valid alt | ✅ |
|---|---|---|---|---|
| `// !*todo ::: wrong signal order` | `// *!todo ::: wrong signal order (fixed)` | `// !todo ::: wrong signal order #corrected` | `// *!todo ::: wrong signal order (corrected)` | |
| `// _*todo ::: can't combine underscore with star` | `// *todo ::: can't combine underscore with star` | `// todo ::: can't combine underscore with star #note` | `// *todo ::: branch work (underscore removed)` | |
| `// **todo ::: double star not valid` | `// *todo ::: double star not valid (simplified)` | `// todo ::: double star not valid #simplified` | `// !!todo ::: critical work (double-bang)` | |
| `// todo fix ::: multiple markers` | `// todo ::: multiple markers (choose one primary)` | `// todo ::: multiple markers #consolidated` | `// fix ::: choose primary marker type` | |

### 19.2 Case sensitivity

| Current | A – normalise | B – preserve tag | C – strict | ✅ |
|---|---|---|---|---|
| `// TODO ::: uppercase marker` | `// todo ::: uppercase marker` | `// todo ::: uppercase marker #legacy-format` | `// todo ::: implement feature` | |
| `// TLDR ::: uppercase tldr` | `// tldr ::: uppercase tldr` | `// tldr ::: uppercase tldr #legacy-format` | `// tldr ::: file summary` | |
| `// Test ::: mixed case` | `// todo ::: mixed case` | `// todo ::: mixed case #normalized` | `// todo ::: implement feature` | |
| `// todo FIX ::: mixed case content` | `// todo ::: mixed case content` | `// todo ::: mixed case content` | `// todo ::: fix implementation` | |

</details>

---

## ✅ How to use this sheet

1. Skim each table.
2. Tick the final column or write the winning letter once you pick a standard.
3. Collapse sections you’ve already decided to keep the file tidy.

Happy migrating!
