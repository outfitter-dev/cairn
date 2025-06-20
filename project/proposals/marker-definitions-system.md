<!-- tldr ::: proposal for a marker definition system to centralize waymark marker specifications -->

# Marker Definitions System Proposal

## Overview

This proposal introduces a centralized definition system for waymark markers (e.g., `todo`, `fixme`, `notice`). Currently, marker specifications are scattered across documentation, making updates error-prone and manual. This system would provide a single source of truth that drives documentation, tooling, and migrations.

## Problem Statement

When making changes to the waymark system (e.g., renaming `alert` → `notice`), we must manually update:
- Migration guides
- Syntax documentation
- CLI tool behavior
- Test fixtures
- Example code
- Search patterns

This leads to:
- Inconsistencies across documentation
- Missed updates
- Manual, error-prone processes
- Difficulty testing marker behavior
- No type safety for marker properties

## Proposed Solution

Create TypeScript-based marker definitions that serve as the single source of truth for the entire waymark system.

### Repository Structure

```
waymark/
├── definitions/
│   ├── schema/
│   │   ├── marker.schema.ts         # TypeScript interfaces and validation
│   │   └── marker.test.ts           # Schema validation tests
│   ├── markers/                     # Active marker definitions
│   │   ├── index.ts                 # Exports all markers
│   │   ├── todo.ts
│   │   ├── fixme.ts
│   │   ├── notice.ts
│   │   └── __tests__/
│   │       └── todo.test.ts
│   ├── deprecated/                  # Deprecated markers with migration info
│   │   ├── alert.ts
│   │   ├── always.ts
│   │   └── done.ts
│   └── mixins/                      # Shared patterns
│       ├── signals.ts
│       ├── tags.ts
│       └── patterns.ts
```

### Marker Definition Schema

```typescript
// definitions/schema/marker.schema.ts
export interface WaymarkMarkerDefinition {
  marker: string;
  category: 'work' | 'info' | 'attention' | 'lifecycle';
  description: string;
  
  examples: {
    basic: string[];
    withSignals?: string[];
    withTags?: string[];
    realWorld?: string[];
  };
  
  signals: {
    allowed: ReadonlyArray<Signal>;
    meanings: Record<Signal, string>;
    defaults?: {
      priority?: Record<Signal, string>;  // e.g., "!!" -> "P0"
    };
  };
  
  commonTags: {
    semantic: string[];      // Tags that add meaning
    workflow: string[];      // Tags for process/status
    relational: string[];    // Tags that reference other items
  };
  
  migration?: {
    from: string[];                    // Previous names
    deprecatedIn?: string;             // Version deprecated
    removeIn?: string;                 // Version to remove
    convertTo?: string;                // What to convert to
    reason?: string;                   // Why deprecated
  };
  
  patterns: {
    search: string[];                  // Regex patterns for searching
    lint: LintRule[];                  // Validation rules
  };
  
  aiContext: {
    purpose: string;
    whenToUse: string[];
    whenNotToUse: string[];
    relatedMarkers: string[];
  };
}

export interface LintRule {
  name: string;
  pattern: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  fix?: string;
}
```

### Example Marker Definition

