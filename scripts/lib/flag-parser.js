// tldr ::: DRY flag parsing utility for consistent CLI across waymark scripts

/**
 * Parse command line arguments with support for:
 * - Boolean flags: --verbose, --help
 * - Space-separated arrays: --filter official deprecated !unknown
 * - Single values: --tag-prefix wm:custom
 * - Negation: !item excludes item from array
 */
export class FlagParser {
  constructor(args = process.argv.slice(2)) {
    this.args = args;
    this.parsed = {};
    this.parse();
  }

  parse() {
    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];
      
      if (!arg.startsWith('--')) continue;
      
      const flagName = arg.slice(2);
      
      // Check if next args are values (don't start with --)
      const values = [];
      let j = i + 1;
      while (j < this.args.length && !this.args[j].startsWith('--')) {
        values.push(this.args[j]);
        j++;
      }
      
      if (values.length === 0) {
        // Boolean flag
        this.parsed[flagName] = true;
      } else if (values.length === 1) {
        // Single value
        this.parsed[flagName] = values[0];
      } else {
        // Array with negation support
        const included = values.filter(v => !v.startsWith('!'));
        const excluded = values.filter(v => v.startsWith('!')).map(v => v.slice(1));
        
        this.parsed[flagName] = {
          include: included,
          exclude: excluded,
          all: values
        };
      }
      
      // Skip processed values
      i = j - 1;
    }
  }

  // Boolean flag helpers
  has(flag) {
    return this.parsed[flag] === true;
  }

  // Single value helpers  
  get(flag, defaultValue = null) {
    const value = this.parsed[flag];
    return (typeof value === 'string') ? value : defaultValue;
  }

  // Array helpers with negation
  getArray(flag) {
    const value = this.parsed[flag];
    return value && value.include ? value.include : [];
  }

  getExcluded(flag) {
    const value = this.parsed[flag];
    return value && value.exclude ? value.exclude : [];
  }

  // Filter function for arrays
  filter(items, flag) {
    const included = this.getArray(flag);
    const excluded = this.getExcluded(flag);
    
    if (included.length === 0 && excluded.length === 0) {
      return items; // No filtering
    }
    
    return items.filter(item => {
      // If include list exists, item must be in it
      if (included.length > 0 && !included.includes(item)) {
        return false;
      }
      
      // Item must not be in exclude list
      if (excluded.includes(item)) {
        return false;
      }
      
      return true;
    });
  }

  // Debug helper
  dump() {
    console.log('Parsed flags:', JSON.stringify(this.parsed, null, 2));
  }
}

/**
 * Standard flag configurations for consistency
 */
export const STANDARD_FLAGS = {
  // Universal flags
  help: { type: 'boolean', aliases: ['h'], description: 'Show help message' },
  verbose: { type: 'boolean', aliases: ['v'], description: 'Show detailed output' },
  quiet: { type: 'boolean', aliases: ['q'], description: 'Show minimal output' },
  json: { type: 'boolean', description: 'Output as JSON' },
  'dry-run': { type: 'boolean', aliases: ['n'], description: 'Preview mode (no changes)' },
  
  // Mode flags
  test: { type: 'boolean', description: 'Test mode (scripts/tests/ only)' },
  legacy: { type: 'boolean', description: 'Show violations only' },
  strict: { type: 'boolean', description: 'Enable strict checking' },
  
  // Filtering and targeting
  filter: { type: 'array', description: 'Filter content types' },
  pattern: { type: 'array', description: 'File glob patterns' },
  file: { type: 'array', description: 'Specific file paths' },
  
  // Input/output
  input: { type: 'string', description: 'Direct content input' },
  stdin: { type: 'boolean', description: 'Read from stdin' },
  'tag-prefix': { type: 'string', description: 'Custom tag prefix' }
};

export default FlagParser;