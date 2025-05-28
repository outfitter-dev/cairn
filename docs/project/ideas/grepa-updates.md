<!-- :ga:tldr comprehensive updates to grepa -->
# Updates to grepa

<!-- :ga:todo work through this list -->
## TODO

- [x] Use "breadcrumb protocol" as one possible definition for the the grep-anchor format
- [x] Further define the `.` dot notation specs
- [x] Further define the `:` delimiter and how it relates to `.`
- [x] Parameterized token clarity
  - [x] Clear rules on parameter content restrictions & use
  - [x] Examples of multi-parameter patterns?
- [x] Namespace/scope patterns
  - [x] Formal namespace syntax (e.g. `:ga:service.component.tag`)
  - [x] Hierarchical organization patterns
  - [x] Cross-reference patterns between services
  - [x] Monorepo patterns
- [x] Linkage/reference patterns:
  - [x] File references: `:ga:see(path/to/file.js:42)`
  - [x] Symbol references: `:ga:impl(UserService.validate)`
  - [x] External links: `:ga:docs(https://...)`
- [x] Conditional markers
  - [x] Environment-specific: `:ga:env(production)`
  - [x] Feature flags: `:ga:flag(dark-mode)`
  - [x] Build variants: `:ga:platform(ios)`
- [x] Further definition of the `grepa` tool-marker
- [x] Multi-line anchors for compatible file formats (HTML, Markdown, etc.)
- [x] Escape/quote mechanism (regex, etc.)
  - [x] Special characters in params
  - [x] Multi-line anchors
  - [x] Regex patterns in payloads

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
| **Marker** | First string after the sigil. | `tldr`, `sec`, `temp` |
| **Parameter** | Optional payload tied to a single marker. | `(param)`, `[params]`, `{json}`, `=param` |
| **Mention** | A string or list of strings after the sigil and marker, preceded by an `@` symbol. | `@alice` in `:ga:owner@alice` |
| **Prose** | Free-form description that follows after the structured payload. | `try this first` |
| **Grep-anchor** | Complete structured part = sigil + marker (+ parameter|prose). | `:ga:gh(issue#4)` |
| **Variable** | A named value that can be substituted for a literal value. | `$owner=@alice` in `:ga:owner($owner)` |

### Additional Terminology Details

- **Custom Sigil**: An identifier other than `ga` used within the colons e.g. `:wham:`
- **Synonym**: A marker that has a 1:1 definition with another marker. Different words for the exact same concept. They can be used interchangeably and are just search/display preferences. Examples: `ctx` ↔ `context`, `start-here` ↔ `entry`
- **Alias**: A shortcut that expands to more complex patterns or syntax. Involves actual syntax transformation during processing. Examples: `p0` → `priority:critical`, `blocked` → `rel(blocked-by:$1)`

### Terminology Notes

- `:ga:` is chosen as it is highly unlikely that string will appear naturally anywhere in a codebase, outside of the context of grep-anchor
- 

## Character Treatment Recommendations

- Colons `:` should be use in the `:<sigil>:`
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
  - Synonyms: `ctx`
<!-- :ga:todo add definition for 'meta' -->
- `meta`: ...
- `needs`: Prerequisites or missing requirements
  - Examples: `needs(specs)`, `needs(documentation)`, `needs(review)`
  - Synonyms: `requires`, `missing`
- `temp`: Temporary code intended for replacement
  - Synonyms: `tmp`, `placeholder`
