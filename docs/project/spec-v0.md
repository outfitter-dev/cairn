# Grepa Monorepo – Specification (v0)

> **Goal:** Deliver a cohesive TypeScript‑first monorepo that ships a greppable‑anchor ecosystem: core parser, CLI, and tooling scaffolding to grow into editors & CI.

---

## 0 Glossary

| Term          | Meaning                                                                           |
| ------------- | --------------------------------------------------------------------------------- |
| **Anchor**    | A comment‑only token starting with `:ga:` followed by one or more payload tokens. |
| **Grepa**     | The CLI and project namespace (`@grepa/*`).                                       |
| **Workspace** | An npm package managed by pnpm within the repo.                                   |

---

## 1 Repository layout

```text
/grepa (repo root)
│  .grepa.yml          # repo default config
│  .changeset/
│  package.json        # pnpm root, turbo pipeline
│  turbo.json
│  tsconfig.base.json
│
├─ packages/
│   ├─ core/           # @grepa/core
│   ├─ cli/            # @grepa/cli  (npx + binary)
│   ├─ eslint-plugin/  # @grepa/eslint-plugin (optional rules)
│   └─ future/…        # vscode-extension, github-action etc.
└─ scripts/            # release helpers, pre‑commit hook templates
```

### 1.1 Workspaces

| Package                  | Purpose                                               | Out‑dir                                        | Publish target        |
| ------------------------ | ----------------------------------------------------- | ---------------------------------------------- | --------------------- |
| **@grepa/core**          | Anchor parser, AST utils, shared regex, config loader | `dist/` (esm/cjs)                              | npm                   |
| **@grepa/cli**           | User‑facing binary invoking core                      | `bin/grepa.js`; esbuild'ed binaries in `dist/` | npm + GitHub Releases |
| **@grepa/eslint-plugin** | Optional lint rules that piggy‑back on core parser    | `dist/`                                        | npm                   |

---

## 2 Tooling Stack

| Concern                 | Choice                                                          |
| ----------------------- | --------------------------------------------------------------- |
| **Package mgr**         | **pnpm** (workspace protocol)                                   |
| **Build orchestration** | **Turborepo** tasks: `build`, `lint`, `test`, `release`         |
| **Compiler**            | ts‑node for dev, **Bun** for production bundles and binaries    |
| **CI**                  | GitHub Actions (install pnpm, run turbo pipeline, publish)      |
| **Versioning**          | Semantic Versioning; **Changesets** automates changelogs & tags |

---

## 3 Anchor grammar (core)

```bnf
anchor   ::= ":ga:" payload
payload  ::= token ( sep token )*
token    ::= bare | json | array
bare     ::= "@"? [A-Za-z0-9_.-]+   # sec, perf, @cursor, v=0.3
json     ::= "{" … "}"
array    ::= "[" … "]"
sep      ::= "," | "|" | whitespace+
```

Reserved tokens (v0):

* `sec`  – security sensitive (warn)
* `perf` – performance hotspot (allow)
* `temp` – temporary hack (block on `lint`)
* `debug` – debug‑only (block)
* `placeholder` – stub (allow)
* `v=` / `since=` – version metadata (warn if < pkg.version)

See `docs/syntax.md` for the full token list including conventional commit types and extended categories.

---

## 4 CLI (`grepa`)

### 4.1 Resolution order

1. `--anchor <sigil>` flag
2. Repo `.grepa.yml` (nearest upward)
3. `$GREPA_ANCHOR` env var
4. Default `:ga:`

### 4.2 Commands

| Command                | Aliases | Description                                                                                                                  |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `grepa list`           | `ls`    | Print unique anchor tokens. Flags: `--json`, `--count`.                                                                      |
| `grepa grep <pattern>` |         | Ripgrep constrained to anchors. Inherits rg flags + `--files`. Adds value by respecting .grepa.yml excludes and scoping to anchor lines only. |
| `grepa lint`           |         | Enforce policy. Flags: `--forbid`, `--max-age <days>`, `--ci`.                                                               |
| `grepa stats`          |         | Histogram by token. Flags: `--top N`, `--since <version>`.                                                                   |
| `grepa format`         |         | Rewrite conventional comment leaders (e.g., `TODO`, `FIXME`) into anchor syntax. Supports `--dry-run`, `--comment-style <c|xml|hash>`. |

