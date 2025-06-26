<!-- tldr ::: @waymark/docs waymark-streamlined-grammar-syntax Schema update guide for the 1.0 “Streamlined Grammar & Canonical Reference System” refresh -->

# Waymark Streamlined Grammar – Schema Update Guide

This document maps every **syntax change** introduced in the “Waymark Streamlined Grammar & Canonical Reference System” proposal (see
`project/proposals/waymark-streamlined-grammar-complete.md`) to the concrete
updates we need to apply inside **`@packages/schema`**.  Each entry contains:

1. **What** needs changing in the Type-Script/JSON Schema sources.
2. **Where** in the code-base that change lives.
3. **Evidence** – the exact section / heading quoted from the proposal that
   justifies the change.

The goal is to give maintainers a checklist that can be implemented & verified
incrementally without having to re-read the whole 40-page RFC.

---

## 1. Typed Canonical Anchors (`##type:target`)

### 1.1  Relax anchor pattern to allow an optional **`type:`** segment

* **File(s)**: `packages/schema/src/spec/core/grammar.schema.json`
* **Change**  
  Update **`anchorPattern.pattern`** from
  
  ```jsonc
  "^##[a-zA-Z0-9/_.-]+$"
  ```
  to something that accepts an *optional* type prefix followed by a single
  colon:
  
  ```jsonc
  "^##(?:[a-zA-Z0-9_-]+:)?[a-zA-Z0-9@/_.-]+$"
  ```
  (We explicitly include `@` because many canonical targets are scoped
  packages, e.g. `##docs:@company/auth`.)

* **Evidence**  
  Proposal § “Anchors → #### Typed Anchors” (line ≈228) introduces the
  canonical form `##type:target` and lists examples such as
  `##docs:@company/auth/api` or `##config:@company/database`.

### 1.2  Track **type/target uniqueness**

* **File(s)**: new runtime-level validation in
  `packages/schema/src/spec/runtime/node.schema.json` (or equivalent)
* **Change**  
  Add a boolean `uniqueRepoWide` property (default `false`) to the schema
  definition that represents an **anchor node**.  For typed anchors we set it
  to `true`; tooling must then assert that **no duplicate
  `##type:target`** pairs exist.

* **Evidence**  
  Proposal § “Identity Declaration → Uniqueness Rules” (line ≈374):
  “Each `##type:target` combination **must be unique across the entire
  repository**”.

---

## 2. Relational Tags **no longer start with `#`**

The refreshed grammar differentiates *tags* (must start with `#`) from
*relational tags* (`key:value`) whose **key has _no_ prefix** while the value
keeps its natural one.

### 2.1  Update `relationalTagPattern`

* **File(s)**: `packages/schema/src/spec/core/grammar.schema.json`
* **Change**  
  Replace
  
  ```jsonc
  "^#[a-zA-Z0-9_-]+:.+$"
  ```
  with
  
  ```jsonc
  "^[a-zA-Z0-9_-]+:[^\s]+$"
  ```
  so that tokens like `owner:@alice` or `fixes:#123` are parsed while
  `#perf:hotpath` (now considered an *attribute tag*, see § 3) is **rejected**
  by this pattern.

* **Evidence**  
  Proposal § “### 2. Relational Tags (Key:Value)” (line ≈76) – quote:
  “In a key:value pair, the **key never carries a prefix**.  Only the value
  carries its natural prefix (`#`, `@`, etc.).  Example: `owner:@alice`”.

### 2.2  Allow comma-separated **arrays** in the value part

* **Change**  
  Extend the same pattern to permit commas with **no spaces**:
  
  ```jsonc
  "^[a-zA-Z0-9_-]+:[^\s,]+(,[^\s,]+)*$"
  ```

* **Evidence**  
  Proposal § “### Arrays for Relationships” (line ≈285) – examples like
  `affects:#api,#billing` and explicit rule “✅ Correct – commas only, **no
  spaces**”.

---

## 3. Attribute Tags (`#category:value`)

Attribute-style tags such as `#perf:hotpath` remain *tags* because they still
start with `#`, but the existing **`simpleTagPattern`** rejects the colon.

### 3.1  Broaden simple-tag regex