```typescript
// definitions/markers/todo.ts
import { defineMarker } from '../schema';
import { workSignals, blockingTags } from '../mixins';

export default defineMarker({
  marker: 'todo',
  category: 'work',
  description: 'Work to be done',
  
  examples: {
    basic: [
      'todo ::: implement user authentication',
      'todo ::: add error handling',
    ],
    withSignals: [
      '!todo ::: high priority bug fix',
      '!!todo ::: critical security patch',
      '*todo ::: must finish before PR merge',
    ],
    withTags: [
      'todo ::: implement caching #performance',
      'todo ::: fix race condition #depends:#123',
    ],
    realWorld: [
      '*!todo ::: @alice critical auth bug blocking release #security #blocks:#456',
    ],
  },
  
  signals: {
    ...workSignals,
    defaults: {
      priority: {
        '!!': 'P0',
        '!': 'P1',
        '': 'P2',
      },
    },
  },
  
  commonTags: {
    semantic: ['#bug', '#feature', '#enhancement', '#debt'],
    workflow: ['#wip', '#blocked', '#ready'],
    relational: [...blockingTags],
  },
  
  patterns: {
    search: [
      'todo\\s+:::', 
      'todo\\s+:::\\s+@\\w+',
    ],
    lint: [
      {
        name: 'todo-requires-description',
        pattern: 'todo\\s+:::\\s*$',
        level: 'error',
        message: 'Todo waymarks must have a description',
      },
    ],
  },
  
  aiContext: {
    purpose: 'Track work items that need completion',
    whenToUse: [
      'For any actionable task',
      'For feature implementation',
      'For planned improvements',
    ],
    whenNotToUse: [
      'For bugs (use fixme)',
      'For questions (use note with ? signal)',
      'For documentation (use docs or note)',
    ],
    relatedMarkers: ['fixme', 'wip', 'done'],
  },
});
```

### Mixin System for Shared Patterns

```typescript
// definitions/mixins/signals.ts
export const workSignals = {
  allowed: ['!', '!!', '*', '?', '-'] as const,
  meanings: {
    '!': 'high priority',
    '!!': 'critical priority',
    '*': 'branch-scoped (must complete before merge)',
    '?': 'uncertain/needs clarification',
    '-': 'stage for removal',
  },
} as const;

export const infoSignals = {
  allowed: ['!', '!!', '?'] as const,
  meanings: {
    '!': 'important information',
    '!!': 'critical/must-read',
    '?': 'uncertain/needs verification',
  },
} as const;

// definitions/mixins/tags.ts
export const blockingTags = [
  '#blocked',
  '#blocked:#<id>',
  '#depends:#<id>',
  '#needs:#<resource>',
];

export const lifecycleTags = [
  '#wip',
  '#draft', 
  '#ready',
  '#done',
];
```

### Testing Strategy

```typescript
// definitions/markers/__tests__/todo.test.ts
import todo from '../todo';
import { validateMarker, testExamples } from '../../testing';

describe('todo marker', () => {
  it('should pass schema validation', () => {
    expect(() => validateMarker(todo)).not.toThrow();
  });

  it('should have valid examples', () => {
    const allExamples = [
      ...todo.examples.basic,
      ...todo.examples.withSignals || [],
      ...todo.examples.withTags || [],
      ...todo.examples.realWorld || [],
    ];
    
    for (const example of allExamples) {
      expect(testExamples.parse(example)).toMatchObject({
        marker: 'todo',
        valid: true,
      });
    }
  });

  it('should have consistent signal definitions', () => {
    for (const signal of Object.keys(todo.signals.meanings)) {
      expect(todo.signals.allowed).toContain(signal);
    }
  });

  it('should match search patterns', () => {
    for (const example of todo.examples.basic) {
      const matched = todo.patterns.search.some(pattern =>
        new RegExp(pattern).test(example)
      );
      expect(matched).toBe(true);
    }
  });
});
```

### Documentation Generation

```typescript
// scripts/generate-docs.ts
import { loadAllMarkers } from '../definitions';
import { generateMigrationGuide, generateSyntaxDocs } from './generators';

async function generate() {
  const markers = await loadAllMarkers();
  
  // Generate migration guide
  const migration = generateMigrationGuide(markers);
  await fs.writeFile(
    'project/unified-hash-migration-guide.md',
    migration
  );
  
  // Generate syntax reference
  const syntax = generateSyntaxDocs(markers);
  await fs.writeFile('docs/syntax/markers.md', syntax);
  
  // Generate marker categories
  const categories = generateCategories(markers);
  await fs.writeFile('docs/syntax/categories.md', categories);
  
  console.log('✅ Documentation generated from marker definitions');
}

// Watch mode for development
if (process.argv.includes('--watch')) {
  const watcher = chokidar.watch('definitions/**/*.ts');
  watcher.on('change', () => {
    console.log('Marker definition changed, regenerating docs...');
    generate();
  });
}
```

