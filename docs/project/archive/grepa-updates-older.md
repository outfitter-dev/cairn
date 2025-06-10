<!-- :ga:tldr comprehensive updates to grepa -->
# Updates to grepa

<!-- :ga:todo work through this list -->
## TODO

- [ ] Use "breadcrumb protocol" as one possible definition for the the grep-anchor format
- [x] Further define the `.` dot notation specs
- [x] Further define the `:` delimiter and how it relates to `.`
- [x] Parameterized token clarity
  - [x] Clear rules on parameter content restrictions & use
  - [x] Examples of multi-parameter patterns?
- [x] Namespace/scope patterns
  - [x] Formal namespace syntax (e.g. `:ga:service.component.tag`)
  - [x] Hierarchical organization patterns
  - [ ] Cross-reference patterns between services
  - [ ] Monorepo patterns
- [x] Linkage/reference patterns:
  - [x] File references: `:ga:see(path/to/file.js:42)`
  - [x] Symbol references: `:ga:impl(UserService.validate)`
  - [x] External links: `:ga:docs(https://...)`
- [x] Conditional markers
  - [x] Environment-specific: `:ga:env(production)`
  - [x] Feature flags: `:ga:flag(dark-mode)`
  - [x] Build variants: `:ga:platform(ios)`
- [x] Further definition of the `grepa` tool-marker
- [ ] Multi-line anchors for compatible file formats (HTML, Markdown, etc.)
- [ ] Escape/quote mechanism (regex, etc.)
  - [ ] Special characters in params
  - [ ] Multi-line anchors
  - [ ] Regex patterns in payloads

## Decisions

1. When considering the introduction of a marker, prefer those that an LLM would tokenize to a single token.
2. Each grep-anchor represents a single logical unit of information.
   - Multiple markers can appear in one anchor when they describe related aspects of the same concern (e.g., `:ga:blocked(by:issue:4),priority:high`)
3. Use of JSON within grep-anchors should be considered as an advanced use, and must have a configuration option to enable or disable it.
4. Dot notation can be used with markers for hierarchy. e.g. `:ga:gh.issue` or `:ga:priority.critical`
   - When dot notation is used, the whole marker is considered as a single logical unit.
5. Grep-anchors should be separated by commas-only.
6. If multiple markers are used within a single anchor, they should be comma-separated.
   - Any prose with a comma should be wrapped in quotes.

## Terminology

| Term | Definition | Example |
|------|------------|---------|
| **Sigil** | Literal sentinel that opens every grep-anchor. | `:ga:` |
| **Marker** | First string after the identifier. | `tldr`, `sec`, `temp` |
| **Parameter** | Optional payload tied to a single marker. | `(param)`, `[params]`, `{json}`, `=param` |
| **Mention** | A string or list of strings after the identifier and marker, preceded by an `@` symbol. | `@alice` in `:ga:owner@alice` |
| **Prose** | Free-form description that follows after the structured payload. | `try this first` |
| **Grep-anchor** | Complete structured part = identifier + marker (+ parameter|prose). | `:ga:gh(issue#4)` |
| **Variable** | A named value that can be substituted for a literal value. | `$owner=@alice` in `:ga:owner($owner)` |

### Additional Terminology Details

- **Custom Sigil**: An identifier other than `ga` used within the colons e.g. `:wham:`
- **Alias**: A marker that has a 1:1 definition with a core marker. They can be used interchangeably with core markers, and can be included or excluded within the scope of searching for its counterparts.

### Terminology Notes

- `:ga:` is chosen as it is highly unlikely that string will appear naturally anywhere in a codebase, outside of the context of grep-anchor
- 

## Character Treatment Recommendations

- Colons `:` should be use in the `:<identifier>:`
- Pipes `|` should be used as an "or"
  - Note: When a `|` is used in Markdown documents, unless it's within a comment, fenced code, or code block, it may inadvertently cause rendering issues.
- Forward slashes `/`should be used to represent paths
- Backslashes `\` should be used exclusively for escaping characters and not used in any part of a grep-anchor
- Parens `()` should be used to associate a parameter to its preceding marker
  - They should be immediately prefixed by a marker with no whitespace
- Brackets `[]` should be used to represent a list, with values separated by commas `,` or a single space.
  - They should be immediately prefixed by a marker with no whitespace between them
  - If they are used outside of the context of a list, they should be wrapped in single `'` or double `"` quotes.