### 4.3 Distribution

* **npm**: `npx grepa …` (requires Node ≥ 18).
* **Standalone binaries** via Bun compile for macOS x64, macOS arm64, Linux x64, Linux arm64, Windows x64. Published as GitHub release assets; Homebrew formula taps macOS binary.

---

## 5 Config file `.grepa.yml`

```yaml
anchor: ":ga:"            # override sigil (optional)
files:
  include: ["*.{ts,js,tsx}"]
  exclude: ["dist/**"]
lint:
  forbid: ["temp", "debug"]
  maxAgeDays: 90
  versionField: "since"     # or "v"
dictionary:
  sec: Security‑sensitive code
  perf: Performance hotspot
```

If absent, CLI uses built‑ins and scans all non‑gitignored files.

---

## 6 Pre‑commit hooks (templates)

Scripts in `/scripts/hooks` showcase:

1. `grepa lint --ci` – fail commit if forbidden anchors present.
2. `grepa format --staged` – convert TODO → anchor on staged files.
   Users can symlink via Husky or lefthook.

---

## 7 Pipeline summary (GitHub Actions)

#### Not shipped in v0, but outlined for future reference

* `ci.yml` → install pnpm, turbo build+test, run `grepa lint --ci`.
* `release.yml` → triggered by Changesets, builds binaries, publishes to npm, attaches release assets.

---

## 8 Runtime & compatibility

| Component        | Minimum                                       | Notes                                       |
| ---------------- | --------------------------------------------- | ------------------------------------------- |
| Core / CLI (npm) | **Node 18**                                   | Tested on 18 LTS & 20 LTS                   |
| Binaries         | macOS x64/arm64, Linux x64/arm64, Windows x64 | Built with Bun; no runtime required         |

---

## 9 Roadmap beyond v0 (out of scope for this doc)

* VS Code extension (syntax highlight, CodeLens, quick‑fix).
* GitHub Action to block PRs with forbidden anchors.
* Language‑server integration for other IDEs.
* Metrics dashboard ingesting `grepa stats --json`.

---

## 10 Dogfooding: Grepa Tags in Grepa

The grepa codebase itself should be extensively annotated with `:ga:` anchors to demonstrate best practices and provide navigation points for future development. These anchors will serve as memory waypoints for both human developers and AI agents working on the codebase.

### 10.1 Anchor Strategy

| Token | Usage | Example |
|-------|-------|---------|
| `:ga:tldr` | Brief function/module summary at the top | `// :ga:tldr Parse anchors from TypeScript files` |
| `:ga:entry` | Main entry points and initialization | `// :ga:entry CLI main entry point` |
| `:ga:api` | Public API surfaces | `// :ga:api Core parser exported interface` |
| `:ga:config` | Configuration loading and resolution | `// :ga:config YAML schema validation` |
| `:ga:parse` | Parsing logic and regex patterns | `// :ga:parse Anchor tokenizer implementation` |
| `:ga:cmd:<name>` | Command implementations | `// :ga:cmd:lint Policy enforcement logic` |
| `:ga:algo` | Key algorithms and data structures | `// :ga:algo AST traversal visitor pattern` |
| `:ga:perf` | Performance-critical sections | `// :ga:perf File traversal optimization` |
| `:ga:sec` | Security considerations | `// :ga:sec Path traversal prevention` |
| `:ga:compat` | Compatibility and platform-specific code | `// :ga:compat Windows path handling` |
| `:ga:error` | Error handling and recovery | `// :ga:error Config file not found fallback` |
| `:ga:test` | Test utilities and fixtures | `// :ga:test Mock filesystem helper` |
| `:ga:build` | Build configuration and scripts | `// :ga:build Binary compilation settings` |
| `:ga:dep` | External dependency interfaces | `// :ga:dep Ripgrep spawn wrapper` |
| `:ga:cache` | Caching mechanisms | `// :ga:cache Parsed config memoization` |
| `:ga:v=<version>` | Version-specific code | `// :ga:v=0.1 Legacy token support` |
| `:ga:extend` | Extension points for plugins | `// :ga:extend Custom command registration` |
| `:ga:i18n` | Future internationalization points | `// :ga:i18n Error message strings` |
| `:ga:metric` | Telemetry and statistics collection | `// :ga:metric Token usage counter` |