### CLI Integration

```typescript
// src/cli/commands/marker.ts
export class MarkerCommand {
  async info(markerName: string) {
    const definition = await loadMarker(markerName);
    if (!definition) {
      throw new Error(`Unknown marker: ${markerName}`);
    }
    
    console.log(`Marker: ${definition.marker}`);
    console.log(`Category: ${definition.category}`);
    console.log(`Description: ${definition.description}`);
    console.log('\nExamples:');
    definition.examples.basic.forEach(ex => console.log(`  ${ex}`));
    
    if (definition.migration) {
      console.log('\n⚠️  Migration Info:');
      console.log(`  Deprecated in: ${definition.migration.deprecatedIn}`);
      console.log(`  Convert to: ${definition.migration.convertTo}`);
    }
  }
  
  async validate(files: string[]) {
    const markers = await loadAllMarkers();
    const validator = new WaymarkValidator(markers);
    
    for (const file of files) {
      const issues = await validator.validateFile(file);
      if (issues.length > 0) {
        console.log(`\n${file}:`);
        issues.forEach(issue => {
          console.log(`  ${issue.line}:${issue.col} ${issue.level}: ${issue.message}`);
        });
      }
    }
  }
}
```

### Type Generation for Safety

```typescript
// scripts/generate-types.ts
// Generates src/generated/markers.ts

export const WAYMARK_MARKERS = {
  todo: 'todo',
  fixme: 'fixme',
  notice: 'notice',
  // ... generated from definitions
} as const;

export type WaymarkMarker = keyof typeof WAYMARK_MARKERS;

export const DEPRECATED_MARKERS = {
  alert: { convertTo: 'notice', removedIn: 'v2.0' },
  always: { convertTo: 'important', removedIn: 'v2.0' },
  // ... generated from deprecated definitions
} as const;
```

## Benefits

1. **Single Source of Truth**: Change marker definition once, updates everywhere
2. **Type Safety**: TypeScript ensures consistency and catches errors at compile time
3. **Testable**: Each marker definition can be thoroughly tested
4. **Automated Documentation**: Docs always stay in sync with definitions
5. **Migration Support**: Built-in migration paths and deprecation handling
6. **IDE Support**: Full autocomplete and type checking
7. **Extensible**: Easy to add new properties without breaking existing code
8. **AI-Friendly**: Structured context helps LLMs understand marker usage

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create marker schema and validation
- [ ] Set up TypeScript build pipeline
- [ ] Implement basic marker definitions (todo, fixme, note)
- [ ] Create test framework

### Phase 2: Migration (Week 2)
- [ ] Convert all existing markers to definitions
- [ ] Create deprecated marker definitions
- [ ] Build migration mapping generator
- [ ] Update existing tools to use definitions

### Phase 3: Documentation (Week 3)
- [ ] Build documentation generators
- [ ] Generate all docs from definitions
- [ ] Set up watch mode for development
- [ ] Update CI to validate and generate

### Phase 4: Tooling Integration (Week 4)
- [ ] Update CLI to use definitions
- [ ] Implement validation commands
- [ ] Add marker info commands
- [ ] Create VS Code extension integration

## Open Questions

1. Should we version marker definitions independently?
2. How do we handle marker-specific behavior in different languages?
3. Should markers have configurable behavior (e.g., todo auto-assigns to committer)?
4. Do we need a marker registry for third-party markers?

## Conclusion

This marker definition system would transform waymark maintenance from a manual, error-prone process to an automated, type-safe system. By treating marker definitions as code, we gain all the benefits of modern software development: version control, testing, type safety, and automation.

The investment in building this system would pay off immediately through:

- Reduced maintenance burden
- Fewer inconsistencies
- Faster feature development
- Better documentation
- Improved developer experience

## Next Steps

1. Review and approve this proposal
2. Create proof-of-concept with 3-5 markers
3. Test documentation generation
4. Iterate based on feedback
5. Full implementation