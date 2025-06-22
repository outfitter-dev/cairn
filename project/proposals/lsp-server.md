<!-- tldr ::: technical proposal for implementing a Language Server Protocol server for waymarks #proposal #lsp #tooling -->

# Waymark Language Server Protocol (LSP) Implementation Proposal

<!-- about ::: ##proposals/lsp concrete implementation plan for waymark LSP server with milestones and architecture -->

## Summary

This proposal outlines the implementation of a Language Server Protocol (LSP) server for waymarks, enabling rich IDE features across multiple editors. The LSP server will provide real-time syntax validation, intelligent completions, navigation features, and automated fixes for waymark v1.0 compliance.

## Motivation

### Current Limitations

1. **Manual Compliance**: Developers must remember v1.0 syntax rules
2. **No IDE Support**: Missing syntax highlighting, validation, and navigation
3. **Error-Prone**: Easy to create invalid waymarks without immediate feedback
4. **Limited Discovery**: Finding related waymarks requires manual grep commands

### Benefits of LSP Implementation

1. **Universal Editor Support**: One implementation works across VS Code, Neovim, Sublime, etc.
2. **Real-time Feedback**: Immediate validation and syntax checking
3. **Enhanced Productivity**: Completions, quick fixes, and navigation
4. **Standardized Approach**: LSP is the industry standard for language tooling

## Technical Design

### Architecture

```
┌─────────────────┐     LSP Protocol      ┌──────────────────┐
│   IDE Client    │◄─────────────────────►│  Waymark LSP     │
│  (VS Code, etc) │      JSON-RPC          │     Server       │
└─────────────────┘                        └──────────────────┘
                                                    │
                                          ┌─────────┴──────────┐
                                          │                    │
                                    ┌─────▼──────┐    ┌────────▼───────┐
                                    │   Parser   │    │   Registry     │
                                    │            │    │                │
                                    │ • Extract  │    │ • Anchors      │
                                    │ • Validate │    │ • Actors       │
                                    │ • Cache    │    │ • References   │
                                    └────────────┘    └────────────────┘
```

### Core Components

#### 1. Waymark Parser

```typescript
interface WaymarkParser {
  // Parse waymarks from document content
  parse(document: TextDocument): ParseResult;
  
  // Incremental parsing for performance
  parseIncremental(
    document: TextDocument, 
    changes: TextDocumentContentChangeEvent[]
  ): ParseResult;
  
  // Language-specific comment patterns
  getCommentPattern(languageId: string): CommentPattern;
}

interface ParseResult {
  waymarks: Waymark[];
  errors: ValidationError[];
}
```

#### 2. Language-Specific Comment Detection

```typescript
const languageComments = new Map<string, CommentPattern>([
  ['javascript', {
    single: /\/\/\s*(.+)/,
    multiStart: /\/\*\s*/,
    multiEnd: /\s*\*\//,
  }],
  ['python', {
    single: /#\s*(.+)/,
    multiStart: /"""/,
    multiEnd: /"""/,
  }],
  ['html', {
    single: null,
    multiStart: /<!--\s*/,
    multiEnd: /\s*-->/,
  }],
  // ... more languages
]);
```

#### 3. Waymark Registry

```typescript
interface WaymarkRegistry {
  // Track anchors across workspace
  registerAnchor(anchor: Anchor): void;
  findAnchor(name: string): Anchor | undefined;
  
  // Track actor assignments
  getActorWaymarks(actor: string): Waymark[];
  
  // Issue tracking
  getIssueReferences(issueId: string): Waymark[];
  
  // Cross-file relationships
  getDependencyGraph(): DependencyGraph;
}
```

### LSP Feature Implementation

#### 1. Diagnostics

```typescript
class WaymarkDiagnosticProvider {
  provideDiagnostics(document: TextDocument): Diagnostic[] {
    const result = parser.parse(document);
    
    return result.errors.map(error => ({
      severity: DiagnosticSeverity.Error,
      range: error.range,
      message: error.message,
      code: error.code,
      source: 'waymark',
      data: { fixes: error.fixes }
    }));
  }
}
```