### 10.2 Universal Anchors

**Every function, class, and module file MUST start with:**
- `:ga:tldr` - A concise one-line description of what it does

Example:
```typescript
// :ga:tldr Validate and parse .grepa.yml configuration files
export function loadConfig(path: string): Config {
  // :ga:config YAML schema validation
  // ...
}
```

### 10.3 Required Anchors by Package

#### @grepa/core
- `:ga:tldr` - At the top of every file and function
- `:ga:entry` - Package main export
- `:ga:api` - All public functions/classes
- `:ga:parse` - Regex patterns and tokenizer
- `:ga:config` - Config loader and validator
- `:ga:algo` - AST builder and visitor
- `:ga:error` - Error classes and handling
- `:ga:extend` - Plugin hooks

#### @grepa/cli
- `:ga:tldr` - At the top of every file and function
- `:ga:entry` - CLI binary entry point
- `:ga:cmd:*` - Each command implementation
- `:ga:config` - CLI-specific config resolution
- `:ga:dep` - Ripgrep integration points
- `:ga:error` - User-facing error formatting
- `:ga:perf` - Large file handling
- `:ga:compat` - Cross-platform considerations

### 10.4 Compound Anchors

For complex scenarios, use multiple tokens:

```typescript
// :ga:api,extend Public plugin registration API
// :ga:cmd:lint,sec Security policy enforcement
// :ga:parse,perf Optimized regex for large files
// :ga:config,v=0.1 Legacy config format support
```

### 10.5 Metadata Examples

Rich metadata for critical sections:

```typescript
// :ga:{"type":"api","since":"v0.1","breaking":"v1.0","owner":"@core"}
export interface Parser {
  
// :ga:{"type":"sec","severity":"high","review":"quarterly"}
function validatePath(input: string): string {

// :ga:{"type":"perf","benchmark":"parse-10k-files","target":"<100ms"}
async function scanDirectory(path: string): Promise<Anchor[]> {
```

### 10.6 Search Patterns for Development

Common grep commands for grepa development:

```bash
# Find all function summaries
rg ":ga:tldr"

# Find all entry points
rg ":ga:entry"

# Locate command implementations
rg ":ga:cmd:"

# Security review checklist
rg ":ga:sec" --json | jq '.data.path.text'

# Performance bottlenecks
rg ":ga:perf" -A 5

# API surface audit
rg ":ga:api" packages/core/

# Version-specific code
rg ":ga:v=" --json | jq 'select(.data.submatches[0].match.text > "v0.1")'
```

### 10.7 CI Integration

The grepa CI pipeline should enforce:

1. All exported functions have `:ga:api`
2. All commands have `:ga:cmd:<name>`
3. No `:ga:temp` in release branches
4. Security anchors have metadata
5. Performance anchors have benchmarks

---

## 11 Implementation Checklist

### Phase 1: Foundation
- [ ] **Set up pnpm monorepo structure**
  - [ ] Create root `package.json` with pnpm workspace configuration
  - [ ] Create `pnpm-workspace.yaml` defining workspace locations
  - [ ] Set up `.npmrc` for pnpm settings
  - [ ] Create directory structure: `packages/`, `scripts/`

- [ ] **Configure TypeScript**
  - [ ] Create `tsconfig.base.json` with shared compiler options
  - [ ] Set up path aliases for workspace packages
  - [ ] Configure strict mode and ES module output

- [ ] **Set up Turborepo**
  - [ ] Create `turbo.json` with pipeline definitions
  - [ ] Define tasks: `build`, `lint`, `test`, `clean`
  - [ ] Configure caching and dependencies between workspaces

