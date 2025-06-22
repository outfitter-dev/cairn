<!-- tldr ::: ##wm/proposals/base-schema-architecture describe Waymark's base schema as composable JSON-Schema fragments that teams can extend or restrict -->

# Base Schema Architecture for Waymark Pattern Recognition

## Overview

This proposal describes **how we document and share Waymark patterns** through
a set of small, single-purpose JSON-Schema fragments that form a base schema.
Teams can extend this base with their own patterns or restrict it through
configuration. The design enables:

1. **Pattern documentation** – every tool (parser, linter, editor plugins,
    code-gen) understands the same pattern definitions from a versioned base.
2. **Team customization** – companies or OSS contributors can define their own
    patterns in standalone packages while staying compatible with core tooling,
    or restrict the base schema to only the patterns they use.

The result is a foundation for pattern recognition that adapts to different
team needs, similar to *shadcn/ui* but focused on waymark patterns instead of
UI components.

## Goals

- Document patterns once; tools recognize them everywhere (docs, parsing, TS types, IDE hints).
- Keep concerns (markers, tags, actors, etc.) isolated so different teams can
    iterate without merge conflicts.
- Enable teams to either extend the base patterns or restrict them based on
    their needs while staying compatible with upstream tooling.
- Provide a clear versioning path for both base and extension
    fragments.

## Proposed Repository Layout

```text
spec/
  base/
    node-base.schema.json        # common pattern structure: id, kind, location, comments
    tag-base.schema.json         # generic tag structure (name, optional value)
    location.schema.json
  patterns/
    markers.schema.json          # extends node-base
    tags.schema.json             # extends tag-base, defines core waymark tags
    actors.schema.json
    signals.schema.json
    …
  extension-api/
    pattern-contract.schema.json # describes the pattern structure for extensions
  tools/
    build-schema.ts              # assembles → dist/waymark-base.schema.json
    test-patterns.ts             # tests pattern recognition against samples

dist/
  waymark-base.schema.json       # bundled base, `$id` = https://waymarks.dev/schema/base

packages/
  waymark-patterns/              # npm package that publishes base patterns

# team-specific example (lives in its own repo)
node_modules/
  @acme/waymark-patterns-ui/
    schema/
      acme-ui-patterns.schema.json
```

## Layered Schema Structure for Tags

To support both maximum flexibility for custom tags and strict conventions for our core tags, the schema uses a layered approach.

1.  **Generic Base (`tag-base.schema.json`)**: This schema is highly permissive. It defines what a tag *can* be, allowing for features like hierarchical names (`#tag/subtag`) and unstructured values. This is the "capability" layer.
2.  **Conventional Spec (`tags.schema.json`)**: This schema inherits from the base and adds constraints. It defines the specific tag names, formats, and disallowed patterns for the official Waymark v1.0 specification. This is the "convention" layer.

This allows tools to validate against the generic base for maximum compatibility or against the stricter conventional spec for ensuring adherence to Waymark's core patterns.

### Example 1: `tag-base.schema.json` (The Permissive Capability)

This fragment defines the generic shape of any tag.

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://waymarks.dev/schema/base/tag-base",
  "title": "Base Tag Structure",
  "description": "The generic, permissive structure for any Waymark tag.",
  "allOf": [
    { "$ref": "./node-base.schema.json" },
    {
      "type": "object",
      "properties": {
        "kind": { "const": "tag" },
        "name": {
          "type": "string",
          "description": "The name of the tag (e.g., 'fixes', 'perf/hotpath')."
        },
        "value": {
          "type": "string",
          "description": "The optional value of the tag, as a raw string (e.g., '#123', 'hotpath,critical')."
        }
      },
      "required": ["kind", "name"]
    }
  ]
}
```

### Example 2: `tags.schema.json` (The Strict Convention)

This fragment extends the base to enforce Waymark v1.0 conventions.

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://waymarks.dev/schema/patterns/tags",
  "title": "Waymark v1.0 Core Tags",
  "description": "Defines the core set of conventional tags for Waymark v1.0.",
  "allOf": [
    { "$ref": "../base/tag-base.schema.json" },
    {
      "type": "object",
      "properties": {
        "name": {
          "not": {
            "pattern": "/",
            "description": "Core Waymark tags MUST NOT be hierarchical."
          },
          "enum": [
            "fixes", "blocks", "depends", "owner", "cc", "test",
            "perf", "arch", "sec", "data", "api", "code", "status", "error"
          ]
        }
      }
    }
  ]
}
```

This layered model provides a clear path for both core spec adherence and custom extensions.

## Pattern Fragment Structure

Each fragment follows these patterns:

1. `$id` – uses a stable, absolute URL (semantic-versioned if needed) so `$ref`
   resolution remains consistent after bundling.
2. `allOf` → `../base/node-base.schema.json` – inherits common pattern properties.
3. Includes a discriminant `kind` constant e.g. `{ "const": "marker" }` to help
   tools distinguish between pattern types in TypeScript.
4. Remains self-contained: references only `node-base.schema.json` to avoid
   circular dependencies in extensions.

