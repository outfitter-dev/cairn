# Scratchpad.md
<!-- tldr ::: ##agents/scratchpad Collaborative scratchpad for brainstorming & note-taking -->

## Waymark Syntax Exploration

- **@galligan's thoughts:**
  - CRITICAL: I'm learning that ripgrep ignores dotfiles/folders by default.
    - Unless a specific file is provided, or the `-uu` flag is used, it won't find waymarks in dotfiles/folders.
    - We should highly recommend using `-uuP` to find waymarks in dotfiles/folders.
    - While `rg` may not be able to find waymarks in dotfiles/folders by default, and the user/agent may not actually want to, this should be a first-class feature of the tooling and rely on `.waymarkignore`.
  - I like the idea of defining "marker" and "branding" it.
    - We could define it as something that uses specific syntax through the use of symbols to provide useful context as well as lend to the greppability within the system.
    - Therefore, "markers" could be `#tags`, `key:value` pairs, `@actor` references, `#123` or `#ID-456` issue references, etc.
      - Though it's worth noting that `ID-456` separated by spaces would then no longer be qualified to be called a "marker".
        - That said, even something like `fixes:ID-456` would still be a marker since `:ID-456` could be searched for easily.
        - But it's pretty clear that consistent use of `#` to denote an issue reference would be better, such that `fixes:#ID-456` would add both greppability and semantic meaning.
          - I think we could add some strong suggestion that when comma-delimiting referenced values, that maintaining a `#` or `@` prefix would be a good idea.
  - Anything within a waymark would be considered the "content" of said waymark, with the exception of the `:::` sign, as that is by nature what defines a waymark.
  - I also like the idea of calling the string before the `:::` the "direction".
    - It has a nice ring to it, as it's both the "directive" and fits well into the overall naming scheme of "waymarks".
  - Right now the `:word` syntax is a bit confusing. It's in 001-waymark-syntax-v1.md.
  - I think we should go back to `#word` instead.
    - But I think we should focus on referring to them as `tags` and that they represent a "flexible namespace".
    - We may have some "blessed tags" that would likely be common, and that we'll use within the Waymark repo, but we should be clear to not be overly prescriptive with them.
    - In using this convention, things like `#package-name` would in turn be a tag too, which is easy to understand.
  - We could share some syntax "ideas" for how to use `#tags` but these would be more like ideas for conventions and not necessarily part of the core syntax.
    - `#descriptor:value` would be one example.
      - The `descriptor` could be any kind of characteristic that the value would be describing.
    - `#tag/with/subtags` could describe a root tag that has sub-tags.
      - For this we would want to suggest that these are complete tags, and searching should begin with the root tag, and layer on the subtags from there.
      - Though we could also suggest some search patterns that might surface the subtags more easily, as long as they're within the non-breaking space.
    - It would be really nice though if we suggested some very durable search patterns that would work for as many types of tags, and their potential permutations, as possible.
      - For example:
        ```text
        KEYWORD PATTERN:
        > rg -P '#+[^#\s,]*hotpath\b'
        FINDS:
        #hotpath, #perf:hotpath, perf:#hotpath, #perf:critical,hotpath, ##doc:defining-a-hotpath, #perf/hotpath, etc.
        DOESN'T FIND:
        #hotpath#, perf:hotpath, foo#perf/hotpath:bar, #hotpathCritical
        ```
      - Alternatively, if in the case of `#hotpath:critical` we could suggest a "universal" search pattern that would be more forgiving to include anything else trailing the `hotpath` portion, but prior to a space:
        ```text
        WHOLE TOKEN PATTERN:
        > rg -P '#+[^#\s]*hotpath[^#\s]*'
        FINDS:
        #hotpath:critical, #hotpath-critical, #hotpath/critical, #hotpathXYZ
        ```
    <!-- note ::: @agent I'm open to some other ideas for how to use `#tags` -->
  - Landmarks are a better name than "anchor" IMO, and we can stick with them.
    - Since landmarks are by nature flexible, then we should stick with the `##landmark` syntax as that makes `#landmark` usable elsewhere. This is already the pattern that we were using.
    - They are simply called "landmarks" and NOT "canonical landmarks", "landmark anchors", or "canonical anchors".
    - When you want to "reference" a landmark, it would just be called a "landmark reference".
    - I could see a pattern here that could leverage `:` colon delimited prefixes, in a reverse-domain style pattern.
      - `##[company:][project:]doc:string` as an example.
        - By placing the `company:` and `project:` prefixes at the beginning of the string, searches like `doc:string` would still be able to find relevant waymarks.
        - With this pattern, we could adopt `wm` as the namespace for waymarks related to **this** repo to separate waymarks that contain it from others that may be describing the general use of the system.
          - This way we could do a search for `wm:` to find all waymarks related to this project.
          - So something like `#wm:doc:api/methods` would be a thing.
    - But again, we should be clear that anything prior to a `type` in a landmark is an open namespace, and we're just suggesting a potential pattern for how to make use of it.
      - The only thing we should strongly recommend is to not mix `#tags` within that namespace.
  - I see a number of snake_case tags used in 001-waymark-syntax-v1.md, but when strings are used in `#tags` I think they would look better as `#kebab-case`.
    - Again, this is just a suggestion. The Waymark tooling should be flexible to support any kind of casing.
  - We should also note that `@word` is also a tag, and therefore a flexible namespace.
    - But we should be a little more prescriptive about how to use it, since there are already some common conventions for it.
    - `@actor` should be "locked in" as one of those use cases.
      - We can be clear that string values for `@actor` would *never* contain a `/` delimiter.
        ```text
        ACTOR PATTERN:
        > rg -P ':::.*(?<![\w/])@[\w-]+(?!/)'
        FINDS ONLY WAYMARKS THAT CONTAIN ACTOR REFERENCES:
        @actor, @user, @50cent, "team:@actor,@group", @package/scope:@actor, prefix-@actor
        DOESN'T FIND:
        non-waymarks, @package/scope, @package/scope@2.0, @package/scope:actor/group, email@actor.com, path/@actor
        ```
    - `@scope/package` is also a common convention, so we can suggest that by including `/` it would likely be understood as a scoped package.
      - And with this we should really try to emphasize that using `#package-name` use a `#` prefix so as to not confuse it with the `@actor` use case.
  - Agent references should be kept simple and natural.
    - **UPDATE**: After thinking about this more, the `@agent-` pattern might be overengineered.
    - Agents can trivially search for their own names (`@claude`, `@copilot`, etc.) or for the generic `@agent` pattern.
    - This creates a much simpler system:
      - `@agent` - Any agent should handle this
      - `@claude` - Specifically for Claude
      - `@copilot` - Specifically for GitHub Copilot
      - `@cursor` - Specifically for Cursor
    - The beauty is that agents can decide their own search patterns:
      - Claude might search for: `@claude` OR `@agent`
      - A specialized agent might only search for its specific name
    - This avoids false positives where non-Claude agents might pick up `@agent-claude` references when searching for `@agent`
    <!-- todo ::: @claude this is a test -->
    <!-- todo ::: @agent whoever gets to this first -->
    - Simple search patterns:
      ```text
      AGENT REFERENCES (any agent):
      > rg ':::.*@agent\b'
      
      SPECIFIC AGENT (e.g., Claude):
      > rg ':::.*@claude\b'
      
      CLAUDE OR GENERIC:
      > rg ':::.*@(claude|agent)\b'
      ```
  - I could also see recommendations for search patterns to be written into agent instruction files such as `CLAUDE.md` with agent-specific search instructions:

## @agent-claude's synthesis and clarifications:

### The `/` vs `:` Breakthrough

- **Context markers** use `:` for key-value relationships: `owner:@alice`, `fixes:#123`, `depends:#456`
- **Attribute tags** use `/` for hierarchical classification: `#perf/hotpath`, `#sec/boundary`, `#arch/entrypoint`
- This creates visual and semantic clarity:
  ```javascript
  // Clear distinction between relationships and attributes
  // todo ::: optimize parser #perf/hotpath owner:@alice fixes:#123
  ```

### Flexible Namespace Principle

The power of the `#` tag system is its flexibility:

- **Simple tags**: `#hotpath` - when you just need to mark something fast
- **More specific tags**: `#perf/hotpath` - when you want clearer classification
- **Even more specific tags**: `#perf/cpu/hotpath` - when you need more granularity
- All are valid, all are searchable, teams choose what works for them

### Built-in Context Markers (The "Blessed" List)

These DON'T use `#` prefix because they're part of waymark's core vocabulary:

- Work relationships: `fixes:`, `blocks:`, `depends:`, `closes:`
- People/ownership: `owner:`, `cc:`
- References: `pr:`, `commit:`, `branch:`
- Context: `affects:`, `for:`, `needs:`

The key insight: These are unlikely to appear naturally in code (who writes `owner:` randomly?), so they're safe without `#`.