#### 2. Completions

```typescript
class WaymarkCompletionProvider {
  provideCompletions(
    document: TextDocument, 
    position: Position
  ): CompletionItem[] {
    const context = getCompletionContext(document, position);
    
    switch (context.type) {
      case 'marker':
        return getMarkerCompletions();
      case 'actor':
        return getActorCompletions();
      case 'tag':
        return getTagCompletions();
      case 'anchor':
        return getAnchorCompletions();
    }
  }
}
```

#### 3. Code Actions

```typescript
class WaymarkCodeActionProvider {
  provideCodeActions(
    document: TextDocument,
    range: Range,
    context: CodeActionContext
  ): CodeAction[] {
    const actions: CodeAction[] = [];
    
    // Quick fixes from diagnostics
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.data?.fixes) {
        actions.push(...createQuickFixes(diagnostic));
      }
    }
    
    // Refactoring actions
    actions.push(...createRefactorings(document, range));
    
    return actions;
  }
}
```

## Implementation Phases

### Phase 1: Foundation (4 weeks)

**Goal**: Basic LSP server with parsing and diagnostics

- [ ] LSP server scaffold in TypeScript
- [ ] Waymark parser for v1.0 syntax
- [ ] Language-specific comment detection
- [ ] Basic diagnostics for syntax errors
- [ ] VS Code extension wrapper

**Deliverables**:
- Working LSP server binary
- Simple VS Code extension
- Support for JS/TS, Python, Markdown

### Phase 2: Navigation (3 weeks)

**Goal**: Enable code navigation features

- [ ] Document symbols provider
- [ ] Go to definition for anchors
- [ ] Find references implementation
- [ ] Hover information provider
- [ ] Workspace-wide anchor registry

**Deliverables**:
- Full navigation support
- Cross-file anchor tracking
- Rich hover documentation

### Phase 3: Intelligence (4 weeks)

**Goal**: Smart completions and automated fixes

- [ ] Context-aware completions
- [ ] Code actions for quick fixes
- [ ] Automated v1.0 migration
- [ ] Batch refactoring support
- [ ] Snippet integration

**Deliverables**:
- Full completion support
- One-click violation fixes
- Migration tools

### Phase 4: Advanced Features (4 weeks)

**Goal**: Premium features and integrations

- [ ] Waymark graph visualization
- [ ] Custom commands (reports, analytics)
- [ ] GitHub issue integration
- [ ] Multi-root workspace support
- [ ] Performance optimizations

**Deliverables**:
- Advanced analytics
- External integrations
- Production-ready performance

## Integration Examples

### VS Code Extension

```json
{
  "name": "waymark-lsp",
  "displayName": "Waymark Language Support",
  "description": "Language support for waymark annotations",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.75.0"
  },
  "activationEvents": [
    "onLanguage:javascript",
    "onLanguage:typescript",
    "onLanguage:python",
    "onLanguage:markdown"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "configuration": {
      "title": "Waymark",
      "properties": {
        "waymark.enable": {
          "type": "boolean",
          "default": true
        },
        "waymark.trace.server": {
          "type": "string",
          "enum": ["off", "messages", "verbose"],
          "default": "off"
        }
      }
    }
  }
}
```

### Neovim Configuration

```lua
-- ~/.config/nvim/lua/lsp/waymark.lua
local lspconfig = require('lspconfig')

lspconfig.waymark_lsp.setup {
  cmd = { 'waymark-lsp', '--stdio' },
  filetypes = { 'javascript', 'typescript', 'python', 'markdown' },
  root_dir = lspconfig.util.root_pattern('.git', 'package.json'),
  settings = {
    waymark = {
      enable = true,
      validation = {
        v1compliance = true,
      }
    }
  }
}
```

## Performance Considerations

### Parsing Strategy