- `todo`: A task
  - Synonyms: `fixme`, `bug`, `task`, `issue` (see [issue markers](#issue-markers))

### Navigation Markers

- `entry`: Entry points and main interfaces for understanding code flow
  - Examples: `entry`, `entry(api)`, `entry(auth)`
  - Synonyms: `start-here`
- `explains`: Documentation and explanatory content
  - Examples: `explains(auth-flow)`, `explains(business-logic)`
  - Synonyms: `about`, `why`, `describes`, `clarifies`

### Code Quality Markers

- `impact`: Change impact assessment with typed severity
  - Examples: `impact:high`, `impact([perf:high,api:low])`, `impact([breaking:api,security:medium])`
- `pattern`: Design pattern documentation
  - Examples: `pattern(singleton)`, `pattern(observer)`, `pattern(factory)`
- `state`: State management and mutability markers
  - Examples: `state:global`, `state:immutable`, `state:cached`

### Field Markers

- `due(date)`: A field for due dates where the payload is a date
  - Aliases: `deadline`
- `since|until(version)`: A field for versioning where the payload is a version number
  - `since`: Version introduced
  - `until`: Version for removal
  - Version notation supports multiple styles (configurable):
    - Semver: `^1.2.0`, `~1.2.0`, `>=1.2.0`, `>=1.2.0 <2.0.0`
    - Python: `==1.2.0`, `~=1.2.0`, `>=1.2.0,<2.0.0`
    - Maven: `[1.2.0]`, `[1.2.0,2.0.0)`, `[1.2.0,)`
    - Ruby: `~> 1.2.0`, `>= 1.2.0, < 2.0`
    - Examples: `:ga:since:^1.2.0`, `:ga:until:[3.0.0,)`, `:ga:compat:>=1.2.0,<2.0.0`
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
  anchors: ":ga:" # override sigil (optional)
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

priorities:
  scheme: "numeric"  # or "named"
  numeric:
    p0: "critical"
    p1: "high"
    p2: "medium"
    p3: "low"
    p4: "trivial"
  named:
    critical: "p0"
    high: "p1"
    medium: "p2"
    low: "p3"
    trivial: "p4"
  aliases:
    urgent: "critical"
    blocker: "critical"
    nice-to-have: "trivial"

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

versioning:
  style: "semver"  # or "python", "ruby", "maven", "go", etc.
  
  # Style definitions (examples)
  semver:
    exact: "=1.2.0"
    compatible: "^1.2.0" 
    patch-level: "~1.2.0"
    minimum: ">=1.2.0"
    range: ">=1.2.0 <2.0.0"
    
  python:
    exact: "==1.2.0"
    compatible: "~=1.2.0"
    minimum: ">=1.2.0"
    range: ">=1.2.0,<2.0.0"
    
  maven:
    exact: "[1.2.0]"
    range: "[1.2.0,2.0.0)"
    minimum: "[1.2.0,)"

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

**Core Concept:** Grepa as a "breadcrumb protocol" - a standardized way to leave navigational markers throughout codebases that both humans and AI agents can follow.

**The Breadcrumb Metaphor:**

**Traditional breadcrumbs** (Hansel & Gretel): Leave a trail to find your way back  
**Web breadcrumbs**: Show navigation path (Home > Products > Laptops > Dell)  
**Grep-anchor breadcrumbs**: Mark important locations for future discovery and navigation

**As a breadcrumb protocol, grepa provides:**

1. **Trail Markers** - Standardized markers for important code locations
   - `:ga:todo` - "work needed here"
   - `:ga:sec` - "security-sensitive location" 
   - `:ga:ctx` - "important context to understand"
   - `:ga:bug` - "known issue location"

2. **Navigation Paths** - Relationships between marked locations
   - `:ga:rel(depends:auth-service)` - "this connects to auth"
   - `:ga:rel(blocks:feature-x)` - "this prevents that"
   - `:ga:see(auth.js:42)` - "related code over there"

3. **Context Clues** - Human-readable explanations
   - Prose after markers explains WHY this location matters
   - `:ga:todo,priority:high implement rate limiting before launch`

4. **Discovery Mechanism** - Tools to follow the trail
   - `rg ":ga:todo"` - find all work locations
   - `grepa trace --from auth --to payment` - follow dependency trail
   - `grepa map --service auth` - see all auth-related breadcrumbs

**Protocol Benefits:**

- **Leaves a trail** for future developers (including your future self)
- **AI-navigable** - agents can follow breadcrumbs to understand code structure
- **Cross-project consistency** - same breadcrumb format across all codebases
- **Searchable and parseable** - tools can build navigation maps
- **Human-friendly** - readable prose alongside structured markers
- **Relationship-aware** - breadcrumbs can point to other breadcrumbs

**Breadcrumb Trail Examples:**

```javascript
// Trail from feature request to implementation
// docs/features/oauth.md: :ga:feature,id:oauth-impl OAuth integration feature
// src/auth/oauth.js: :ga:rel(implements:oauth-impl),todo add Google provider
// src/auth/providers/google.js: :ga:rel(implements:oauth-impl) Google OAuth provider
// tests/auth/oauth.test.js: :ga:rel(tests:oauth-impl) OAuth integration tests
```

**Why "Protocol":**
- **Standardized format** - consistent syntax rules across languages/projects
- **Interoperable** - works with any text-based codebase
- **Tool-agnostic** - readable by grep, ripgrep, custom parsers
- **Extensible** - teams can add domain-specific breadcrumb types
- **Versioned** - protocol can evolve while maintaining compatibility

The breadcrumb protocol framing positions grepa as a fundamental navigation infrastructure for codebases, not just a commenting convention. It's about creating a **navigational mesh** that makes codebases more discoverable and understandable.

### Multi-Parameter Patterns

- Whether multiple parameters are needed given current syntax
- Alternative: multiple key:value pairs within single parameter
- Trade-offs between `marker(p1,p2)` vs `marker(key1:val1,key2:val2)`
- Recommendation on standard approach

### Priority Scheme Configuration

**Core Concept:** Teams can configure their preferred priority notation system in grepaconfig.yaml.

**Scheme Types:**

1. **Numeric Scheme (`scheme: "numeric"`)** - Primary notation is p0/p1/p2
```yaml
priorities:
  scheme: "numeric"
  numeric:
    p0: "critical"     # :ga:p0 → :ga:priority:critical
    p1: "high"         # :ga:p1 → :ga:priority:high
    p2: "medium"       # :ga:p2 → :ga:priority:medium
    p3: "low"          # :ga:p3 → :ga:priority:low
    p4: "trivial"      # :ga:p4 → :ga:priority:trivial
```

2. **Named Scheme (`scheme: "named"`)** - Primary notation is critical/high/medium
```yaml
priorities:
  scheme: "named"
  named:
    critical: "p0"     # :ga:critical → :ga:priority:critical
    high: "p1"         # :ga:high → :ga:priority:high
    medium: "p2"       # :ga:medium → :ga:priority:medium
    low: "p3"          # :ga:low → :ga:priority:low
    trivial: "p4"      # :ga:trivial → :ga:priority:trivial
```

**Search Behavior:**
```bash
# Both schemes allow searching by any notation
grepa find priority:critical    # Works regardless of scheme
grepa find p0                   # Works regardless of scheme
grepa find high                 # Works regardless of scheme

# Tools can normalize display based on scheme preference
grepa list --priority
# Numeric scheme shows: p0, p1, p2, p3, p4
# Named scheme shows: critical, high, medium, low, trivial
```

**Custom Aliases:**
```yaml
priorities:
aliases:
    nice-to-have: "trivial" # :ga:nice-to-have → :ga:priority:trivial
```

**Benefits:**
- Team consistency (everyone uses same notation)
- Tool integration (IDEs can show dropdowns with team's preferred scheme)
- Search normalization (all priority searches work regardless of input format)
- Migration support (can gradually shift from one scheme to another)

### Multi-line Anchor Syntax

**Core Concept:** Allow anchor markers to span multiple lines for readability while preserving the "single anchor == one complete thought" principle.

**Supported in multi-line comment formats:**
- HTML: `<!-- :ga: ... -->`
- CSS/JS/C++: `/* :ga: ... */`
- Python docstrings: `""" :ga: ... """`

**Syntax Rules:**

1. **Opening pattern:** Comment start + `:ga:` on first line
2. **Marker lines:** Indented markers, one per line or comma-separated
3. **Prose constraint:** Optional prose must be on same line as final marker
4. **Closing pattern:** Comment end

**Examples:**

```html
<!-- :ga:
  todo,
  priority:critical,
  blocked(by:issue:4),
  owner@alice fix authentication bug
-->
```

```javascript
/* :ga:
   config:env[
     prod(api-prod.company.com),
     staging(api-staging.company.com),
     dev(localhost:3000)
   ]
   endpoint configuration for environments
*/
```

```python
""" :ga:
    api,
    module:auth,
    since:v2.0 main authentication module
"""
```

**Formatting Guidelines:**
- Use consistent indentation (2-4 spaces)
- Align related markers vertically when possible
- Keep prose on final marker line (maintains single-thought principle)
- Break long parameter lists across lines for readability

**ripgrep Search Implications:**

**Standard single-line search patterns won't work:**
```bash
# This WON'T find multi-line anchors
rg ":ga:todo"                    # Misses multi-line variants
rg ":ga:config:env\[.*\]"        # Misses multi-line parameters
```

**Multi-line search patterns required:**
```bash
# Find opening patterns (good starting point)
rg "<!-- :ga:|/\* :ga:|\"\"\" :ga:"

# Multi-line search with context
rg -U ":ga:.*todo.*-->" --type html    # Multi-line mode
rg -U ":ga:.*config.*\*/" --type js    # Find config blocks

# Structured approach - find opening, then check content
rg -A 10 "<!-- :ga:" | rg "todo"      # Find opens, then search content
```

**Tool Considerations:**
- Grepa CLI must parse multi-line comments to extract structured markers
- Single-line anchors remain fully grep-compatible  
- Multi-line anchors require structured parsing but offer better readability
- Teams can choose: single-line for grep-ability vs multi-line for complex markers

**When to use multi-line:**
- ✅ Complex conditional configurations with many conditions
- ✅ Multiple related markers that would create very long lines
- ✅ Parameter lists that are hard to read on single line
- ❌ Simple markers (keep single-line: `<!-- :ga:todo fix this -->`)
- ❌ Short parameter lists (keep single-line: `<!-- :ga:config:env[prod,dev] -->`)

**Backwards Compatibility:**
- All existing single-line anchors continue to work unchanged
- Multi-line is opt-in syntax for complex cases
- ripgrep users get same results for simple searches
- Advanced searches require multi-line patterns or grepa CLI

### Escape and Quoting Mechanisms

**Core Concept:** Handle special characters in parameters while maintaining grep-ability and shell-safety.

**Problem Characters:**
- **Commas** `,` - conflict with marker separation
- **Parentheses** `()` - conflict with parameter syntax
- **Brackets** `[]` - conflict with array syntax
- **Braces** `{}` - conflict with JSON syntax
- **Colons** `:` - conflict with type:value syntax
- **Quotes** `"'` - conflict with string delimiters
- **Pipes** `|` - conflict with OR syntax
- **Backslashes** `\` - escape character conflicts

**Quoting Rules:**

1. **Single quotes for literal strings:**
```javascript
// :ga:regex('user-\d+')              // literal regex pattern
// :ga:path('/path/with spaces')      // path with spaces
// :ga:message('Error: invalid ()')   // message with special chars
```

2. **Double quotes for interpolated strings:**
```javascript
// :ga:template("User: $name ($id)")  // template with variables
// :ga:query("SELECT * FROM users")   // SQL with interpolation potential
```

3. **No quotes when unambiguous:**
```javascript
// :ga:user(alice)                    // simple identifier
// :ga:priority:high                  // simple type:value
// :ga:version(2.0.1)                 // version number
```

**Escape Sequences:**

Within quoted strings, use backslash escapes:
```javascript
// :ga:message('Can\'t connect')      // escaped single quote
// :ga:path("C:\\Program Files")      // escaped backslash
// :ga:regex("user\\.\\d+")           // escaped dots in regex
// :ga:json('{"key": "value"}')       // JSON in single quotes (no escaping needed)
```

**Special Cases:**

1. **Regex Patterns:**
```javascript
// Simple patterns (no quotes needed)
// :ga:match(user-123)                // literal match
// :ga:pattern(\d+)                   // simple regex

// Complex patterns (quoted)
// :ga:regex('^\w+@[\w.-]+\.\w{2,}$') // email regex
// :ga:match('user-\d+-(test|prod)')  // complex pattern
```

2. **File Paths:**
```javascript
// Simple paths (no quotes)
// :ga:file(src/auth.js)              // standard path
// :ga:path(/usr/local/bin)           // Unix path

// Paths with special chars (quoted)
// :ga:file('src/user service.js')    // spaces
// :ga:path('C:\Program Files\App')   // Windows path
// :ga:url('https://api.com/v1?q=x')  // URL with query params
```

3. **Shell Commands:**
```javascript
// Simple commands (no quotes)
// :ga:cmd(npm install)               // simple command
// :ga:run(make build)                // build command

// Complex commands (quoted)
// :ga:cmd('npm run test -- --watch') // args with spaces/dashes
// :ga:shell('find . -name "*.js"')   // command with quotes
```

4. **Arrays with Special Characters:**
```javascript
// Simple arrays (no quotes)
// :ga:tags[auth,api,v2]              // simple identifiers
// :ga:users[@alice,@bob]             // mentions

// Complex arrays (quoted elements)
// :ga:patterns['user-\d+','admin-.*'] // regex patterns
// :ga:files['src/auth.js','lib/util.js'] // file paths
// :ga:messages['Error: failed','Warning: slow'] // text with colons
```

**JSON Parameters:**

For complex structured data, use JSON with single-quote wrapper:
```javascript
// :ga:config('{"env":"prod","timeout":30,"retries":3}')
// :ga:metadata('{"tags":["auth","api"],"priority":"high"}')
```

**Shell Safety:**

Parameters should be shell-safe when used in scripts:
```bash
# These should work without additional escaping
rg ":ga:user(alice)"
rg ":ga:priority:high"
rg ":ga:version(2.0.1)"

# Quoted parameters need care in shell
rg ":ga:message('Can\\'t connect')"  # Need to escape for shell
```

**Parsing Strategy:**

1. **Unquoted**: Parse until `,`, `)`, `]`, `}`, or whitespace
2. **Single-quoted**: Parse until unescaped `'`, handle `\'` escapes
3. **Double-quoted**: Parse until unescaped `"`, handle `\"` escapes and `$var` substitution
4. **Validation**: Ensure balanced parens/brackets/braces
5. **Error handling**: Clear messages for malformed syntax