### Landmarks (Just "Landmarks"!)

- NOT "canonical landmarks" or "canonical anchors" - just **landmarks**
- `##landmark-name` - defines a landmark
- `#landmark-name` - references a landmark
- Typed landmarks: `##doc:@scope/package` (note: `doc` not `docs`)
- Extended pattern: `##acme:doc:auth/api` for company-specific namespacing

### Search Pattern Updates
With the `/` delimiter for attributes AND the `:::.*` pattern for waymark-only searches:

```bash
# Find all hotpaths (any form) - ONLY in waymarks
rg ':::.*#(perf/)?hotpath'

# Find all performance attributes - ONLY in waymarks
rg ':::.*#perf/'

# Find security boundaries - ONLY in waymarks
rg ':::.*#sec/boundary'

# Find any security-related attributes - ONLY in waymarks
rg ':::.*#sec/'

# Find specific context markers
rg ':::.*owner:@alice'
rg ':::.*fixes:#123'

# Find markers (come BEFORE :::)
rg 'todo :::'
rg '!!fixme :::'
```

### The Colon Pattern Clarification
There's NO "universal colon pattern". Instead:

- **Colons** are for use with context markers and landmarks predominantly (esp types)
  - Though they may also be used *within* someone's own tags, and that's ok.
- **Slashes** are for tag-specificity. They could describe `#tag/attribute` or `#tag/subtag` structural/hierarchical patterns.
- **Double hashes** are ONLY for landmarks (`##landmark`) and the whole string `##string` should be unique within the codebase
- **Single hashes** are for tags and references (`#tag`, `#123`, `#package-name`, etc.)

<!-- RESOLVED TODOS (keeping for reference):
- @galligan confirmed: Create a "blessed list" for landmark types and context keys
- @galligan clarified: Tags are flexible - avoid "categorized" language, just "more specific"
- @galligan confirmed: Keep multi-level examples minimal, emphasize flexible namespace
- @galligan confirmed: Minimal examples for extended landmarks, focus on namespace between ## and type:
- @galligan clarified: #sec/boundary,input should be two tags: #sec/boundary and #sec/input
-->

### Agent References Simplified
Building on @galligan's update above, the agent pattern should be dead simple:

- `@agent` - Generic reference for any agent
- `@claude`, `@copilot`, `@cursor` - Specific agent references
- No complex `@agent-name` patterns needed

This is much cleaner because:

1. Agents control their own search patterns (Claude searches for `@claude` OR `@agent`)
2. No false positives from overly complex patterns
3. Natural and readable: `// todo ::: @claude review this function`
4. Follows the same simplicity principle as the rest of waymarks

