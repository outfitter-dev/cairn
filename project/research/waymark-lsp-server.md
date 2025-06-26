<!-- tldr ::: comprehensive research on implementing a Language Server Protocol (LSP) server for waymarks #research #lsp #tooling -->

# LSP Server for Waymarks: Feasibility Research

<!-- about ::: ##wm/lsp/research evaluation of technical approaches and implementation strategies for waymark LSP -->

## Executive Summary

Implementing a Language Server Protocol (LSP) server for Waymarks is both **feasible and valuable**. While waymarks exist as comments embedded within host languages, several successful precedents demonstrate effective approaches for similar scenarios. The LSP architecture supports our use case through standard features like diagnostics, hover information, and code actions, while also allowing custom extensions for waymark-specific functionality.

## How LSP Servers Work with Embedded Languages

### Overview

LSP servers for embedded languages typically use one of three approaches:

1. **Virtual Document Approach**: Create virtual documents containing only the target language content
2. **Region-Based Processing**: Identify and process specific regions within the host document
3. **Full Document Analysis**: Parse the entire document and extract relevant sections

For waymarks, the **Full Document Analysis** approach is most suitable since waymarks are scattered throughout files as comments rather than existing in contiguous blocks.

### Precedents and Similar Projects

#### 1. TODO Comments in Language Servers

Many language servers already handle TODO-style comments:

- **TypeScript Language Server**: Can be configured to report TODO comments
- **rust-analyzer**: Provides TODO comment highlighting and navigation
- **Python language servers** (pylsp): Support TODO detection through diagnostics

These implementations typically:
- Parse source files during `textDocument/didOpen` or `textDocument/didChange` events
- Use regex patterns to find comment markers (`TODO:`, `FIXME:`, etc.)
- Report findings through diagnostics or custom notifications

#### 2. Better Comments Extension

While not a full LSP implementation, the Better Comments VS Code extension demonstrates effective comment annotation handling:

- Uses regex-based parsing to identify comment patterns
- Applies text decorations based on comment tags (`!`, `?`, `//`, etc.)
- Supports multiple languages through comment syntax detection
- Works across embedded languages in HTML/CSS/JS files

Key insight: The extension's parser approach could be adapted for LSP implementation.

#### 3. JSDoc Language Support

JSDoc provides another relevant example:
- Parses comments containing structured documentation
- Provides hover information, completions, and validation
- Integrates with the TypeScript language server
- Handles comments across multiple file types

#### 4. Embedded Language Servers (HTML/CSS/JS)

The vscode-html-languageservice demonstrates sophisticated embedded language handling:
- Breaks documents into language regions
- Delegates to appropriate language services
- Provides seamless multi-language support

## Valuable Features for a Waymarks LSP

### 1. Syntax Highlighting

- **Implementation**: Use semantic tokens provider
- **Value**: Visual distinction between signals, markers, actors, tags
- **Example**: Different colors for `!todo`, `@alice`, `#critical`

### 2. Diagnostics (v1.0 Compliance)

- **Implementation**: Validate waymarks during document changes
- **Value**: Real-time feedback on syntax errors and violations
- **Examples**:
  - Deprecated syntax: `+tag` → `#tag`
  - Invalid markers: `TODO` → `todo`
  - Missing references: `fixes:123` → `#fixes:#123`

### 3. Hover Information

- **Implementation**: Provide context on hover
- **Value**: Quick access to waymark metadata without leaving editor
- **Content**:
  - Marker definition and purpose
  - Signal meanings (`!` = high priority)
  - Tag relationships (`#fixes:#123` links to issue)
  - Actor information (`@alice` profile/assignments)

### 4. Go to Definition (Anchors/References)

- **Implementation**: Support navigation between anchors and references
- **Value**: Quick navigation across large codebases
- **Features**:
  - Jump from `#refs:#auth/login` to `##auth/login` definition
  - Find all references to an anchor
  - Navigate between related waymarks