**Best Practices:**

- **Default to unquoted** for simple identifiers and values
- **Use single quotes** for literal strings with special chars
- **Use double quotes** when template variables are needed
- **Escape minimally** - only when necessary for parsing
- **Validate syntax** - tools should catch malformed quoting
- **Document team conventions** - consistent quoting style in config

**Examples by Use Case:**

```javascript
// File references
// :ga:see(auth.js:42)                // simple file:line
// :ga:see('user service.js:15')      // file with spaces
// :ga:path('/complex path/file.js')  // quoted path

// Regex patterns  
// :ga:match(user-123)                // literal
// :ga:regex('^\w+@[\w.-]+\.\w{2,}$') // email pattern
// :ga:pattern('(test|prod)-\d+')     // alternation

// Messages and text
// :ga:todo fix the login bug         // simple prose
// :ga:error('Authentication failed') // quoted message
// :ga:note('TODO: review (urgent)')  // message with special chars

// Commands and tools
// :ga:cmd(npm test)                  // simple command
// :ga:run('npm run build -- --prod') // command with args
// :ga:tool('grep -r "pattern" src/') // complex command

// URLs and references
// :ga:docs(https://example.com)      // simple URL
// :ga:api('https://api.com/v1?key=x') // URL with query params
// :ga:issue('https://github.com/owner/repo/issues/123') // full URL
```