<!-- todo ::: @galligan Should we document recommended agent names (@claude, @copilot, @cursor, @agent) or let this emerge naturally? -->
Naturally for sure. We could use `@claude` or `@codex` as specific agent examples within our docs.

## Context Markers - Refined Terminology & Categories

@galligan's terminology clarification:

- **Context Key**: The `string` part before the colon (e.g., `fixes`, `owner`, `pr`)
- **Context Marker**: The complete `key:value` combination
- Together they establish different types of context for waymarks

### Context Categories:

#### 1. **Workflow Context** - Cause, effect, and process
Context keys that describe why something exists or its effects in the development workflow:

- `fixes:`, `closes:`, `resolves:` - Direct solutions
- `blocks:`, `blocked:` - Workflow impediments
- `replaces:`, `deprecates:` - Lifecycle transitions
- `for:` - Purpose/intention

#### 2. **Relational Context** - Connections and dependencies
Context keys that establish relationships between things:

- `depends:`, `needs:` - Requirements
- `see:`, `refs:`, `relates:` - Cross-references
- `affects:`, `impacts:` - Downstream relationships

#### 3. **Reference Context** - Typed external references
Context keys that point to specific typed entities:

- `pr:#234`, `issue:#123`, `ticket:#SUP-456` - Issue tracking
- `commit:abc123`, `branch:feature/auth` - Version control
- `docs:/path/file.md`, `link:https://...` - Documentation
- `test:auth-suite`, `feat:chat-v2` - Named entities

#### 4. **Responsibility Context** - People and accountability
Context keys about who is responsible:

- `owner:` - Primary responsibility
- `cc:` - Keep informed
- `reviewer:` - Review responsibility
- `assignee:` - Task assignment (if different from owner)

### Key Language Points:

- **Context Key**: The prefix before `:` (e.g., `fixes`, `owner`, `pr`)
- **Context Marker**: The complete `key:value` pair (e.g., `fixes:#123`, `owner:@alice`)
- Values maintain their natural prefixes (`#`, `@`, etc.)

This creates clear semantics:

```javascript
// Workflow: This fixes something
// todo ::: implement patch fixes:#123

// Relational: This needs something
// wip ::: auth system needs:@alice,#rbac

// Responsibility: Who owns this
// important ::: security review owner:@security-team

// Reference: Where this belongs
// todo ::: add feature branch:feature/oauth pr:#234
```

## Summary of Key Decisions & Document Impact

Based on our discussion, here are the key changes needed across the waymark documentation:

### 1. **Attribute Tag Delimiter Change**

- Change ALL instances of `#category:attribute` → `#category/attribute`
- Examples: `#perf:hotpath` → `#perf/hotpath`, `#sec:boundary` → `#sec/boundary`
- This creates clear visual distinction from context markers

### 2. **Terminology Updates**

- "Anchors" → "Landmarks" (everywhere)
- Remove "canonical" prefix - they're just "landmarks"
- "Properties" → "Context markers" (no need for "relational tags")
- Avoid "categorized tags" - just say "more specific tags"

### 3. **Context Marker Framework**

- **Context Key**: The string before `:` (e.g., `fixes`, `owner`)
- **Context Marker**: The complete `key:value` pair
- Four categories: Workflow, Relational, Reference, Responsibility

### 4. **Flexible Namespace Principle**

- Emphasize that `#` tags are a flexible namespace
- Users choose their level of specificity: `#hotpath` vs `#perf/hotpath` vs `#perf/cpu/hotpath`
- No prescriptive rules, just examples of possibilities

### 5. **Critical Migration Complexity: `#` Prefix Removal**

**IMPORTANT**: In previous documentation, the line between context markers and attribute tags was blurred because BOTH used `#` prefix:

- OLD: `#fixes:#123` → NEW: `fixes:#123` (context marker - REMOVE `#`)
- OLD: `#perf:hotpath` → NEW: `#perf/hotpath` (attribute tag - KEEP `#`, change `:` to `/`)

