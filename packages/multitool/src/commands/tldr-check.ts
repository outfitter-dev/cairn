import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { FileFinder } from '../lib/file-finder.js';
import { initializeConfig, status, logger } from '../lib/cli-config.js';
import { getSymbols } from '../lib/ui-components.js';

interface TldrOptions {
  json?: boolean;
  strict?: boolean;
  verbose?: boolean;
  require?: string[];
  minTags?: string;
  pattern?: string[];
  file?: string[];
  unicode?: boolean;
  color?: boolean;
}

interface TldrResult {
  line: number;
  raw: string;
  description: string;
  anchor: string | null;
  tags: string[];
  length: number;
}

interface TldrAnalysis {
  issues: string[];
  suggestions: string[];
}

export function createTldrCheckCommand(): Command {
  const tldrCheck = new Command('tldr-check')
    .description('Analyze TLDR waymark quality and compliance.')
    .option('--json', 'Output as JSON for tooling')
    .option('--strict', 'Enable all quality checks (requires tags and anchors)')
    .option('-v, --verbose', 'Show detailed suggestions')
    .option('--require <items...>', 'Require specific elements (tags, anchors)')
    .option('--min-tags <n>', 'Require a minimum number of tags', '0')
    .option('--pattern <patterns...>', 'File glob patterns')
    .option('--file <files...>', 'Specific file paths')
    .option('--no-unicode', 'Use ASCII characters instead of Unicode')
    .option('--no-color', 'Disable colored output')
    .action(async (options: TldrOptions) => {
      await runTldrCheck(options);
    });

  return tldrCheck;
}

async function runTldrCheck(options: TldrOptions) {
  initializeConfig(options);
  const rootDir = process.cwd();
  const fileFinder = new FileFinder({
    rootDir,
    patterns: options.pattern ?? [],
    specificFiles: options.file ?? [],
  });

  const files = await fileFinder.findFiles();
  const results: { file: string; tldr: TldrResult | null; analysis: TldrAnalysis }[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
      const tldr = extractTLDR(content);
      const analysis = analyzeTLDR(tldr, file, options);
      results.push({ file, tldr, analysis });
    } catch (err) {
      // Ignore files that can't be read
    }
  }
  
  generateReport(results, options);
}

function extractTLDR(content: string): TldrResult | null {
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    if (!line) continue;
    
    const tldrMatch = line.match(/tldr\s*:::\s*(.+)$/);
    if (tldrMatch?.[1]) {
      const fullContent = tldrMatch[1].trim();
      const anchorMatch = fullContent.match(/^##(\S+)\s+(.*)$/);
      const description = anchorMatch?.[2] || fullContent;
      const tags = [...description.matchAll(/#(\w+(?::\w+)?)/g)].map(m => m[1]);
      
      return {
        line: i + 1,
        raw: line.trim(),
        description,
        anchor: anchorMatch?.[1] || null,
        tags: tags as string[],
        length: description.length,
      };
    }
  }
  return null;
}

function analyzeTLDR(tldr: TldrResult | null, filePath: string, options: TldrOptions): TldrAnalysis {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const minTags = parseInt(options.minTags || '0', 10);
  const requireItems = options.require || [];
  const requireTags = options.strict || requireItems.includes('tags');
  const requireAnchors = options.strict || requireItems.includes('anchors');

  if (!tldr) {
    issues.push('Missing tldr waymark');
    return { issues, suggestions };
  }

  if (requireTags && tldr.tags.length === 0) {
    issues.push('No tags found');
    suggestions.push(`Consider adding tags like #docs, #tooling, or #component.`);
  }

  if (requireAnchors && !tldr.anchor) {
    issues.push('No canonical anchor found');
    const baseName = path.basename(filePath, path.extname(filePath));
    const suggestedAnchor = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    suggestions.push(`Consider adding anchor: ##${suggestedAnchor}`);
  }

  if (minTags > 0 && tldr.tags.length < minTags) {
    issues.push(`Only ${tldr.tags.length} tags found (minimum: ${minTags})`);
  }

  return { issues, suggestions };
}

function generateReport(results: any[], options: TldrOptions) {
  const symbols = getSymbols();
  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  const missing = results.filter(r => !r.tldr);
  const withIssues = results.filter(r => r.tldr && r.analysis.issues.length > 0);

  if (missing.length === 0 && withIssues.length === 0) {
    status(`All ${results.length} analyzed files have a valid tldr.`, 'success');
    return;
  }

  if (missing.length > 0) {
    logger.error(`\n${missing.length} files are missing a tldr waymark:`);
    missing.forEach(r => logger.error(`  - ${r.file}`));
  }

  if (withIssues.length > 0) {
    logger.warn(`\n${withIssues.length} files have tldr waymarks with issues:`);
    withIssues.forEach(r => {
      logger.info(`\n${symbols.directory} ${r.file}:${r.tldr.line}`);
      r.analysis.issues.forEach((issue: string) => logger.info(`  - ${issue}`));
      if (options.verbose) {
        r.analysis.suggestions.forEach((s: string) => logger.info(`    ${symbols.suggestion} ${s}`));
      }
    });
  }
} 