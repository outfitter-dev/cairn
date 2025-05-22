// :ga:tldr Load and validate .grepa.yml configuration files
// :ga:config Configuration management

import { parse as parseYaml } from 'yaml';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import type { Config } from './types';

const CONFIG_FILENAME = '.grepa.yml';

// :ga:tldr Find config file by traversing up directory tree
// :ga:config Config file discovery
export function findConfigFile(startPath: string): string | null {
  let currentPath = startPath;
  
  // :ga:algo Traverse up until root
  while (currentPath !== dirname(currentPath)) {
    const configPath = join(currentPath, CONFIG_FILENAME);
    if (existsSync(configPath)) {
      return configPath;
    }
    currentPath = dirname(currentPath);
  }
  
  return null;
}

// :ga:tldr Load config from file with validation
// :ga:api,config Config loading
export function loadConfig(path: string): Config {
  try {
    const content = readFileSync(path, 'utf8');
    const config = parseYaml(content) as Config;
    
    // :ga:config Validate config structure
    validateConfig(config);
    
    return config;
  } catch (error) {
    // :ga:error Config load failure
    throw new Error(`Failed to load config from ${path}: ${error}`);
  }
}

// :ga:tldr Merge config with defaults
// :ga:config Config resolution
export function resolveConfig(
  configPath?: string,
  envAnchor?: string
): Config {
  const defaults: Config = {
    anchor: ':ga:',
    files: {
      include: ['**/*'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    },
    lint: {
      forbid: ['temp', 'debug'],
      maxAgeDays: 90,
      versionField: 'since'
    },
    dictionary: {
      tldr: 'Brief function/module summary',
      sec: 'Security-sensitive code',
      perf: 'Performance hotspot',
      temp: 'Temporary hack',
      debug: 'Debug-only code',
      placeholder: 'Stub for future work'
    }
  };
  
  // :ga:config Load file config if path provided
  const fileConfig = configPath ? loadConfig(configPath) : {};
  
  // :ga:config Apply environment override
  if (envAnchor) {
    fileConfig.anchor = envAnchor;
  }
  
  // :ga:config Deep merge with defaults
  return deepMerge(defaults, fileConfig);
}

// :ga:tldr Validate config object structure
// :ga:config,sec Input validation
function validateConfig(config: any): void {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Config must be an object');
  }
  
  if (config.anchor && typeof config.anchor !== 'string') {
    throw new Error('Config anchor must be a string');
  }
  
  if (config.files) {
    if (config.files.include && !Array.isArray(config.files.include)) {
      throw new Error('Config files.include must be an array');
    }
    if (config.files.exclude && !Array.isArray(config.files.exclude)) {
      throw new Error('Config files.exclude must be an array');
    }
  }
  
  if (config.lint) {
    if (config.lint.forbid && !Array.isArray(config.lint.forbid)) {
      throw new Error('Config lint.forbid must be an array');
    }
    if (config.lint.maxAgeDays && typeof config.lint.maxAgeDays !== 'number') {
      throw new Error('Config lint.maxAgeDays must be a number');
    }
  }
}

// :ga:tldr Deep merge two objects
// :ga:algo Recursive merge
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}