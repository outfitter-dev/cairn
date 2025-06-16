<!-- tldr ::: Global SQLite database for fast waymark queries across all projects on a machine +proposal -->

# Proposal: Waymark Database

## Status

| Date       | State | Owner |
|------------|-------|-------|
| 2025-01-30 | Draft | @mg   |

## Context

Currently, finding waymarks requires grep/ripgrep searches across files. While fast for single projects, this approach doesn't scale for:

- Cross-project waymark queries ("show me all my todos across all repos")
- Historical tracking ("how many todos did I complete this week?")
- Complex queries ("find all security-related tasks assigned to me with high priority")
- IDE integration requiring instant results

## Decision

Create a **global SQLite database** that indexes waymarks across all projects on a machine. The database is updated incrementally via git hooks and CLI commands, providing instant queries without repeated file scanning.

## Architecture

```
~/.waymark/
├── waymarks.db          # Global SQLite database
├── config.json          # Global configuration
└── logs/                # Sync logs

Database Schema:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   projects   │────<│   waymarks   │>────│     tags     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ waymark_id   │
│ path         │     │ project_id   │     │ tag          │
│ name         │     │ file_path    │     └──────────────┘
│ last_sync    │     │ line         │
└──────────────┘     │ marker       │     ┌──────────────┐
                     │ content      │>────│ properties   │
                     │ actor        │     ├──────────────┤
                     │ created_at   │     │ waymark_id   │
                     │ updated_at   │     │ key          │
                     │ deleted_at   │     │ value        │
                     └──────────────┘     └──────────────┘
```

## Implementation

### Database Manager

```typescript
// packages/cli/src/lib/waymark-db.ts
import Database from 'better-sqlite3';
import { homedir } from 'os';
import path from 'path';

export class WaymarkDatabase {
  private db: Database.Database;
  
  constructor() {
    const dbPath = path.join(homedir(), '.waymark', 'waymarks.db');
    this.db = new Database(dbPath);
    this.initialize();
  }
  
  private initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY,
        path TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        last_sync DATETIME
      );
      
      CREATE TABLE IF NOT EXISTS waymarks (
        id INTEGER PRIMARY KEY,
        project_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        line INTEGER NOT NULL,
        marker TEXT NOT NULL,
        content TEXT,
        actor TEXT,
        hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        UNIQUE(project_id, file_path, line, hash)
      );
      
      CREATE TABLE IF NOT EXISTS properties (
        waymark_id INTEGER NOT NULL,
        key TEXT NOT NULL,
        value TEXT,
        FOREIGN KEY (waymark_id) REFERENCES waymarks(id),
        PRIMARY KEY (waymark_id, key)
      );
      
      CREATE TABLE IF NOT EXISTS tags (
        waymark_id INTEGER NOT NULL,
        tag TEXT NOT NULL,
        FOREIGN KEY (waymark_id) REFERENCES waymarks(id),
        PRIMARY KEY (waymark_id, tag)
      );
      
      -- Indexes for common queries
      CREATE INDEX IF NOT EXISTS idx_waymarks_actor ON waymarks(actor);
      CREATE INDEX IF NOT EXISTS idx_waymarks_marker ON waymarks(marker);
      CREATE INDEX IF NOT EXISTS idx_waymarks_project_file ON waymarks(project_id, file_path);
      CREATE INDEX IF NOT EXISTS idx_properties_key_value ON properties(key, value);
    `);
  }
  
  async syncProject(projectPath: string) {
    // 1. Get or create project
    const project = this.ensureProject(projectPath);
    
    // 2. Get current waymarks from database
    const existingWaymarks = this.getProjectWaymarks(project.id);
    
    // 3. Parse all waymarks from files
    const currentWaymarks = await this.parseProjectWaymarks(projectPath);
    
    // 4. Diff and update
    this.syncWaymarks(project.id, existingWaymarks, currentWaymarks);
    
    // 5. Update last sync time
    this.updateProjectSync(project.id);
  }
  
  query(sql: string, params?: any[]): WaymarkResult[] {
    // Execute arbitrary queries with safety checks
    return this.db.prepare(sql).all(params);
  }
}
```

### CLI Commands

```bash
# Sync current project
waymark db sync

# Sync all projects in workspace
waymark db sync --all

# Query examples
waymark db query "todos assigned to me"
waymark db query "high priority security issues"
waymark db query "todos created this week"

# Pre-built queries
waymark db stats                    # Overview statistics
waymark db todos --mine            # All todos assigned to current user
waymark db recent --days=7         # Recently added waymarks
waymark db stale --days=30         # Old unresolved items
```

### Query Language

Support natural language queries that compile to SQL:

```typescript
// Natural language → SQL compiler
class QueryCompiler {
  compile(query: string): string {
    // "todos assigned to me" → 
    // SELECT * FROM waymarks w
    // WHERE w.marker = 'todo' 
    // AND w.actor = '@' || $currentUser
    // AND w.deleted_at IS NULL
    
    // "high priority security issues" →
    // SELECT * FROM waymarks w
    // JOIN properties p ON w.id = p.waymark_id
    // JOIN tags t ON w.id = t.waymark_id
    // WHERE p.key = 'priority' AND p.value = 'high'
    // AND t.tag = 'security'
    // AND w.deleted_at IS NULL
  }
}
```

## Integration Points

### Git Hooks
- Post-commit: Sync changed files only
- Post-checkout: Full project sync
- Post-merge: Sync changed files

### Editor Integration
- LSP server queries database for instant results
- Real-time updates on file save
- Cross-project "go to definition" for actors

### CI/CD
- Export waymarks for documentation
- Track waymark velocity metrics
- Enforce waymark policies

## Privacy & Security

- Database is local-only (no cloud sync)
- File paths are relative to project root
- Option to exclude sensitive projects
- Encrypted database option for sensitive environments

## Performance

- Initial sync: ~1000 waymarks/second
- Incremental sync: <50ms for typical commits
- Query response: <10ms for indexed queries
- Database size: ~1KB per waymark (highly compressible)

## Migration Plan

### Phase 1: Core Database (1 week)
- Implement database schema
- Basic CRUD operations
- Project sync functionality

### Phase 2: CLI Integration (1 week)
- `waymark db` subcommands
- Natural language query compiler
- Progress reporting

### Phase 3: Git Hooks (3 days)
- Incremental sync on commit
- Full sync on checkout
- Configuration options

### Phase 4: Advanced Features (ongoing)
- Historical tracking
- Velocity metrics
- Cross-project refactoring

## Success Metrics

- Query performance <10ms for 100K waymarks
- Incremental sync <100ms for typical commits
- Zero data loss during sync operations
- 90% of queries expressible in natural language

## Risks & Mitigations

- **Sync conflicts** - Use hash-based deduplication
- **Database corruption** - Daily backups, WAL mode
- **Performance degradation** - Periodic VACUUM, index optimization
- **Storage growth** - Auto-cleanup of deleted waymarks after 90 days