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

// :ga:tldr Load config from file path or create default
// :ga:api,config Config loading
export async function loadConfig(startPath: string): Promise<any> {
  const { promises: fs } = await import('fs');
  const path = await import('path');
  
  // Default configuration
  const defaultConfig = {
    anchor: process.env.GREPA_ANCHOR || ':ga:',
    defaultTokens: ['tldr', 'todo', 'fix', 'hack', 'temp'],
    forbiddenTokens: [],
    tokenDictionary: {
      tldr: 'Brief function/module summary',
      todo: 'Task to complete',
      fix: 'Bug fix',
      hack: 'Temporary workaround',
      temp: 'Temporary code',
      sec: 'Security-critical code',
      perf: 'Performance-critical code',
      api: 'Public API',
      config: 'Configuration code',
      error: 'Error handling',
    },
    ignorePatterns: ['node_modules/**', 'dist/**', '.git/**'],
    scanExtensions: ['.js', '.ts', '.jsx', '.tsx', '.py', '.rb', '.go', '.java'],
    scanDirectories: ['src', 'lib', 'app'],
    maxAge: {},
  };
  
  let currentPath = startPath;
  
  // Traverse up directory tree
  while (currentPath !== path.dirname(currentPath)) {
    const configPath = path.join(currentPath, CONFIG_FILENAME);
    
    try {
      await fs.access(configPath);
      const content = await fs.readFile(configPath, 'utf-8');
      const config = parseYaml(content);
      validateConfig(config);
      return mergeConfigs(defaultConfig, config);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        if (error.message?.includes('Failed to parse')) {
          throw new Error(`Failed to parse config at ${configPath}: ${error.message}`);
        } else if (error.code === 'EACCES') {
          throw new Error(`Failed to read config at ${configPath}: Permission denied`);
        }
        throw error;
      }
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  // Check root directory
  const rootConfigPath = path.join('/', CONFIG_FILENAME);
  try {
    await fs.access(rootConfigPath);
    const content = await fs.readFile(rootConfigPath, 'utf-8');
    const config = parseYaml(content);
    validateConfig(config);
    return mergeConfigs(defaultConfig, config);
  } catch {
    // Return defaults if no config found
    return defaultConfig;
  }
}

// Keep sync version for backward compatibility
export function loadConfigSync(path: string): Config {
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
  const fileConfig = configPath ? loadConfigSync(configPath) : {};
  
  // :ga:config Apply environment override
  if (envAnchor) {
    (fileConfig as any).anchor = envAnchor;
  }
  
  // :ga:config Deep merge with defaults
  return deepMerge(defaults, fileConfig);
}

// :ga:tldr Validate config object structure
// :ga:config,sec Input validation
export function validateConfig(config: any): void {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Config must be an object');
  }
  
  // Validate anchor format
  if (config.anchor !== undefined) {
    if (typeof config.anchor !== 'string') {
      throw new Error('Config anchor must be a string');
    }
    if (!config.anchor.startsWith(':') || !config.anchor.endsWith(':')) {
      throw new Error('Invalid anchor format');
    }
  }
  
  // Validate defaultTokens
  if (config.defaultTokens !== undefined && !Array.isArray(config.defaultTokens)) {
    throw new Error('defaultTokens must be an array');
  }
  
  // Validate tokenDictionary
  if (config.tokenDictionary !== undefined) {
    if (typeof config.tokenDictionary !== 'object' || config.tokenDictionary === null || Array.isArray(config.tokenDictionary)) {
      throw new Error('tokenDictionary must be an object');
    }
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
export function mergeConfigs(base: any, custom: any): any {
  if (!base) return custom || {};
  if (!custom) return base || {};
  
  const result = { ...base };
  
  for (const key in custom) {
    if (custom[key] && typeof custom[key] === 'object' && !Array.isArray(custom[key])) {
      result[key] = mergeConfigs(result[key] || {}, custom[key]);
    } else {
      result[key] = custom[key];
    }
  }
  
  return result;
}

// Keep internal deepMerge for backward compatibility
function deepMerge(target: any, source: any): any {
  return mergeConfigs(target, source);
}