### Monorepo Patterns (Placeholder)

**Status:** Needs further exploration - moving to ideas directory for deeper investigation.

**Core Question:** How should grep-anchors adapt to different monorepo structures without over-engineering?

**Key Insights from Discussion:**
- Every repo is unique - hard to predict all organizational patterns
- Self-documentation is valuable (path-based references)
- `repo:*` pattern could be universal: `:ga:repo:packages/auth-service,todo implement OAuth`
- Tools could enhance with context (OpenAPI, package.json, git blame)
- Config files could define search aliases rather than rigid namespace rules

**Potential Approaches to Explore:**
1. Universal `repo:` prefix with actual file paths
2. Tool integration for enhanced context (OpenAPI, package manifests)
3. Configuration-based search aliases vs hardcoded namespace patterns
4. Service discovery through existing project files vs explicit anchor organization

**Next Steps:**
- Create detailed exploration in ideas directory
- Prototype `repo:` pattern with real monorepo examples
- Design tool integration for automatic context enhancement
- Test search patterns with various monorepo structures

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

### Cross-Service Relational Markers

**Core Concept:** Canonized relational markers that express relationships between services, components, or systems for relationship mapping in APIs and tooling. Uses pattern `marker(relation-type:target-identifier)`.

**Grammar:** `relational-marker(relation-type:target-identifier)`