### Phase 2: Core Package (`@grepa/core`)
- [ ] **Create package structure**
  - [ ] Initialize `packages/core/package.json`
  - [ ] Set up `tsconfig.json` extending base
  - [ ] Configure dual ESM/CJS build output

- [ ] **Implement anchor parser**
  - [ ] Define regex patterns for `:ga:` detection
  - [ ] Create AST types for anchor representation
  - [ ] Implement tokenizer for bare/json/array payloads
  - [ ] Add separator handling (comma, pipe, whitespace)

- [ ] **Config loader**
  - [ ] Define `.grepa.yml` schema types
  - [ ] Implement YAML parser integration
  - [ ] Add config resolution logic (file → env → defaults)
  - [ ] Create validation for config options

- [ ] **Utility functions**
  - [ ] File traversal with gitignore respect
  - [ ] Pattern matching helpers
  - [ ] Token dictionary management

### Phase 3: CLI Package (`@grepa/cli`)
- [ ] **Create package structure**
  - [ ] Initialize `packages/cli/package.json`
  - [ ] Set up binary entry point in `bin/`
  - [ ] Configure Bun for production builds

- [ ] **Implement commands**
  - [ ] `list` command
    - [ ] Basic token listing
    - [ ] `--json` output format
    - [ ] `--count` flag for statistics
  - [ ] `grep` command
    - [ ] Ripgrep integration
    - [ ] Anchor-scoped search
    - [ ] Pass-through rg flags
  - [ ] `lint` command
    - [ ] Policy enforcement engine
    - [ ] `--forbid` token blocking
    - [ ] `--max-age` date checking
    - [ ] `--ci` mode for pipelines
  - [ ] `stats` command
    - [ ] Token histogram generation
    - [ ] `--top N` filtering
    - [ ] `--since` version filtering
  - [ ] `format` command
    - [ ] TODO/FIXME conversion
    - [ ] Comment style detection
    - [ ] `--dry-run` preview mode

- [ ] **CLI framework**
  - [ ] Argument parsing with commander/yargs
  - [ ] Help text generation
  - [ ] Error handling and exit codes
  - [ ] Color output support

### Phase 4: Configuration & Integration
- [ ] **Config file support**
  - [ ] `.grepa.yml` discovery (upward traversal)
  - [ ] Environment variable fallbacks
  - [ ] Default dictionary implementation
  - [ ] File include/exclude patterns

- [ ] **Pre-commit hooks**
  - [ ] Create `scripts/hooks/grepa-lint.sh`
  - [ ] Create `scripts/hooks/grepa-format.sh`
  - [ ] Add installation instructions
  - [ ] Test with Husky/lefthook

### Phase 5: Build & Distribution
- [ ] **Build pipeline**
  - [ ] Configure esbuild/Bun for CLI compilation
  - [ ] Set up source maps
  - [ ] Implement tree-shaking
  - [ ] Create standalone binary builds

- [ ] **Testing**
  - [ ] Unit tests for parser
  - [ ] Integration tests for CLI commands
  - [ ] End-to-end test scenarios
  - [ ] Coverage reporting

- [ ] **Release preparation**
  - [ ] Set up Changesets
  - [ ] Create npm publish configuration
  - [ ] Binary build scripts for all platforms
  - [ ] GitHub Release asset automation

### Phase 6: Documentation
- [ ] **User documentation**
  - [ ] Update main README with installation
  - [ ] Create CLI usage examples
  - [ ] Document config file options
  - [ ] Add migration guide from TODO/FIXME

- [ ] **Developer documentation**
  - [ ] API documentation for `@grepa/core`
  - [ ] Plugin development guide
  - [ ] Contributing guidelines
  - [ ] Architecture diagrams

### Phase 7: Optional Components (Future)
- [ ] **ESLint plugin** (`@grepa/eslint-plugin`)
  - [ ] Rule definitions
  - [ ] Auto-fix capabilities
  - [ ] Config presets

- [ ] **Editor extensions**
  - [ ] VS Code syntax highlighting
  - [ ] Quick-fix providers
  - [ ] CodeLens integration

---

#### End of spec v0