1. **Incremental Parsing**: Only reparse changed regions
2. **Debouncing**: 500ms delay for validation during typing
3. **Caching**: Store parsed results per document version
4. **Background Processing**: Use worker threads for large files

### Memory Management

```typescript
class DocumentCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 100; // Maximum cached documents
  
  set(uri: string, data: ParseResult): void {
    // LRU eviction when cache is full
    if (this.cache.size >= this.maxSize) {
      const oldest = this.findOldestEntry();
      this.cache.delete(oldest);
    }
    
    this.cache.set(uri, {
      data,
      timestamp: Date.now(),
      version: 0
    });
  }
}
```

### Scalability

- **Lazy Loading**: Load workspace symbols on demand
- **Pagination**: Return large result sets in chunks
- **Indexing**: Build indexes for common queries
- **Streaming**: Process large files in chunks

## Testing Strategy

### Unit Tests

```typescript
describe('WaymarkParser', () => {
  it('should parse v1.0 syntax correctly', () => {
    const content = '// !todo ::: @alice implement feature #backend';
    const result = parser.parse(createDocument(content));
    
    expect(result.waymarks).toHaveLength(1);
    expect(result.waymarks[0]).toMatchObject({
      marker: 'todo',
      signal: '!',
      actor: '@alice',
      tags: ['#backend']
    });
  });
});
```

### Integration Tests

- Test with real VS Code instance
- Verify all LSP messages
- Check performance with large files
- Multi-language validation

### End-to-End Tests

- Complete user workflows
- Cross-file navigation
- Refactoring scenarios
- Performance benchmarks

## Success Metrics

### Adoption Metrics

- [ ] 1000+ extension installs within 3 months
- [ ] Support for 10+ languages
- [ ] 95%+ v1.0 syntax compliance in codebases using LSP

### Performance Metrics

- [ ] Parse 10K LOC file in <100ms
- [ ] Provide completions in <50ms
- [ ] Memory usage <100MB for typical project

### Quality Metrics

- [ ] <1% false positive rate for diagnostics
- [ ] 99%+ uptime for language server
- [ ] <5 critical bugs in first 6 months

## Alternative Approaches Considered

### 1. VS Code Extension Only

- **Pros**: Simpler, faster to market
- **Cons**: Limited to VS Code, no standard protocol
- **Decision**: Rejected - limits adoption

### 2. Tree-sitter Grammar

- **Pros**: Fast parsing, good IDE integration
- **Cons**: Complex grammar for comments, limited features
- **Decision**: Consider for future optimization

### 3. CLI with Editor Plugins

- **Pros**: Simpler architecture, reuses CLI
- **Cons**: Poor real-time performance, limited features
- **Decision**: Rejected - poor user experience

## Risks and Mitigations

### Technical Risks

1. **Performance with large files**
   - Mitigation: Implement streaming parser
   
2. **Complex comment syntax across languages**
   - Mitigation: Start with common languages, expand gradually
   
3. **LSP protocol limitations**
   - Mitigation: Use custom messages where needed

### Adoption Risks

1. **Low initial adoption**
   - Mitigation: Partner with waymark early adopters
   
2. **Competition from simpler tools**
   - Mitigation: Focus on unique LSP features
   
3. **Maintenance burden**
   - Mitigation: Build strong test suite, automate releases

## Conclusion

The Waymark LSP server represents a significant step forward in waymark tooling. By implementing the Language Server Protocol, we can provide a professional development experience across all major editors while maintaining a single codebase. The phased approach allows us to deliver value incrementally while building toward a comprehensive solution.

## Next Steps

1. **Approval**: Review and approve this proposal
2. **Team Formation**: Assign 2-3 developers
3. **Prototype**: Build Phase 1 proof of concept
4. **User Testing**: Deploy to early adopters
5. **Iterate**: Refine based on feedback

The future of waymark adoption depends on excellent tooling. This LSP implementation will make waymarks as easy to use as they are powerful.