**Relationship Categories:**

**1. Dependency Relations**
```javascript
// :ga:depends(on:auth-service)        // requires auth service to function
// :ga:requires(api:user.login)        // needs specific API endpoint
// :ga:needs(config:redis.connection)  // requires configuration
```

**2. Blocking/Flow Relations** 
```javascript
// :ga:blocked(by:issue:4)             // blocked by specific issue  
// :ga:blocking(issue:[7,10])          // blocks other issues (from above)
// :ga:awaits(approval:@security-team) // waiting for approval
// :ga:prevents(deployment:prod)       // prevents action
```

**3. Event/Message Relations**
```javascript
// :ga:emits(event:user.created)       // publishes this event
// :ga:listens(to:payment.completed)   // subscribes to events
// :ga:triggers(workflow:deploy.prod)  // initiates process
// :ga:responds(to:webhook.stripe)     // handles incoming event
```

**4. API Contract Relations**
```javascript
// :ga:consumes(api:v2/users)          // calls this API endpoint
// :ga:provides(api:auth/login)        // implements this endpoint
// :ga:exposes(endpoint:/health)       // makes endpoint available
// :ga:calls(service:payment.charge)   // invokes external service
```

**5. Data Flow Relations**
```javascript
// :ga:reads(from:user-db)             // reads from data source
// :ga:writes(to:analytics-queue)      // sends data to destination
// :ga:caches(in:redis.sessions)       // uses cache layer
// :ga:stores(data:user.preferences)   // persists data
```