Example `markers.schema.json` (showing the pattern):

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://waymarks.dev/schema/patterns/markers",
  "title": "Marker pattern",
  "description": "Describes the structure of marker waymarks",
  "allOf": [
    { "$ref": "../base/node-base.schema.json" },
    {
      "type": "object",
      "properties": {
        "kind": { "const": "marker" },
        "name": { 
          "type": "string",
          "description": "The marker type (e.g., todo, fixme, note)"
        },
        "args": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Additional arguments or modifiers"
        }
      },
      "required": ["kind", "name"]
    }
  ]
}
```

## Building the Base Schema

`tools/build-schema.ts` (Node script):

1. Collect base patterns under `spec/patterns/**.schema.json`.
2. Discover team patterns by reading
    `waymark.config.ts` → resolves to `node_modules/*/schema/*.json`.
3. Apply restrictions if configured (e.g., only include certain markers).
4. Create combined schema:

```jsonc
{
  "$id": "https://waymarks.dev/schema/base",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "definitions": {},               // populated with pattern definitions
  "oneOf": [                       // each pattern adds an entry
    { "$ref": "https://waymarks.dev/schema/patterns/markers" },
    { "$ref": "https://waymarks.dev/schema/patterns/tags" },
    { "$ref": "https://waymarks.dev/schema/patterns/actors" },
    // …team extensions
  ]
}
```

5. Run `json-schema-ref-parser.dereference()` to output
    `dist/waymark-base.schema.json` – a single file with all patterns included.

The base schema is published as `@waymark/patterns` package, versioned via
SemVer (`1.2.0` etc.).

## Configuration-Based Restriction

Teams can restrict the base schema to only the patterns they use through
`waymark.config.ts`:

```typescript
export default {
  patterns: {
    // Use only specific markers
    markers: ['todo', 'fixme', 'note'],
    
    // Disable entire pattern categories
    actors: false,
    
    // Or use the full base (default)
    useBase: true
  }
}
```

This allows teams to:

- Start with a minimal set and expand as needed
- Maintain consistency by limiting available patterns
- Generate smaller, focused schemas for their tools

## Philosophy: Recognition, Not Enforcement

The schema architecture is designed to be **descriptive rather than prescriptive**:

- **Pattern Recognition** – The schema describes patterns that tools can recognize,
  not rules that code must follow
- **Graceful Handling** – Tools should handle unrecognized patterns gracefully,
  perhaps with warnings rather than errors
- **Progressive Enhancement** – Teams can use basic patterns and gradually adopt
  more sophisticated ones as needed
- **No Breaking Changes** – Adding new patterns to the base doesn't break existing
  code that doesn't use them

This approach ensures waymarks remain accessible to teams at different maturity
levels while providing rich functionality for those who need it.

## Extension Model

- **Discovery** – CLI scans for packages matching
    `waymark-patterns-*` or those listed in `waymark.config.ts`.
- **Pattern Structure** – external patterns follow the structure described in
    `extension-api/pattern-contract.schema.json` to ensure compatibility.
- **Namespacing** – teams typically prefix their patterns with a namespace
    (`acme.button`, `acme.todo`) to avoid collisions.
- **Versioning** – pattern authors own their fragment's `$id` URLs and version
    them independently; major changes get a new major in the URL.

## Tooling Surface

1. **Parser** – recognizes patterns using `AST` types generated from the combined
   schema via `json-schema-to-ts` (ensures extensions are typed automatically).
2. **Pattern Recognition** – CLI identifies waymark patterns in code based on the
   active schema configuration; custom patterns are recognized seamlessly.
3. **VS Code / Language Server** – schema URL is advertised in `package.json`
   so JSON/YAML files gain auto-completion for all configured patterns.
4. **Codemods** – migration scripts pattern-match on the discriminant `kind`
   field (statically known via TypeScript union) – no fragile string parsing.

## Governance & Evolution

- **Base patterns** live in this repo and evolve through the existing RFC
    process (`project/proposals/` → FCP → merge).
- **Team patterns** live elsewhere; teams may share them publicly
    via an entry in `docs/registry.md` (purely optional for discovery).
- **Breaking changes** to base patterns require: new major `@waymark/patterns`
    version + automated codemod/migration guide.

## Alternatives Considered

*Monolithic schema file* – simpler upfront but produces merge conflicts and
blocks parallel work; poor extension story.

*Config-only extensions* – a JSON config that toggles patterns on/off still
requires core code changes for new patterns; insufficient for team-specific needs.

*Strict validation approach* – enforcing patterns would limit flexibility;
recognizing patterns allows teams to evolve their usage naturally.

## Implementation Phases

1. **Document** base patterns by converting current
   `waymark-1.0-simplification.md` grammar into pattern fragments.
2. **Build** `build-schema.ts` & CI to assemble and test pattern recognition
   against sample waymarks.
3. **Publish** `@waymark/patterns@0.1.0` as base pattern library.
4. **Update** parser & CLI to recognize patterns from the combined schema.
5. **Enable** configuration API for teams to restrict or extend the base.

---

Adopting this architecture gives Waymark a versioned foundation for pattern
recognition that adapts to different team needs while maintaining compatibility
across the ecosystem. Teams can start simple and evolve their patterns naturally
without breaking core tooling.
