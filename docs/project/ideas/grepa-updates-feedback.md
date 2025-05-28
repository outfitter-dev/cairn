# Review Feedback – grepa-updates.md

This document captures a complete red-pen review of `docs/project/ideas/grepa-updates.md`.  Comments are grouped by theme.  Inline fixes are shown in **diff** fences so they can be copy-pasted.  Line numbers refer to the current file version.

---

## 1. High-level observations

1. **Scope alignment** – The spec is far more ambitious than the “simple pattern” story told in the root `README.md`. Add a short preface after the main heading clarifying that this is a forward-looking *architecture* document.
2. **In-flight migration** – `priority:high` vs the legacy `priority.high` examples in existing docs. Until the global replace happens, drop in a visible migration note.
3. **Scope-creep candidates** – Conditional scopes, UUID generation, plugin registry, advanced agent triggers, etc., feel speculative. Recommend moving each of these to **docs/project/future/** as standalone design notes (see “Future” section below).

---

## 2. Line-level / nit-picky items

| Line | Issue | Suggested fix |
|------|-------|---------------|
| 18 | “tokenize **to** single tokens” | Change *to* → **as** |
| 19 | missing period | Add `.` at end |
| 22 | wording unclear | Re-phrase: “The first space following the last structured marker delimits the prose boundary.” |
| 24 | mixed heading depth | Promote to H2 for consistency |
| 34 | nested `issue:4` ambiguity | Clarify that inner colons are literals |
| 42-48 | sentence- vs title-case | Pick one style |
| 47 | “IS” in caps | use *is* or *italic* |
| 60 | file name markup | wrap `grepaconfig.yaml` in back-ticks |
| 63 | YAML comment alignment | out-dent comment |
| 75 | quotes around `named` | not required |
| 87-93 | dashed YAML keys | wrap keys with quotes |
| 109-116 | long comment lines | wrap at 100 cols |
| 118 | introduce `requires` earlier | or rename for parity |
| 150 | section depth | promote to H2 |
| 163 vs 170 | wording vs example | allow both styles or fix rule |
| 171-176 | trailing comma + prose | drop trailing comma before prose |
| 180-187 | inconsistent indent | pick 4 spaces |
| 198-214 | missing `-U` flag in searches | add for multiline search |
| 231 | missing back-ticks | close code-fence title |
| 233-235 | over-escaped regex | single backslash inside single quotes |
| 395-397 | `rel()` delimiter policy | decide colon vs param form |
| 410-411 | `owner@alice` delimiter | consider `owner:@alice` or document `@` rule |
| — | **Closing sentinel for multi-line anchors** | Adopt a consistent terminator—draft proposal `:V:` | 
| 499 | comma collision in template | document escaping or alternate delimiter |
| 560-561 | hyphen in value | add charset note |
| 598-602 | `$var ?? default` syntax | add formal description |
| 616 | `uuid:` missing in marker table | include in Enhanced Markers |

### Example diffs

```diff
  -1. **Single Token Preference**: When introducing markers, prefer those that LLMs tokenize to single tokens
  +1. **Single Token Preference**: When introducing markers, prefer markers that LLMs tokenize **as** single tokens.

  -First space after structured markers delimits prose boundary
  +The first space following the last structured marker delimits the prose boundary.

@@
  -// :A:regex('user-\d+')
  +// :A:regex('user-\d+')   // one backslash is enough in single quotes
```

*(extra leading spaces prevent the diff snippet from confusing the patch parser)*

---

## 3. Next steps

1. Publish a concise “Grepa 1.0 Cheat-Sheet” extracted from this spec.
2. Provide a formal grammar (EBNF or JSON schema) to eliminate delimiter ambiguities.
3. Update all README / guide examples to `priority:high` (add a temporary migration call-out until complete).
4. Add explicit *error* examples in the Validation section showing linter output.
5. Split the **Plugin Architecture** portion into its own document (see below).
6. Experiment with a *closing sentinel* for multi-line anchors—placeholder proposal `:V:` (e.g. `:V -->`).

---

## 4. Future (move each item to `docs/project/future/`)

* **plugin-architecture.md** – Full pattern-package system (current §“Plugin Architecture as Configuration Bundles”).
* **conditional-scopes.md** – Environment / platform-based value selection engine.
* **uuid-ids.md** – Automatic UUID strategies and cross-reference mechanics.
* **agent-triggers.md** – `@claude`, `@cursor` and AI-agent integration model.
* **template-engine.md** – Advanced placeholder syntax (`$var ?? default`, array handling, etc.).

---

*Document generated – feel free to tweak before merging.*