**6. Infrastructure Relations**
```javascript
// :ga:deploys(with:payment-service)   // same deployment boundary
// :ga:scales(based-on:api-traffic)    // scaling relationship
// :ga:monitors(via:prometheus.alerts) // observability relationship
// :ga:routes(through:api-gateway)     // network routing
```

**7. Temporal Relations**
```javascript
// :ga:runs(after:database.migration)  // execution order
// :ga:follows(step:user.validation)   // workflow sequence
// :ga:precedes(task:email.notification) // happens before
// :ga:schedules(job:daily.cleanup)    // timing relationship
```

**Array Targets for Multiple Relationships:**
```javascript
// :ga:depends(on:[auth-service,user-db,redis])
// :ga:triggers(workflow:[deploy.staging,run.tests])
// :ga:blocked(by:[issue:4,approval:@alice])
// :ga:consumes(api:[v2/users,v2/auth,v1/billing])
```

**Bidirectional Relationship Examples:**
```javascript
// :ga:depends(on:auth-service),provides(api:user.profile)
// :ga:consumes(api:payment.charge),emits(event:payment.success)
// :ga:listens(to:user.events),triggers(workflow:analytics.process)
// :ga:blocked(by:issue:4),blocking(release:v2.0)
```

**Query Examples for Relationship Mapping:**