We CANNOT just blindly replace `:` with `/` after `#`. We need to:

1. Identify if it's a context marker (from our blessed list) → remove `#` prefix
2. Identify if it's an attribute tag → keep `#`, change `:` to `/`
3. Be careful with comma-separated values: `#sec:boundary,input` → `#sec/boundary #sec/input`

### 6. **"Blessed Lists" Needed**

- Built-in context keys (organized by category)
- Standard landmark types (`doc`, `test`, `config`, etc.)
- Clear examples of when to use `#` in values (e.g., `fixes:#123`)

### 7. **Search Pattern Updates**

- Update all regex patterns to use `/` instead of `:` for attributes
- Document the `-uuP` flag for ripgrep (catches dotfiles)
- **CRITICAL**: Use `:::.*` prefix for waymark-only searches (from ADR-002)
- Provide both simple and advanced search examples

**The `:::.*` Pattern (from ADR-002)**:
```bash
# ❌ WRONG - Matches anywhere in code
rg '#billing'
rg '@alice'

# ✅ CORRECT - Only in waymarks
rg ':::.*#billing'
rg ':::.*@alice'

# For markers (before :::)
rg 'todo :::'
rg '!!fixme :::'
```

This pattern ensures ZERO false positives by only searching within waymark content!

### 8. **Advanced Search Patterns from @galligan's Notes**

**Actor Pattern (excludes package references)**:
```text
# Find only actors, not @scope/package references
> rg -P ':::.*(?<![\w/])@[\w-]+(?!/)'

FINDS: @alice, @security-team, @bob
DOESN'T FIND: @scope/package, @babel/core
```

**Keyword vs Whole Token Patterns**:
```text
# KEYWORD PATTERN - finds the concept in any form
> rg -P ':::.*#[^#\s,]*hotpath\b'
FINDS: #hotpath, #perf/hotpath, #perf/critical/hotpath

# WHOLE TOKEN PATTERN - finds complete variations
> rg -P ':::.*#[^#\s]*hotpath[^#\s]*'
FINDS: #hotpath-critical, #hotpathXYZ
```

**Complex Attribute Searches**:
```text
# Find hotpath in any perf tag (including comma-separated lists)
> rg -P ':::.*#perf/[^#\s]*hotpath'
FINDS: #perf/hotpath, #perf/critical,hotpath

# Find attributes with flexible spacing
> rg -P ':::.*#(perf/)?hotpath'
FINDS: #hotpath OR #perf/hotpath
```

**Value-in-List Pattern**:
```text
# Find billing when it appears in comma-separated values
> rg -P ':::.*[,/#]billing\b'
FINDS: affects:#api,#billing  cc:@alice,@billing-team  #billing  #finance/billing
```

These patterns are complex but incredibly precise for advanced searches!

### 9. **Updates Needed for ADR-002**

The current ADR-002 needs updates to reflect our syntax changes:

1. **Update context marker examples** (remove `#` prefix):
   ```bash
   # OLD in ADR
   rg ':::.*fixes::#123'
   
   # NEW (context markers don't have # prefix)
   rg ':::.*fixes:#123'
   ```

2. **Add attribute tag examples** (with `/` delimiter):
   ```bash
   # Add these patterns
   rg ':::.*#perf/hotpath'        # Specific attribute
   rg ':::.*#(perf/)?hotpath'     # Flexible attribute search
   rg ':::.*#sec/boundary'        # Security attributes
   ```

3. **Add actor vs package disambiguation**:
   ```bash
   # Actors only (no slashes)
   rg -P ':::.*(?<![\w/])@[\w-]+(?!/)'
   
   # Packages only (with slashes)
   rg ':::.*@[\w-]+/[\w-]+'
   ```

4. **Add the `-uuP` flag documentation**:
   ```bash
   # Search including dotfiles/folders
   rg -uuP ':::.*#waymark'
   ```

5. **Fix the "double colon" examples** - they should be single colon now for context markers