### 5. Code Actions (Fix Violations)

- **Implementation**: Provide quick fixes for common issues
- **Value**: Automated migration to v1.0 syntax
- **Actions**:
  - Convert `+security` to `#security`
  - Change `priority:high` to `!marker`
  - Fix array spacing: `#cc:@a, @b` → `#cc:@a,@b`
  - Convert deprecated markers: `alert` → `notice`

### 6. Completions

- **Implementation**: Context-aware suggestions
- **Value**: Faster, more accurate waymark creation
- **Suggestions**:
  - Official markers after typing `// `
  - Common tags after `#`
  - Team members after `@`
  - Issue numbers after `#fixes:#`
  - Existing anchors after `#refs:`

### 7. Document Symbols

- **Implementation**: Expose waymarks as document symbols
- **Value**: Quick navigation via outline view
- **Organization**:
  - Group by marker type
  - Show priority via signals
  - Include actor assignments

### 8. Workspace-wide Features

- **Implementation**: Cross-file waymark analysis
- **Value**: Project-level insights and navigation
- **Features**:
  - Find all waymarks assigned to an actor
  - Track issue references across codebase
  - Generate waymark reports
  - Identify orphaned anchors

## Technical Approach

### Architecture Overview

```typescript
// Conceptual architecture
interface WaymarkLanguageServer {
  // Core LSP handlers
  onInitialize(params: InitializeParams): InitializeResult;
  onDidChangeContent(params: DidChangeTextDocumentParams): void;
  
  // Waymark-specific services
  parser: WaymarkParser;           // Extract waymarks from comments
  validator: WaymarkValidator;     // Check v1.0 compliance
  registry: WaymarkRegistry;       // Track anchors, actors, issues
  
  // Feature providers
  diagnosticProvider: DiagnosticProvider;
  completionProvider: CompletionProvider;
  hoverProvider: HoverProvider;
  definitionProvider: DefinitionProvider;
  codeActionProvider: CodeActionProvider;
  documentSymbolProvider: DocumentSymbolProvider;
}
```

### Handling Multiple Host Languages

The LSP server must handle waymarks across different comment syntaxes:

```typescript
interface CommentPattern {
  language: string;
  patterns: {
    singleLine: RegExp;      // e.g., /\/\/ (.*)/
    multiLineStart: RegExp;  // e.g., /\/\*/
    multiLineEnd: RegExp;    // e.g., /\*\//
  };
}

const commentPatterns: CommentPattern[] = [
  { language: 'javascript', patterns: { /* ... */ } },
  { language: 'python', patterns: { /* ... */ } },
  { language: 'html', patterns: { /* ... */ } },
  // ... more languages
];
```

### Integration Points

1. **File Type Detection**: Use document URI and language ID
2. **Comment Extraction**: Language-specific regex patterns
3. **Position Mapping**: Maintain accurate line/column positions
4. **Change Tracking**: Incremental parsing for performance

### Custom Protocol Extensions

While LSP provides standard features, waymark-specific functionality may require custom messages:

```typescript
// Custom requests
interface WaymarkReportRequest {
  method: 'waymark/report';
  params: {
    scope: 'workspace' | 'file';
    filters?: {
      markers?: string[];
      actors?: string[];
      tags?: string[];
    };
  };
}

// Custom notifications
interface WaymarkAnchorUpdate {
  method: 'waymark/anchorUpdate';
  params: {
    added: Anchor[];
    removed: Anchor[];
    modified: Anchor[];
  };
}
```

## Implementation Recommendations

### Phase 1: Core Features (MVP)

1. **Basic Parsing**: Extract waymarks from common languages
2. **Syntax Validation**: Report v1.0 violations as diagnostics
3. **Hover Information**: Show waymark details on hover
4. **Document Symbols**: Enable outline navigation

### Phase 2: Enhanced Navigation