```bash
# Service dependency analysis
rg ":ga:.*depends.*on:" --type js      # Find all dependencies
rg ":ga:.*provides.*api:" --type js    # Find all API providers
rg ":ga:.*consumes.*api:" --type js    # Find all API consumers

# Event flow tracing
rg ":ga:.*emits.*event:" --type js     # Find event publishers
rg ":ga:.*listens.*to:" --type js      # Find event subscribers
rg ":ga:.*triggers.*workflow:" --type js # Find workflow initiators

# Infrastructure mapping  
rg ":ga:.*deploys.*with:" --type js    # Find deployment groups
rg ":ga:.*scales.*based-on:" --type js # Find scaling relationships
rg ":ga:.*routes.*through:" --type js  # Find routing dependencies

# Blocking analysis
rg ":ga:.*blocked.*by:" --type js      # Find what's blocked
rg ":ga:.*blocking.*" --type js        # Find what's blocking others
rg ":ga:.*prevents.*" --type js        # Find prevention relationships

# Data flow mapping
rg ":ga:.*reads.*from:" --type js      # Find data sources
rg ":ga:.*writes.*to:" --type js       # Find data destinations
rg ":ga:.*caches.*in:" --type js       # Find cache usage
```

**API Integration Examples:**

```bash
# Generate service relationship graph
grepa map --relationships --output service-graph.json

# Find circular dependencies  
grepa validate --check-cycles --type dependency

# Trace event flows end-to-end
grepa trace --event "user.created" --show-flow

# Impact analysis for service changes
grepa impact --service auth-service --show-dependents

# API contract validation
grepa validate --contracts --against openapi.yaml

# Deployment dependency ordering
grepa deploy --plan --check-dependencies
```

**Future Linting and Validation (Stubbed):**
- **Relation type validation**: Restrict to approved relation types for consistency
- **Target identifier validation**: Ensure targets exist (services, APIs, events)
- **Circular dependency detection**: Prevent infinite dependency loops
- **Contract verification**: Match API relations with actual OpenAPI specs
- **Event flow validation**: Ensure emitters have corresponding listeners
- **Infrastructure consistency**: Validate deployment and scaling relationships

**Benefits for Tooling:**
- **Service Discovery**: Auto-generate service topology maps
- **Impact Analysis**: Understand blast radius of changes
- **Event Tracing**: Follow data flows across distributed systems  
- **Deployment Planning**: Understand service deployment dependencies
- **API Documentation**: Auto-generate service interface contracts
- **Integration Testing**: Identify required test scenarios
- **Monitoring Setup**: Configure alerts based on service relationships

### Plugin Architecture (Configuration Bundles)

**Core Concept:** Plugins as pattern packages that configure grep-anchor usage without external dependencies. Plugins set up conventions, templates, aliases, and directory structures for specific workflows.

**Plugin Types:**

**1. Pattern Configuration Plugins**

Plugins primarily configure templates, aliases, and search patterns:

```yaml
# @grepa/issues plugin
name: "@grepa/issues"
description: "Issue tracking patterns for internal documentation"

templates:
  issue: "issue,id:$1,status:$status ?? open,owner:$owner ?? @unclaimed"
  bug: "issue,type:bug,priority:$priority ?? medium,id:$1"
  task: "issue,type:task,epic:$epic,id:$1"

directories:
  create: ["docs/issues/", "docs/specs/", "docs/decisions/"]

aliases:
  bug: "issue,type:bug"
  enhancement: "issue,type:enhancement"
  epic: "issue,type:epic"

search-shortcuts:
  open-issues: ["status:open", "status:in-progress"]
  my-issues: ["owner:$user"]
  bugs: ["type:bug"]
```

**2. Workflow-Specific Plugins**

```yaml
# @grepa/monorepo plugin  
name: "@grepa/monorepo"
description: "Service-oriented monorepo patterns"

templates:
  service-todo: "todo,service:$1,team:$team ?? @unclaimed"
  service-config: "config,service:$1,env:$env ?? dev"
  cross-service: "rel(depends:$1),service:$2"

search-shortcuts:
  auth-service: ["service:auth", "repo:services/auth-*", "#auth"]
  payment-service: ["service:payment", "repo:services/payment-*", "#payment"]
  shared-libs: ["repo:packages/shared-*", "repo:libs/*", "#shared"]

service-mapping:
  auth: { directory: "services/auth-service", team: "@auth-team" }
  payment: { directory: "services/payment-service", team: "@payments-team" }
```

