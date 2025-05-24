#!/usr/bin/env python3

# :ga:meta grepa-list script - discovers all grep-anchors in your codebase

import json
import subprocess
import sys
import re
import argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Any

# Configuration
DEFAULT_ANCHOR = ':ga:'
OUTPUT_FILE = Path.cwd() / '.grepa' / 'grepa-list.json'


def is_in_code_block(filename: str, line_num: int, anchor_match: str) -> bool:
    """Check if a match is inside a code block or code fence."""
    # Only check markdown files
    if not filename.endswith(('.md', '.markdown', '.mdx')):
        return False
    
    try:
        with open(filename, 'r') as f:
            lines = f.readlines()
        
        # Check if we're inside a code fence
        in_code_fence = False
        for i, line in enumerate(lines[:line_num], 1):
            if line.strip().startswith('```'):
                in_code_fence = not in_code_fence
        
        # If we're in a code fence, it's an example
        if in_code_fence:
            return True
        
        # Check if the line itself is indented (code block)
        if line_num <= len(lines):
            line = lines[line_num - 1]
            # Check for 4-space indentation (markdown code block)
            if line.startswith('    ') and anchor_match in line:
                return True
        
        return False
    except:
        # If we can't read the file, assume it's not in a code block
        return False


def find_grep_anchors(anchor: str = DEFAULT_ANCHOR, ignore_md: bool = False, ignore_examples: bool = False) -> Dict[str, Any]:
    """Find all grep-anchors in the codebase using ripgrep."""
    try:
        # Run ripgrep to find all anchors
        # -n: line numbers, -o: only matching, --no-heading: compact format
        cmd = ['rg', '-n', '-o', f'{anchor}[^\\s]*', '--no-heading']
        
        # Add glob patterns to ignore markdown files if requested
        if ignore_md:
            cmd.extend(['-g', '!*.md', '-g', '!*.markdown', '-g', '!*.mdx'])
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 1:
            # No matches found
            return {'tags': {}, 'files': {}, 'totalAnchors': 0, 'anchor': anchor}
        elif result.returncode != 0:
            # Other error
            raise subprocess.CalledProcessError(result.returncode, cmd, result.stderr)
        
        output = result.stdout.strip()
        if not output:
            return {'tags': {}, 'files': {}, 'totalAnchors': 0, 'anchor': anchor}
        
        lines = output.split('\n')
        tags = defaultdict(lambda: {
            'count': 0,
            'files': defaultdict(list),
            'firstSeen': None
        })
        files = defaultdict(lambda: {
            'totalAnchors': 0,
            'tags': defaultdict(int),
            'lines': []
        })
        
        # Compile regex for tag extraction
        tag_pattern = re.compile(f'{re.escape(anchor)}([^\\s,\\]\\}}]+)')
        
        for line in lines:
            # Parse format: filename:line:match
            match = re.match(r'^(.+?):(\d+):(.+)$', line)
            if not match:
                continue
            
            filename, line_num, full_match = match.groups()
            line_num = int(line_num)
            
            # Skip if we're ignoring examples and this is in a code block
            if ignore_examples and is_in_code_block(filename, line_num, full_match):
                continue
            
            # Extract the tag from the full match
            tag_match = tag_pattern.match(full_match)
            if not tag_match:
                continue
            
            tag = tag_match.group(1)
            
            # Update tag statistics
            tags[tag]['count'] += 1
            tags[tag]['files'][filename].append(line_num)
            
            if tags[tag]['firstSeen'] is None:
                tags[tag]['firstSeen'] = {'file': filename, 'line': line_num}
            
            # Update file statistics
            files[filename]['totalAnchors'] += 1
            files[filename]['tags'][tag] += 1
            files[filename]['lines'].append(line_num)
        
        # Convert defaultdicts to regular dicts and sort lines
        tags_dict = {}
        for tag, data in tags.items():
            tags_dict[tag] = {
                'count': data['count'],
                'files': {f: sorted(lines) for f, lines in data['files'].items()},
                'firstSeen': data['firstSeen']
            }
        
        files_dict = {}
        for filename, data in files.items():
            files_dict[filename] = {
                'totalAnchors': data['totalAnchors'],
                'tags': dict(data['tags']),
                'lines': sorted(data['lines'])
            }
        
        return {
            'tags': tags_dict,
            'files': files_dict,
            'totalAnchors': len(lines),
            'anchor': anchor
        }
        
    except FileNotFoundError:
        print('❌ Error: ripgrep (rg) is not installed or not in PATH')
        print('   Install it from: https://github.com/BurntSushi/ripgrep')
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f'❌ Error running ripgrep: {e.stderr}')
        sys.exit(1)


def generate_report(data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a comprehensive report from the anchor data."""
    tags = data['tags']
    files = data['files']
    total_anchors = data['totalAnchors']
    anchor = data['anchor']
    
    # Sort tags by count (descending)
    sorted_tags = sorted(tags.items(), key=lambda x: x[1]['count'], reverse=True)
    
    # Sort files by anchor count (descending)
    sorted_files = sorted(files.items(), key=lambda x: x[1]['totalAnchors'], reverse=True)
    
    report = {
        '_comment': ':ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY',
        'generated': datetime.now().isoformat(),
        'anchor': anchor,
        'summary': {
            'totalAnchors': total_anchors,
            'uniqueTags': len(tags),
            'filesWithAnchors': len(files)
        },
        'tags': dict(sorted_tags),
        'files': dict(sorted_files),
        'topTags': [
            {
                'tag': tag,
                'count': data['count'],
                'fileCount': len(data['files'])
            }
            for tag, data in sorted_tags[:10]
        ],
        'topFiles': [
            {
                'file': filename,
                'anchors': data['totalAnchors'],
                'uniqueTags': len(data['tags'])
            }
            for filename, data in sorted_files[:10]
        ]
    }
    
    return report


def main():
    """Main execution function."""
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Discover all grep-anchors in your codebase')
    parser.add_argument('anchor', nargs='?', default=DEFAULT_ANCHOR, 
                        help=f'Custom anchor pattern (default: {DEFAULT_ANCHOR})')
    parser.add_argument('--ignore-md', action='store_true',
                        help='Ignore markdown files (*.md, *.markdown, *.mdx)')
    parser.add_argument('--ignore-examples', action='store_true',
                        help='Ignore grep-anchors inside code blocks and code fences')
    
    args = parser.parse_args()
    
    print('🔍 Searching for grep-anchors...')
    
    data = find_grep_anchors(args.anchor, args.ignore_md, args.ignore_examples)
    report = generate_report(data)
    
    # Ensure .grepa directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Write JSONC file with pretty printing
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(report, f, indent=2)
    
    # Print summary
    print(f'\n✅ Grep-anchor inventory generated!')
    print(f'📍 Anchor pattern: {anchor}')
    print(f'📊 Found {report["summary"]["totalAnchors"]} anchors across {report["summary"]["filesWithAnchors"]} files')
    print(f'🏷️  Discovered {report["summary"]["uniqueTags"]} unique tags')
    print(f'📄 Report saved to: {OUTPUT_FILE}')
    
    if report['topTags']:
        print('\n🔝 Top 5 tags:')
        for item in report['topTags'][:5]:
            print(f'   {item["tag"]}: {item["count"]} uses in {item["fileCount"]} file(s)')


if __name__ == '__main__':
    main() 