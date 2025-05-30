<!-- :A: tldr High-level checklist for migrating existing documentation to the new `:A:` notation and delimiter rules.  -->

# Documentation Migration Plan

This file lists every **documentation change** required to bring the public docs in sync with the latest decisions captured in `docs/project/ideas/grepa-updates.md` (especially the **“## Doc Updates”** section).  Each subsection below includes:

• Why the change is needed – short context
• Exactly **what** has to change (content, examples, wording)
• Primary locations to update (README, guides, notation spec, etc.)
• Deep-link to the relevant lines in `grepa-updates.md` for quick reference

> Tip Every heading in the source update document now has an inline marker `<!-- :A: todo #doc-migration -->`.  Search `rg "#doc-migration"` to jump between them.

---

## 1  Anchor prefix change → `:A:`

**What changes**  
Switch every example, search command, and prose reference from the legacy `:ga:` sigil to the new canonical `:A:` anchor prefix.

**Lines**  
`docs/project/ideas/grepa-updates.md#L1-L120` (intro & “The `:A:` Anchor”).

**Action items**
1. README quick-start examples
2. All snippets in `docs/guides/quick-start.md`, `docs/examples.md`
3. Regex hints – change `rg ":ga:"` → `rg ":A:"`
4. Update screenshots / asciinema casts if they show the old sigil

## 2  Eliminate dot notation (except literals)

**Why**  
Dots can be ambiguous (hierarchy vs literal).  New rule keeps dots **only** inside literal values (semver, file paths, URLs).  Hierarchical composition now uses `:` or `()`.

**Reference**  
`grepa-updates.md#L753-L791`  (`### Eliminate Dot Notation`).

**Actions**
• Replace every `priority.high`, `api.v2.users`, etc. with the colon / paren style in all docs.  
• Update search examples that demonstrate hierarchical queries.  
• Add a **“Literals vs Structure”** note to `docs/notation/format.md`.

## 3  Require colon delimiter for all key-value markers

**Reference**  
`grepa-updates.md#L792-L803`.

**Changes**
1. Mentions: `owner@alice` → `owner:@alice` in guides & spec
2. Ensure every prose section that shows parameters uses `marker:value` **not** `marker(value)` unless it’s a parameter list (see § 4).

## 4  Simplified delimiter rules (colon vs parentheses)

**Reference**  
`grepa-updates.md#L804-L836`.

| Delimiter | Meaning | Example |
|-----------|---------|---------|
| `:`       | classification / single value | `priority:high` |
| `()`      | parameter list (1-N values)   | `blocked(issue:4)` |

**Docs to touch**  
`docs/magic-anchors/format.md`, `docs/magic-anchors/examples.md`, `docs/guides/progressive-enhancement.md`.

## 5  Spacing & quoting rules

**Reference**  
`grepa-updates.md#L837-L859`.

**Key points**
• No quotes for simple identifiers.  
• Single quotes for spaces / special chars.  
• Double quotes if single quotes appear inside.

Add a quick table to `docs/magic-anchors/payloads.md`.  Update any sample sed/rg commands that rely on unquoted values.

## 6  Universal parameters & todo consolidation

**Reference**  
`grepa-updates.md#L860-L903`.

Tasks
1. Deprecate standalone `FIXME`, `BLOCKED`, etc. examples – show them as `todo()` parameters.  
2. In README “Core Patterns” table rename/merge accordingly.  
3. Add one *multi-parameter* todo example in quick-start.

## 7  Core marker groups system

**Reference**  
`grepa-updates.md#L904-L1001`.

Actions
1. Create a new table in `docs/conventions/common-patterns.md` listing the six groups with 1-sentence purpose.  
2. Update search examples: `rg ":A:.*notice"` etc.  
3. Add group tags to the glossary in `docs/magic-anchors/README.md`.

## 8  Anchor density guidelines

**Reference**  
`grepa-updates.md#L1002-L1070`.

Docs
• Integrate this guidance into `docs/guides/progressive-enhancement.md` (“When & where to add anchors”).  
• Possibly turn density numbers into a linter rule description in toolset docs.

## 9  Hashtags for conceptual linking

**Reference**  
`grepa-updates.md#L1087-L1126`.

To do
– Add subsection “Conceptual tags” in `docs/advanced-patterns.md`.  
– Mention grep usage (`rg "#tag"`).  
– Decide whether to include in initial linter scope (toolset doc).

## 10  Universal parameter groups

**Reference**  
`grepa-updates.md#L1127-L1190`.

Steps
1. Move parameter-group table into `docs/magic-anchors/payloads.md` (it belongs with value syntax).  
2. Cross-link from `docs/conventions/common-patterns.md`.  
3. Add examples per group in `docs/examples.md`.

---

## Style & wording checklist

Follow `docs/magic-anchors/LANGUAGE.md` when describing *notation* (use “accommodates”, “recommends”, etc.).  Use `docs/grepa/LANGUAGE.md` when writing about *tools* (use “enforces”, “validates”, …).

---

## Tracking progress

Add `[x]` checkboxes once each item is completed.  When all sections above are fully migrated, close issue **#doc-migration**.

### Progress snapshot (v0.1.1 – 2025-05-28)

- [x] Repo restructure (`notation`→`magic-anchors`, `toolset`→`grepa`).
- [x] Changelogs created (`magic-anchors/CHANGELOG.md`, `grepa/CHANGELOG.md`).
- [x] Anchor prefix examples updated in **core spec** & **grepa-updates.md**.  (Guides / README still pending.)
- [ ] Dot-notation purge across *all* docs – main spec done; guides & conventions still need sweeps.
- [ ] Colon-delimiter rule reflected in every example (partial).
- [ ] Spacing & quoting rules table in `magic-anchors/payloads.md` (todo).
- [ ] Marker-group table in `conventions/common-patterns.md` (todo).
- [ ] Parameter-group table moved to `magic-anchors/payloads.md` (todo).
- [ ] Density guidelines integrated into guides (todo).
- [ ] Hashtag section in advanced docs (todo).