**3. AI Agent Plugins**

```yaml
# @grepa/ai-agents plugin
name: "@grepa/ai-agents"  
description: "AI agent interaction patterns"

templates:
  claude-task: "@claude($1),priority:$priority ?? medium"
  claude-review: "@claude(review:$1),type:code-review" 
  cursor-implement: "@cursor(implement:$1),complexity:$complexity ?? medium"

aliases:
  ai-help: "@claude"
  code-review: "@claude(review)"
  auto-implement: "@cursor(implement)"

agent-patterns:
  "@claude": { description: "Claude AI tasks", triggers: ["review", "implement", "explain"] }
  "@cursor": { description: "Cursor AI tasks", triggers: ["implement", "refactor", "test"] }
```

**4. Domain-Specific Plugins**

```yaml
# @grepa/security plugin
name: "@grepa/security"
description: "Security review and compliance patterns"

templates:
  security-review: "sec,review-required,owner:@security-team,id:$1"
  compliance-check: "compliance,standard:$1,status:$status ?? pending"
  vulnerability: "sec,type:vulnerability,severity:$severity,id:$1"

required-markers:
  - marker: "sec"
    when: { file-patterns: ["*/auth/*", "*/payment/*"] }
    message: "Security review required for auth/payment code"

linting:
  enforce:
    - pattern: ":ga:sec"
      in-directories: ["src/auth/", "src/payment/"]
      message: "All auth/payment code must have security markers"
```

**Plugin Installation and Usage:**

```bash
# Install pattern packages
grepa plugin install @grepa/issues
grepa plugin install @grepa/monorepo

# Enable plugins in config
# grepaconfig.yaml
plugins:
  enabled: ["@grepa/issues", "@grepa/monorepo"]
  
# Use plugin patterns
# :ga:issue(auth-redesign,status:in-progress)  ← uses @grepa/issues template
# :ga:service-todo(auth,fix-oauth)             ← uses @grepa/monorepo template
```

**Plugin Benefits:**

1. **No External Dependencies** - Pure configuration, no API calls or external services
2. **Pattern Standardization** - Teams share common conventions via plugins  
3. **Gradual Adoption** - Start with core grep-anchors, add workflow plugins as needed
4. **Customizable** - Teams can fork/modify plugins for their specific needs
5. **Composable** - Multiple plugins can work together
6. **Discoverable** - Plugin registry for common patterns

**Plugin Registry Concept:**

```yaml
# Community plugins
@grepa/issues          # Internal issue tracking
@grepa/monorepo        # Service-oriented patterns  
@grepa/security        # Security review workflows
@grepa/api-docs        # API documentation patterns
@grepa/testing         # Test planning and coverage
@grepa/migrations      # Database/schema migrations
@grepa/feature-flags   # Feature flag management
@grepa/ai-agents       # AI assistant integrations
```

**Future Plugin Ideas:**

**@grepa/markdown-footnotes (Future Concept):**
Potential plugin enabling inline markdown footnote syntax for anchors:

```markdown
This code implements OAuth[^ga-auth-redesign] for user authentication.

The payment system[^ga-payment-redesign] handles Stripe integration.

<!-- Footnote anchor definitions -->
[^ga-auth-redesign]: :ga:rel(implements:auth-redesign) OAuth implementation  
[^ga-payment-redesign]: :ga:rel(implements:payment-redesign) Stripe integration
```

Benefits of footnote syntax:
- Non-intrusive inline references
- Maintains document readability  
- Anchor definitions stay in comments (spec-compliant)
- Links code mentions to formal anchor system

**Implementation Notes:**
- Plugins are configuration-only packages
- No runtime dependencies or external API calls
- Distributed as npm packages or git repos
- Applied via grepaconfig.yaml inclusion
- Can be version-controlled alongside project