- Braces `{}` should be used to represent a JSON object relating to the preceding marker
  - They should be immediately prefixed by a marker with no whitespace between them
- The dollar sign `$` should be used to represent a variable.
  - Setting a value for a variable can be done inline with `var[.key]=` followed by a non-breaking string or string wrapped in quotes.
    - Or within configuration files with `[variables.]key[.keys]: value`
  - Variables are used with `$<var>`

## Core Markers

Core Markers can be considered a standard or base set, which have an established definition. This is done to help constrain the total marker scope.

### General Markers

- `context`
  - Aliases:
    - `ctx`: This is shorter, but `context` is still preferred since it's unambiguous and is still short.
<!-- :ga:todo add definition for 'meta' -->
- `meta`: ...
- `temp`: Temporary code intended for replacement
  - Aliases: `tmp`, `placeholder`
- `todo`: A task
  - Aliases: `fixme`, `bug`, `task`, `issue` (see [issue markers](#issue-markers))

### Field Markers

- `due(date)`: A field for due dates where the payload is a date
  - Aliases: `deadline`
- `since|until(version)`: A field for versioning where the payload is a version number
  - `since`: Version introduced
  - `until`: Version for removal
- `type(value)`
  - Aliases: `kind`, `category`

### Reference Markers

- `ref`: General references
  - Aliases: `reference`
- `rel`: A relationship to another resource, concept, etc.
- `link`: A link to a resource
  - Aliases: `url`, `web`
- `path|file|dir`: A path to a specific resource
  - `file`: A file
    - Aliases: `file`, `path.file`
  - `dir`: A directory
    - Aliases: `directory`, `path.dir`
- `issue`: An issue
  - Using `issue` as a marker is a more advanced `todo` marker with additional configuration options.
  - It should always be followed by a payload of some kind, most of the time a number or issue ID.
  - `issue` :: `issue.<provider>`
  - `issue(4)` :: `issue=4` :: `issue#4` :: `issue/4`
- `pr`: A pull request
  - `pr(4)` :: `pr=4` :: `pr#4` :: `pr/4`
- `commit`: A commit with a hash as a payload

### Status Markers

- `priority`: Priority
  - Can be used with dot notation to provide further definition e.g. `:ga:priority.critical`
  - Examples:
    - `:ga:priority.high`
    - `:ga:priority.p3`
  - Aliases:
    - `p0` :: `priority.critical` :: `priority.urgent`
    - `p1` :: `priority.high`
    - `p2` :: `priority.medium`
    - `p3` :: `priority.low`
    - `p4` :: `priority.trivial`
- `status`: Status
  - Status markers have an implicit state that can be associated within a `grepaconfig.yaml` file.
  - It's possible to look up statuses by states (open, closed) or named statuses (backlog, in-progress, done, not-doing, etc.)

### Scope Markers

- `perf`: Performance
  - Aliases: `performance`
- `sec`: Security
  - Aliases: `security`

### Context-specific Markers

- `<provider>`: GitHub
  - The `gh` marker can be used to reference GitHub issues, PRs, etc.
    - Setting `github` as a provider for `issues` or `prs` will assume the `gh.*` prefix for the `issue` or `pr` markers.
    - It can also be used without using `grepa.config.yaml`
  - Aliases: `github`
  - In use: `gh.issue.4` :: `gh.issue(4)` :: `gh.issue#4` :: `gh.issue/4` :: `gh.issue`
- `jira`: Jira

### Mention-required Markers

These are markers which should be immediately followed by a mention represented with an `@` symbol. e.g. `:ga:owner@alice` or `:ga:owner[@alice,@bob]`

- `owner`: A person, agent, or group responsible for something (todo, approval, etc.)
- `assignee`: A person, agent, or group assigned to something (todo, approval, etc.)

## Marker Styleguide

- Markers should be kept short, but not so short so as to result in a potentially ambiguous meaning e.g. `dep` could mean "depends-on" or "dependency"
  - To whatever degree possible, markers should be tokenizable to just a single token.

## Variables

Variables are used to store values that can be substituted for a literal value. They can be set within files directly, or within configuration files.

### File Variables

File variables can be set with individual anchors, or as a list within a single anchor (subject to line length). They do not require the use of a configuration file to work with the Grepa CLI.

```markdown
# grepa-examples.md
<!-- :ga:var.owner=@alice -->

...

<!-- :ga:owner=$owner -->
```

### Configured Variables

<!-- :ga:rel(cli, file:grepaconfig.yaml) -->

## Grepa Configuration



| Type | Path | Description |
|------|------|-------------|
| Global | `~/.grepa/grepaconfig.yaml` | Global configuration |
| Repository | `.grepa/grepaconfig.yaml` | Repository configuration |
| Local | `.grepa/grepaconfig.local.yaml` | Local configuration |
| File | File frontmatter or with `:ga:grepa*` | File-specific configuration |

Config priority: File ← Local ← Global ← Repository

### grepaconfig.yaml Example

By default most of these keys are not required.

```yaml
# ./grepa/grepaconfig.yaml
---
meta:
  name: grepa
  version: 0.1.0
  type: git
  url: git+https://github.com/galligan/grepa.git

format:
  anchors: ":ga:" # override identifier (optional)
  markers:
    case: default # or lower,upper,kebab,snake,camel
    maxLength: 10 # default 10
    aliases: true # default true

files:
  gitignore: true  # respects .gitignore by default
  include: ["*.{ts,js,tsx}"] # config beyond .gitignore
  exclude: ["dist/**"]

lint:
  forbid:
    - marker: ["temp"]
      field: "since"     # or "v"
      maxValue: 90 # days

dictionary:
  sec:
    title: "Security"
    description: "Security-sensitive code"
    aliases: ["security"]

todos:
  marker: issue
  status:
    open:
      backlog:
        title: "Backlog"
        description: "A task that is not yet started"
      in-progress:
        title: "In Progress"
        description: "A task that is currently being worked on"
    closed:
      done:
        title: "Done"
        description: "A task that has been completed"
      not-doing:
        title: "Not Doing"
        description: "A task that is not being worked on"

issues: github # or jira, linear, etc.
  # url: https://github.com/owner/repo # optional

pull-requests: github # or gitlab, bitbucket, etc.
  # optional url: https://github.com/owner/repo

variables:

```

Default keys:

- `meta`: Can be inferred through `package.json` files
  - Within monorepos, the directory structure is used to infer the data
- `dictionary`: Allows for customization of markers and their aliases
- `status`
  - `open`: `backlog`, `in-progress`
  - `closed`: `done`, `not-doing`
- `issues`: `github`
- `pull-requests`: `github`

### grepaconfig.local.yaml Example

```yaml
# ./grepa/grepaconfig.local.yaml
---
user:
  name: Matt Galligan
  email: matt.galligan@gmail.com
  github: galligan

```

<!-- :ga:temp,todo(@claude: "expand these stub sections with detailed specifications based on our discussion") -->
## Claude Notes

### Marker Parameter Specification

- Define formal grammar for `markerParam` syntax
- Parameter types: string, quotedString, array, keyValue, json
- Rules for when quotes are required vs optional
- Examples showing each parameter type in context
- Error cases and edge cases

### Colon Delimiter Use Cases

- Time-based parameters (14:30, 2:45:00)
- Ranges and ratios (1.0:2.0, 16:9)
- Namespaced references (lodash:debounce, api:v2:users)
- Key-value pairs within parameters (env:prod, cache:redis)
- Protocol/scheme references (https://, jira:PROJ-123)
- Coordinate systems (file:line:column, x:y positions)
- Guidelines on when to use `:` vs other delimiters

### Dot Notation vs Colon Delimiter

- Clear distinction between marker hierarchy (dots) and parameter relationships (colons)
- Examples: `:ga:priority.high` vs `:ga:deploy(env:prod)`
- Search behavior with hierarchical markers
- How grep/ripgrep patterns work with dot notation
- Best practices for choosing between approaches

**Decision Framework:**

- Use dots (`.`) for genuine hierarchies: parent.child relationships, object structures, code organization
  - `:ga:api.v2.users` (users endpoint of v2 of api)
  - `:ga:config.cache.redis` (redis settings of cache of config)
  - `:ga:module.auth.login` (login function of auth module)
- Use colons (`:`) for type:value relationships: classifications, states, categories
  - `:ga:priority:critical` (priority IS critical)
  - `:ga:status:blocked` (status IS blocked)
  - `:ga:env:production` (environment IS production)
- Mixed patterns possible: `:ga:api.v2:deprecated` (v2 of api IS deprecated)
- Revision needed: change `priority.high` examples to `priority:high` throughout docs

### Breadcrumb Protocol Definition

- Conceptual framework for grep-anchors as navigation breadcrumbs
- How anchors create a traversable path through code
- Relationship to AI agent navigation patterns
- Examples of breadcrumb trails in practice

### Multi-Parameter Patterns

- Whether multiple parameters are needed given current syntax
- Alternative: multiple key:value pairs within single parameter
- Trade-offs between `marker(p1,p2)` vs `marker(key1:val1,key2:val2)`
- Recommendation on standard approach

### Escape and Quoting Mechanisms

- How to handle special characters in parameters
- Escape sequences for quotes, colons, parentheses
- Multi-line content in comments (HTML/markdown)
- Regex patterns within parameters
- Shell-safe considerations

### Alias System

**Core Concept:** Aliases provide shortcuts for common marker patterns, improving readability and reducing typing.

**Types of Aliases:**

1. **Simple Aliases (1:1 mapping)**
```javascript
// Status shortcuts
// :ga:blocked              → :ga:status:blocked
// :ga:done                 → :ga:status:done
// :ga:wip                  → :ga:status:in-progress

// Priority shortcuts  
// :ga:p0                   → :ga:priority:critical
// :ga:p1                   → :ga:priority:high
// :ga:critical             → :ga:priority:critical
```

2. **Compound Aliases (1:many mapping)**
```javascript
// Single alias expands to multiple markers
// :ga:blocker              → :ga:status:blocked,priority:critical
// :ga:hotfix               → :ga:priority:critical,type:fix
// :ga:ship-blocker         → :ga:status:blocked,priority:critical,blocking(release:current)
```

3. **Context-Dependent Aliases**
```javascript
// Alias meaning depends on configuration or context
// :ga:urgent
//   - In issues context    → :ga:priority:critical
//   - In calendar context  → :ga:due(today)
//   - In support context   → :ga:sla:4h
```

**Alias Resolution Rules:**
1. Check for exact alias match in configuration
2. If ambiguous, prefer the most specific context
3. If still ambiguous, treat as literal marker
4. Aliases can be disabled via configuration

**Configuration Example:**
```yaml
dictionary:
  aliases:
    blocked: "status:blocked"
    p0: "priority:critical"
    blocker: ["status:blocked", "priority:critical"]
    urgent:
      default: "priority:high"
      contexts:
        issues: "priority:critical"
        calendar: "due:today"
```

**Search Implications:**
- `rg ":ga:blocked"` should find both `:ga:blocked` AND `:ga:status:blocked`
- Tools can expand aliases during search
- `--no-alias` flag to search literally

### Templated Aliases

**Core Concept:** Aliases that accept parameters and interpolate values, enabling reusable patterns.

**Template Syntax:**

1. **Positional Parameters ($1, $2, etc.)**
```javascript
// Definition
// jira: "issue(jira:$1)"

// Usage → Expansion
// :ga:jira(PROJ-123)      → :ga:issue(jira:PROJ-123)
// :ga:jira(TEAM-456)      → :ga:issue(jira:TEAM-456)
```

2. **Named Parameters**
```javascript
// Definition
// assigned: "todo,owner@$owner,priority:$priority"

// Usage → Expansion
// :ga:assigned(owner:alice,priority:high)     → :ga:todo,owner@alice,priority:high
// :ga:assigned(owner:bob,priority:low)        → :ga:todo,owner@bob,priority:low
```

3. **Optional Parameters with Defaults**
```javascript
// Definition
// feature: "type:feature,status:$status ?? planned,epic:$epic"

// Usage → Expansion
// :ga:feature(epic:auth)                      → :ga:type:feature,status:planned,epic:auth
// :ga:feature(epic:auth,status:in-progress)   → :ga:type:feature,status:in-progress,epic:auth
```

4. **Variable References**
```javascript
// Variables defined elsewhere
// :ga:var.team=payments
// :ga:var.sprint=2024-03

// Definition
// sprint-task: "todo,team:$team,sprint:$sprint,assigned@$1"

// Usage → Expansion
// :ga:sprint-task(alice)   → :ga:todo,team:payments,sprint:2024-03,assigned@alice
```

5. **Complex Templates**
```javascript
// Definition
// blocker-chain: "blocked(by:$1),blocking($2),priority:$3 ?? high"

// Usage → Expansion
// :ga:blocker-chain(issue:4,issue:[7,10])        
// → :ga:blocked(by:issue:4),blocking(issue:[7,10]),priority:high

// :ga:blocker-chain(pr:123,release:2.0,critical)
// → :ga:blocked(by:pr:123),blocking(release:2.0),priority:critical
```

6. **Array Handling in Templates**
```javascript
// Problem: $1 could mean "first parameter" or "first array element"

// Solution 1: Different syntax for arrays
// $1    = first parameter (whole value)
// $1[0] = first element if parameter is array
// $1[*] = all elements (spread)
// $1[]  = all elements (as array)

// Definition
// multi-block: "blocked(by:$1[*]),priority:$2"

// Usage → Expansion
// :ga:multi-block([issue:4,issue:7],high)
// → :ga:blocked(by:issue:4,issue:7),priority:high

// Solution 2: Explicit array operations
// $1:all      = entire array
// $1:first    = first element
// $1:last     = last element
// $1:join     = join with comma
// $1:count    = number of elements

// Definition  
// review-needed: "needs:review,reviewers:$1,count:$1:count"

// Usage → Expansion
// :ga:review-needed([@alice,@bob,@charlie])
// → :ga:needs:review,reviewers:[@alice,@bob,@charlie],count:3

// Solution 3: Named parameters with array support
// Definition
// bulk-assign: "type:$type,assigned:$users[*],team-size:$users:count"

// Usage → Expansion
// :ga:bulk-assign(type:bug,users:[@alice,@bob])
// → :ga:type:bug,assigned:@alice,@bob,team-size:2
```

**Configuration Example:**
```yaml
dictionary:
  templates:
    # Simple positional
    gh: "issue(github:$1)"
    jira: "issue(jira:$1)"
    
    # Named parameters
    assigned:
      template: "todo,owner@$owner,priority:$priority"
      params:
        owner: required
        priority: { default: "medium" }
    
    # Complex with validation
    migration:
      template: "todo,type:migration,from:$from,to:$to,deadline:$deadline"
      params:
        from: { required: true, pattern: "v\\d+\\.\\d+" }
        to: { required: true, pattern: "v\\d+\\.\\d+" }
        deadline: { type: "date" }
```

**Template Resolution Rules:**
1. Parse template parameters from the alias usage
2. Validate required parameters are present
3. Apply defaults for missing optional parameters
4. Interpolate variables in order: local → file → repo → global
5. Expand the template with substituted values

**Use Cases:**
- Project-specific issue patterns
- Team conventions (e.g., always include sprint in todos)
- Standardized migration markers
- Reusable dependency patterns

### Template Search and Discovery

**Core Concept:** Finding grep-anchors by template name, with ripgrep-like ergonomics.

**Basic discovery:**
```bash
grepa find --template "release-blocked"
# Output:
src/auth.js:42:    :ga:release-blocked(4,@alice)
src/api.js:17:     :ga:release-blocked(7,@bob)  
src/payment.js:89: :ga:release-blocked(12,@charlie)
# Found 3 instances of 'release-blocked' template
```

**Wildcard filtering:**
```bash
grepa find --template "release-blocked(4,*)"        # first param is 4
grepa find --template "release-blocked(*,@alice)"   # second param is @alice
grepa find --template "release-blocked(*,@*)"       # second param is any mention
```

**Show expanded form:**
```bash
grepa find --template "release-blocked" --show-expanded
# Shows both template usage and expansion:
src/auth.js:42:    :ga:release-blocked(4,@alice)
                   → :ga:blocked(by:issue:4),owner:@alice,priority:critical
```

**Additional flags (rg-inspired):**
```bash
grepa find -T release-blocked    # find Template uses only (not expanded)
grepa find -E release-blocked    # find Expanded results only
grepa find --no-expand blocked   # disable alias expansion
```

**Interactive mode:**
- When no parameters specified, shows all instances
- Can then filter interactively by parameter patterns
- Maintains ripgrep's philosophy of fast, grep-like searching

### Linkage and Reference Patterns

**Core Concept:** Patterns for referencing files, code symbols, and external resources.

**File References:**
```javascript
// Relative paths (from current file)
// :ga:see(../utils/helper.js:42)
// :ga:see(./constants.js:15:7)         // line:column

// Absolute paths (from project root)
// :ga:see(/src/utils/helper.js:42)
// :ga:ref(/docs/architecture.md:15)

// Section references (# = section/fragment)
// :ga:see(docs/api.md#authentication)   // Markdown heading
// :ga:see(index.html#contact)           // HTML element id
// :ga:see(UserGuide.pdf#chapter-3)      // PDF section
```

**Symbol References - Three Approaches (all valid):**

1. **Full path for precision:**
```javascript
// :ga:impl(/src/user_service.py:UserService.validate)
// :ga:impl(/src/auth.ts:AuthService.checkPermissions)
```

2. **Natural language syntax:**
```javascript
// Let developers use their language's conventions
// :ga:impl(UserService.validate)      // Python/JS/TS dots
// :ga:impl(UserService::validate)     // C++ double colon
// :ga:impl(UserService#validate)      // Ruby/Java instance
// :ga:impl(auth.ValidateUser)         // Go package.Function
```

3. **Aliases for common symbols:**
```javascript
// Define in config:
// validate-user: "impl(/src/services/auth.ts:UserService.validate)"
// Then use: :ga:validate-user
```

**External Links - Auto-detection:**
```javascript
// Anything with :// is treated as external
// :ga:docs(https://example.com/api)
// :ga:ref(postgres://db:5432/schema)
// :ga:link(slack://channel/C1234567)
// :ga:spec(file:///local/docs/spec.pdf)
```

**Templates for Common References:**
```javascript
// Template definitions
rfc: "ref(https://datatracker.ietf.org/doc/html/rfc$1)"
mdn: "docs(https://developer.mozilla.org/en-US/docs/Web/$1)"

// Usage
// :ga:rfc(7231)         → :ga:ref(https://datatracker.ietf.org/doc/html/rfc7231)
// :ga:mdn(API/fetch)    → :ga:docs(https://developer.mozilla.org/en-US/docs/Web/API/fetch)
```

**Smart Resolution:**
- Full paths always work (unambiguous)
- Natural syntax works when context is clear (same language/module)
- File extension helps determine language conventions
- Aliases provide shortcuts for frequently referenced symbols
- `#` is context-aware based on file type:
  - In `.md`, `.html`, `.htm` files → section/fragment
  - In `.rb`, `.java` files → instance method
  - In `.pdf` files → section/chapter
  - Default behavior can be configured per project

### Anchor Structure and Prose Attribution

**Core Concept:** Clear separation between structured markers and associated prose.

**Format:**
```
:ga:<comma-separated-markers> <optional-prose>
```

**The Space Delimiter Rule:**
- First space after the last valid marker/parameter marks the prose boundary
- Everything after this space is prose associated with the entire anchor
- The prose belongs to all markers in the anchor, not just the last one

**Examples:**
```javascript
// :ga:todo,id:auth-impl implement authentication here
//     ^^^^^^^^^^^^^^^^^ structured markers
//                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ prose

// :ga:bug,priority:high,id:mem-1 memory leak in user service  
//     ^^^^^^^^^^^^^^^^^^^^^^^^^^ structured
//                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ prose

// :ga:sec validate all user inputs
//     ^^^ marker
//         ^^^^^^^^^^^^^^^^^^^^^^^^ prose

// :ga:todo,blocked(by:#api-2) waiting for API completion
//     ^^^^^^^^^^^^^^^^^^^^^^^ structured  
//                              ^^^^^^^^^^^^^^^^^^^^^^^^^^ prose
```

**Query Results Include Prose:**
```bash
grepa list todo
# auth.js:42: todo - "implement authentication here" [id:auth-impl]
# api.js:17:  todo - "add rate limiting" [priority:high]

grepa show id:auth-impl
# auth.js:42: :ga:todo,id:auth-impl implement authentication here
# Markers: todo, id:auth-impl  
# Prose: "implement authentication here"
```

**Benefits:**
- Natural to write and read
- No special quoting needed for prose
- Clear parsing boundary
- Prose is searchable and attributable

### ID System

**Core Concept:** Flexible ID system for cross-referencing anchors.

**ID Assignment:**
```javascript
// Manual ID as comma-separated marker
// :ga:todo,id:auth-impl implement authentication
// :ga:sec,id:validate-input,priority:high validate all inputs

// Future: auto-generated IDs
// grepa get -s id auth.js:42  → generates: id:7f3d2a
```

**Referencing with #:**
```javascript
// :ga:see(#auth-impl)
// :ga:blocked(by:#validate-input)  
// :ga:depends(on:#mem-leak-1)
// :ga:related(#auth-impl,#validate-input)
```

**Workflow Example:**
```bash
# Find anchor
rg ":ga:todo" auth.js

# Generate ID for existing anchor
grepa get -s id auth.js:42
# Generated: auth-7f3d2a

# Update anchor with ID
# :ga:todo,id:auth-7f3d2a implement authentication

# Reference elsewhere
# :ga:blocked(by:#auth-7f3d2a)
```

**UUID Concept (Future Enhancement):**

Auto-generated unique identifiers for anchors:

```javascript
// Automatic UUID assignment
// :ga:todo implement auth
// grepa could auto-assign: :ga:todo,uuid:7f3d2a1b implement auth

// UUID generation strategies:
// 1. Short hash (6-8 chars): 7f3d2a1b
// 2. Timestamp-based: 20240115-4a2f
// 3. Content-based: hash of file+line+content
// 4. Sequential: proj-0001, proj-0002

// Benefits:
// - Stable references even if line numbers change
// - Guaranteed uniqueness across project
// - Enable anchor version tracking
// - Support refactoring tools

// UUID modes:
grepa init --uuid=auto        # Auto-assign to all anchors
grepa init --uuid=manual      # Only when requested
grepa init --uuid=short       # Use short hashes
grepa init --uuid=timestamp   # Use timestamp-based

// Lookup remains simple:
// :ga:see(#7f3d2a1b)
// :ga:blocked(by:#7f3d2a1b)
```

### Tag System and Navigation

**Core Concept:** Wiki-style linking and navigation through tags and markers.

**Implicit Tags:**
- Every marker automatically becomes a searchable tag
- `:ga:todo,priority:high` creates implicit tags: `#todo`, `#priority:high`
- `:ga:component:auth.oauth` creates: `#component:auth.oauth`

**Explicit Tags in Prose:**
```javascript
// :ga:todo implement OAuth for #aisdk using #auth.oauth.google
// :ga:doc API reference for #api.v2.users #breaking-change
// :ga:module,id:ai-core Main AI SDK module #aisdk
```

**Hierarchical Navigation:**
```javascript
#auth               // matches all auth-related
#auth.oauth         // matches auth.oauth and deeper
#auth.oauth.google  // specific match

// :ga:component:auth.oauth.google
// Matched by: #auth, #auth.oauth, #auth.oauth.google
```

**Creating Relationships:**
```javascript
// Define a "home" for a concept
// :ga:module,id:ai-core Main AI SDK module #aisdk

// Link other anchors to it
// :ga:todo,rel(#aisdk) implement streaming
// :ga:bug,rel(#aisdk) fix token counting
```

**Search Operators:**
```bash
# Text search (anywhere in anchor)
grepa find auth              # finds "auth" in markers, prose, anywhere

# Semantic search (tags + markers)
grepa find #auth             # finds all auth tags and markers

# Type-specific searches
grepa find tag:auth          # prose tags containing "auth"
grepa find tag=auth          # prose tags exactly "#auth"
grepa find marker:auth       # markers containing "auth"
grepa find marker=auth       # markers exactly "auth"

# Exclusion operators
grepa find tag!:auth         # tags NOT containing "auth"
grepa find tag!=auth         # tags NOT exactly "#auth"
grepa find marker!:auth      # markers NOT containing "auth"
grepa find marker!=auth      # markers NOT exactly "auth"
```

**Search Examples:**
```javascript
// Given:
// :ga:todo implement OAuth #auth #auth-service
// :ga:component:auth.oauth #auth.oauth.google

grepa find auth              // ✓ both (text match anywhere)
grepa find #auth             // ✓ both (semantic match)
grepa find tag:auth          // ✓ both (prose tags with auth)
grepa find tag=auth          // ✓ first only (exact #auth)
grepa find tag!=auth-service // ✓ second (doesn't have exact #auth-service)
grepa find marker:auth       // ✓ second only (component:auth.oauth)
```

**Operator Summary:**
- `:` = contains/prefix match (include)
- `=` = exact match (include)
- `!:` = not contains (exclude)
- `!=` = not exact match (exclude)

### Conditional Scopes

**Core Concept:** Conditional values based on environment, platform, or other contexts using scope syntax.

**Syntax:**
```
marker:scope[condition1(value1),condition2(value2)]
```

**Examples:**
```javascript
// :ga:config:env[prod(sk-live-123),dev(sk-test-789)]
// :ga:endpoint:region[us(api-us.com),eu(api-eu.com)]
// :ga:timeout:platform[ios(30),android(60),web(45)]
// :ga:auth:env[prod(clerk),dev(none),test(mock)]
```

**Standard Scopes:**

1. **env** - Environment/deployment context
   - Common values: dev, staging, prod, test, local
   - `:ga:database:env[prod(postgres://prod),dev(sqlite:local.db)]`

2. **platform** - Operating system or runtime
   - Common values: ios, android, web, windows, linux, macos
   - `:ga:storage:platform[ios(keychain),android(keystore),web(localstorage)]`

3. **build** - Build configuration
   - Common values: debug, release, profile, test
   - `:ga:logging:build[debug(verbose),release(error)]`

4. **region** - Geographic or datacenter region
   - Common values: us, eu, asia, us-east-1, etc.
   - `:ga:latency:region[us(50ms),eu(100ms),asia(150ms)]`

5. **version** - Version constraints
   - Common values: version numbers, ranges
   - `:ga:feature:version[<2.0(disabled),>=2.0(enabled)]`

6. **tier** - Service tier or plan level
   - Common values: free, pro, enterprise
   - `:ga:limit:tier[free(100),pro(1000),enterprise(unlimited)]`

7. **mode** - Application mode
   - Common values: readonly, maintenance, normal
   - `:ga:access:mode[readonly(false),maintenance(admin-only)]`

**Scope Markers (standalone usage):**
```javascript
// Scopes can also be used as regular markers
// :ga:env:prod use production settings
// :ga:platform:ios handle iOS-specific behavior  
// :ga:build:debug include debug assertions
// :ga:region:eu comply with GDPR
// :ga:version:2.0 new feature added
```

**Query Examples:**
```bash
# Find all production configs
grepa find env:prod

# Find all conditional configs
grepa find ":scope["

# Find configs that vary by environment
grepa find ":env["
```

**Benefits:**
- Single anchor for all conditional values
- Clear scope declaration
- Reusable scope definitions
- Works as both conditional syntax and standalone markers

### Relational Markers

**Core Concept:** Markers that express causal relationships or dependencies using the pattern `marker(relation:target)`

**Syntax Components:**
- `marker` - the state/status (blocked, requires, awaiting, depends)
- `relation` - the relationship type (by, from, on, to)
- `target` - what it's related to (issue:4, @alice, pr:123)

**Single Target Examples:**
```javascript
// :ga:blocked(by:issue:4)         blocked BY issue #4
// :ga:requires(approval:@alice)   requires approval FROM alice
// :ga:awaiting(response:@client)  awaiting response FROM client
// :ga:depends(on:auth-service)    depends ON auth service
// :ga:refs(impl:UserService.validate)  references implementation
```

**Multiple Targets (Array Notation):**
```javascript
// :ga:blocked(by:[issue:4,issue:7])     blocked by multiple issues
// :ga:blocked(by:[issue:4,pr:123,@alice]) blocked by mixed types
// :ga:requires(approval:[@alice,@bob])   requires multiple approvals
```

**Bidirectional Relationships:**
```javascript
// :ga:blocked(by:issue:4),blocking(issue:[7,10])
// This is blocked by #4 AND blocks #7 and #10

// :ga:blocked(by:deploy:prod),blocking(release:2.0)
// Blocked by deployment, blocks release

// :ga:blocked(by:@alice),blocking(feature:[dark-mode,auth-v2])
// Blocked by Alice, blocks multiple features
```

**Key Patterns:**
- `blocked(by:X)` - what's blocking this item
  - `blocked(by:issue:[4,7])` - blocked by multiple issues
- `blocking(Y)` - what this item blocks
- Target type is implicit in the value (issue:, pr:, @mention, etc.)
- Use arrays `[...]` for multiple targets within same relationship
- Separate markers with commas for multiple relationships

**Automation Implications:**
- When issue #4 closes → find all `:ga:blocked(by:issue:4)`
- Can trace dependency chains through blocking relationships
- GitHub Actions can parse and update these relationships