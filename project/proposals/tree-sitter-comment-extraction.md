<!-- tldr ::: Use Tree-sitter for reliable comment extraction only, keeping our existing waymark parser for syntax handling +proposal -->

# Proposal: Tree-sitter for Comment Extraction

## Status

| Date       | State | Owner |
|------------|-------|-------|
| 2025-01-30 | Draft | @mg   |

## Context

Waymarks (`:::`) are currently found using regex patterns that search entire files. This approach has one critical flaw: **false positives when `:::` appears inside strings, templates, or other non-comment contexts**.

However, our current waymark parser works well for parsing the actual waymark syntax once comments are identified. The syntax is simple, line-oriented, and well-defined. We don't need to replace what's working - we just need to find comments more reliably.

## Decision

Use **Tree-sitter ONLY for comment extraction**, then pass extracted comments to our existing waymark parser. This surgical approach solves the false positive problem without disrupting our entire toolchain.

## Rationale

1. **Solves the actual problem** - No more false positives in strings/templates
2. **Preserves working code** - Existing parser, migration scripts, and audit tools continue working
3. **Language agnostic** - Tree-sitter handles comment syntax differences across languages
4. **Fast** - Extract comments once, then use our optimized regex patterns
5. **Simple** - Tree-sitter is used for what it does best: parsing syntax trees

## Architecture

```
┌─────────────────────┐
│   Source File       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Tree-sitter        │ ← Extracts all comments
│  Comment Extractor  │   (language-aware)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Waymark Parser     │ ← Existing parser
│  (Enhanced)         │   (unchanged logic)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Ignore Filters     │ ← Existing system
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Results/Actions    │
└─────────────────────┘
```

## Implementation

### Core Comment Extractor

```typescript
// packages/core/src/lib/comment-extractor.ts
import { Parser } from 'tree-sitter';

export interface ExtractedComment {
  text: string;
  line: number;
  column: number;
  type: 'line' | 'block' | 'doc';
  language: string;
}

export class CommentExtractor {
  private parsers: Map<string, Parser> = new Map();
  
  async extractComments(
    content: string, 
    filePath: string
  ): Promise<ExtractedComment[]> {
    const language = this.detectLanguage(filePath);
    
    // Fallback to regex for unsupported languages
    if (!this.hasTreeSitterSupport(language)) {
      return this.regexFallback(content, language);
    }
    
    const parser = await this.getParser(language);
    const tree = parser.parse(content);
    
    return this.walkTree(tree.rootNode, content, language);
  }
  
  private walkTree(node: Node, content: string, language: string): ExtractedComment[] {
    const comments: ExtractedComment[] = [];
    
    if (this.isCommentNode(node)) {
      comments.push({
        text: node.text,
        line: node.startPosition.row + 1,
        column: node.startPosition.column,
        type: this.getCommentType(node),
        language
      });
    }
    
    // Recursively walk children
    for (let i = 0; i < node.childCount; i++) {
      comments.push(...this.walkTree(node.child(i)!, content, language));
    }
    
    return comments;
  }
}
```

### Enhanced Parser Integration

```typescript
// packages/core/src/parser/waymark-parser.ts
export class WaymarkParser {
  private commentExtractor = new CommentExtractor();
  
  async parse(content: string, filePath: string): Promise<ParseResult> {
    // Step 1: Extract all comments using Tree-sitter
    const comments = await this.commentExtractor.extractComments(content, filePath);
    
    // Step 2: Filter comments containing :::
    const waymarkComments = comments.filter(c => c.text.includes(':::'));
    
    // Step 3: Parse waymarks using existing regex logic
    const waymarks = waymarkComments.flatMap(comment => 
      this.parseWaymarkFromComment(comment)
    );
    
    return {
      waymarks,
      errors: this.validateWaymarks(waymarks)
    };
  }
  
  private parseWaymarkFromComment(comment: ExtractedComment): Waymark[] {
    // Existing regex-based parsing logic
    // No changes needed here!
    return this.existingParser(comment.text, comment.line);
  }
}
```

## Migration Plan

### Phase 1: Setup (2 days)
- Add `tree-sitter` and language grammars as dependencies
- Create `CommentExtractor` class with regex fallback
- Add tests comparing old vs new parser results

### Phase 2: Integration (3 days)
- Update `WaymarkParser` to use comment extraction
- Ensure all existing tests pass
- Add feature flag for gradual rollout

### Phase 3: Language Support (1 week)
- Add grammars for: TypeScript, JavaScript, Python, Go, Rust
- Test on real codebases
- Document supported languages

### Phase 4: Optimization (2 days)
- Cache parsed trees for incremental parsing
- Benchmark performance
- Remove feature flag

## Success Metrics

- **Zero false positives** in test suite with strings containing `:::`
- **Performance** within 20% of current parser
- **No breaking changes** to existing tools
- **5+ languages** supported with Tree-sitter

## Alternatives Considered

1. **Full Tree-sitter/ast-grep migration** - Too complex, breaks existing tools
2. **Improve regex patterns** - Can't fully solve string literal problem
3. **Custom lexer** - Reinventing Tree-sitter

## Risks & Mitigations

- **Grammar loading overhead** - Lazy load only needed grammars
- **Binary size increase** - Tree-sitter adds ~2MB per grammar
  - Mitigation: Optional peer dependencies for less common languages
- **Regex fallback accuracy** - Current behavior for unsupported languages
  - Mitigation: Clear docs on which languages have full support

## FAQ

**Q: Why not use ast-grep for waymark pattern matching?**  
A: Waymark syntax is line-oriented and simple. Our regex patterns work perfectly once we have clean comment text. ast-grep is designed for structural code patterns, not comment metadata.

**Q: Will this break existing waymark tools?**  
A: No. The parser API remains the same. Only the internal implementation changes.

**Q: What about performance?**  
A: Tree-sitter is fast (used by GitHub for syntax highlighting). We parse once and cache results. For most files, this will be faster than multiple regex passes.