* **File(s)**: `packages/schema/src/spec/core/grammar.schema.json`
* **Change**  
  Current:
  ```jsonc
  "^#[a-zA-Z0-9_-]+$"
  ```
  New (optional `:subPart[,more]` segment):
  ```jsonc
  "^#[a-zA-Z0-9_-]+(?::[a-zA-Z0-9/_,-]+)?$"
  ```

* **Evidence**  
  Proposal § “### 2.1 Attribute-Style Tags & Aliases” (line ≈122) – examples
  `#perf:hotpath`, `#sec:boundary`, multiple values
  `#perf:critical,bottleneck`.

---

## 4. Marker Dictionary Tweaks

### 4.1  Ensure **`test`** is present in the core marker list

* **File(s)**: `packages/schema/src/dictionaries/base.dictionary.json`
* **Status**  
  Already present – verify but no action required (see lines 48-60 of the
  current dictionary).

* **Evidence**  
  Proposal § “## Updated Core Markers” (line ≈1299): lists `test` under “Work”.

### 4.2  No more `priority:high` etc.

* **File(s)**: `packages/schema/src/dictionaries/base.dictionary.json`
* **Change**  
  Remove any legacy relational tags like `priority` or map them to the new
  **signal** system.  The dictionary currently does **not** include a
  `priority` tag, so again no direct code change but we call this out to avoid
  re-introducing it accidentally.

* **Evidence**  
  Proposal § “Simplified Priority System” (line ≈260) – “We are **NOT** using
  `#priority:high` syntax anymore. Use signals (`!`, `!!`) for priority.”

---

## 5. Arrays – validation helper

### 5.1  Add reusable **`commaSeparatedArray`** regex helper

* **File(s)**: `packages/schema/src/spec/helpers/grep-patterns.schema.json`
  (or create new helper JSON Schema file)
* **Change**  
  Define reusable pattern component so that multiple schemas (grammar,
  extensions, linter) can reference a *single* source of truth:

  ```jsonc
  {
    "$id": "https://waymarks.dev/schema/patterns/commaSeparatedArray",
    "type": "string",
    "pattern": "^[^\s,]+(,[^\s,]+)+$",
    "description": "Comma-separated list with NO spaces"
  }
  ```

* **Evidence**  
  Same array section as 2.2 above – the proposal stresses “No spaces after
  commas”, making it a good fit for a central helper.

---

## 6. Documentation & Examples inside the schema package

Wherever the schema package embeds inline examples (e.g. in
`grammar.schema.json#examples`) update them to use the refreshed syntax so that
auto-generated docs and playgrounds stay consistent.

* **Evidence**  
  Numerous examples throughout the proposal; e.g. the initial **Overview**
  lists the exact minimal pattern:
  
  ```text
  [signal][marker] ::: [content] [modifiers]
  ```

  and code examples use the refreshed forms across the document.

---

## 7. Summary Checklist

| Area | Action | File | Line-of-Evidence |
|------|--------|------|------------------|
| Anchors | Allow `type:` & scoped `@` | spec/core/grammar.schema.json | “Typed Anchors” |
| Anchors | Enforce repo-wide uniqueness | spec/runtime/location.schema.json | “Uniqueness Rules” |
| Rel Tags | Drop leading `#` | spec/core/grammar.schema.json | “Relational Tags (Key:Value)” |
| Rel Tags | Support comma arrays | spec/core/grammar.schema.json | “Arrays for Relationships” |
| Tags | Permit attribute form `#cat:val` | spec/core/grammar.schema.json | “Attribute-Style Tags & Aliases” |
| Markers | Verify `test` marker | dictionaries/base.dictionary.json | “Updated Core Markers” |
| Signals | Deprecate `priority:*` | dictionaries/base.dictionary.json | “Simplified Priority System” |

Implementing these changes brings the canonical JSON Schemas shipped in
`@packages/schema` **fully in line** with the 1.0 Streamlined Grammar while
remaining backward-compatible for most 0.x usage patterns.

---

<!-- about ::: ##docs/@packages/schema/streamlined-grammar-upgrade This file documents the concrete schema migrations required by the 1.0 Streamlined Grammar proposal -->