1. **Go to Definition**: Anchor/reference navigation
2. **Find References**: Locate all anchor usages
3. **Workspace Symbols**: Cross-file waymark search
4. **Code Lens**: Show reference counts, actor assignments

### Phase 3: Intelligent Assistance

1. **Completions**: Context-aware suggestions
2. **Code Actions**: Automated fixes and migrations
3. **Refactoring**: Rename anchors, reassign actors
4. **Quick Fixes**: One-click violation corrections

### Phase 4: Advanced Features

1. **Waymark Graph**: Visualize relationships
2. **Custom Commands**: Generate reports, analytics
3. **Integration APIs**: Connect with issue trackers
4. **AI Assistance**: Smart waymark suggestions

## Technical Considerations

### Performance

- **Incremental Parsing**: Only reparse changed sections
- **Caching**: Store parsed waymarks per document
- **Debouncing**: Delay validation during rapid edits
- **Background Processing**: Use worker threads for large files

### Scalability

- **Large Files**: Stream processing for files >1MB
- **Many Waymarks**: Efficient data structures (tries, indexes)
- **Workspace Scale**: Lazy loading, pagination
- **Memory Management**: Clear caches for closed documents

### Cross-Platform Support

- **Node.js Based**: Ensure compatibility across OS
- **File System**: Handle different path separators
- **Encoding**: Support UTF-8, UTF-16
- **Line Endings**: Handle CRLF and LF

## Integration Strategy

### VS Code Extension

```json
{
  "contributes": {
    "languages": [{
      "id": "waymark",
      "aliases": ["Waymark", "waymark"],
      "configuration": "./language-configuration.json"
    }],
    "grammars": [{
      "language": "waymark",
      "scopeName": "comment.waymark",
      "injectTo": ["source", "text"]
    }]
  }
}
```

### Standalone Server

```typescript
// Server can be used by any LSP client
const server = new WaymarkLanguageServer();
server.listen(createConnection(
  new StreamMessageReader(process.stdin),
  new StreamMessageWriter(process.stdout)
));
```

### Multi-Editor Support

- **VS Code**: Native extension
- **Neovim**: Via nvim-lspconfig
- **Sublime Text**: Via LSP package
- **IntelliJ**: Via LSP Support plugin

## Comparison with Alternative Approaches

### VS Code Extension Only (like Better Comments)

**Pros**:
- Simpler implementation
- Direct access to VS Code APIs
- Faster development

**Cons**:
- VS Code specific
- Limited to decoration/highlighting
- No cross-editor support

### Ripgrep Integration

**Pros**:
- Leverages existing search tool
- Fast performance
- Works everywhere

**Cons**:
- No real-time feedback
- No IDE integration
- Command-line only

### Custom Parser Libraries

**Pros**:
- Can be embedded anywhere
- Full control over implementation
- Language agnostic

**Cons**:
- Requires integration work
- No standard protocol
- Limited IDE features

### LSP Server (Recommended)

**Pros**:
- Standard protocol
- Multi-editor support
- Rich feature set
- Future-proof

**Cons**:
- More complex implementation
- Requires LSP client support
- Initial development overhead

## Conclusion and Next Steps

Implementing an LSP server for Waymarks is not only feasible but recommended for providing a professional, cross-platform development experience. The LSP architecture provides excellent support for comment-based syntaxes, and successful implementations like TODO comment support and Better Comments demonstrate viable approaches.

### Recommended Next Steps

1. **Prototype Development**
   - Start with a minimal TypeScript-based LSP server
   - Implement basic parsing and diagnostics
   - Test with VS Code LSP client

2. **Community Feedback**
   - Share prototype with waymark users
   - Gather feature priorities
   - Identify pain points

3. **Incremental Enhancement**
   - Add features based on user feedback
   - Optimize performance for large codebases
   - Expand language support

4. **Ecosystem Integration**
   - Create VS Code extension
   - Document setup for other editors
   - Develop language client libraries

The investment in LSP implementation will pay dividends by providing a consistent, powerful waymark experience across all development environments.