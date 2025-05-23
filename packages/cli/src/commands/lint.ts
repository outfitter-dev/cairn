// :ga:tldr Enforce anchor policies across codebase
// :ga:cmd:lint Implementation of grepa lint command

import { 
  findFiles, 
  parseAnchors, 
  resolveConfig, 
  findConfigFile,
  lintAnchors,
  type Config,
  type Anchor
} from '@grepa/core';
import { readFileSync } from 'fs';
import { relative } from 'path';
import chalk from 'chalk';
import ora from 'ora';

interface LintOptions {
  forbid?: string[];
  maxAge?: number;
  ci?: boolean;
}

// :ga:tldr Execute lint command
// :ga:api,cmd:lint Main lint function
export async function lintCommand(
  options: LintOptions,
  command: any
): Promise<void> {
  const spinner = ora('Linting anchors...').start();
  
  try {
    // :ga:config Get anchor from global options
    const anchor = command.parent.opts().anchor || ':ga:';
    
    // :ga:config Load and merge configuration
    const configPath = findConfigFile(process.cwd());
    let config = resolveConfig(configPath || undefined, process.env.GREPA_ANCHOR);
    
    // :ga:config Override with CLI options
    if (options.forbid) {
      config = {
        ...config,
        lint: {
          ...config.lint,
          forbid: options.forbid
        }
      };
    }
    
    if (options.maxAge !== undefined) {
      config = {
        ...config,
        lint: {
          ...config.lint,
          maxAgeDays: options.maxAge
        }
      };
    }
    
    // :ga:algo Find all files
    const files = findFiles(
      process.cwd(),
      config.files?.include,
      config.files?.exclude
    );
    
    // :ga:algo Collect all anchors
    const allAnchors = [];
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf8');
        const anchors = parseAnchors(content, file, { anchor });
        allAnchors.push(...anchors);
      } catch (error) {
        // :ga:error Skip unreadable files
        continue;
      }
    }
    
    spinner.text = `Linting ${allAnchors.length} anchors...`;
    
    // :ga:algo Convert SimpleAnchor to Anchor for linting
    const fullAnchors: Anchor[] = allAnchors.map(anchor => ({
      raw: anchor.raw,
      tokens: [{ type: 'bare', value: anchor.token }],
      line: anchor.line,
      file: anchor.file,
      comment: anchor.comment
    }));
    
    // :ga:algo Run lint rules
    const result = lintAnchors(fullAnchors, config);
    
    spinner.stop();
    
    // :ga:output Display results
    if (result.passed) {
      console.log(chalk.green('✓') + ' All anchor checks passed');
    } else {
      console.log(chalk.red('✗') + ` Found ${result.violations.length} violations:\n`);
      
      // :ga:output Group violations by type
      const byType = new Map<string, typeof result.violations>();
      
      for (const violation of result.violations) {
        const list = byType.get(violation.type) || [];
        list.push(violation);
        byType.set(violation.type, list);
      }
      
      // :ga:output Display violations by type
      for (const [type, violations] of byType) {
        console.log(chalk.bold(`${type.toUpperCase()} (${violations.length}):`));
        
        for (const violation of violations) {
          const file = relative(process.cwd(), violation.anchor.file);
          console.log(
            `  ${chalk.magenta(file)}:${chalk.green(violation.anchor.line)} ` +
            `${chalk.gray(violation.anchor.raw)}`
          );
          console.log(`    ${chalk.yellow('→')} ${violation.message}\n`);
        }
      }
      
      // :ga:ci Exit with error in CI mode
      if (options.ci) {
        process.exit(1);
      }
    }
    
    // :ga:output Show configuration summary
    console.log('\n' + chalk.gray('Configuration:'));
    console.log(chalk.gray(`  Forbidden tags: ${config.lint?.forbid?.join(', ') || 'none'}`));
    console.log(chalk.gray(`  Max age: ${config.lint?.maxAgeDays || 'none'} days`));
    console.log(chalk.gray(`  Files scanned: ${files.length}`));
    
  } catch (error: any) {
    spinner.fail('Lint failed');
    throw error;
  }
}