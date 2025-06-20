#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { minimatch } from 'minimatch';

// note ::: loads and merges ignore patterns from multiple sources
export class IgnorePatterns {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.filePatterns = [];
    this.markerFilters = new Set();
    this.contentPatterns = [];
    this.propertyFilters = [];
    this.actorFilters = new Set();
    
    this.loadIgnorePatterns();
  }
  
  loadIgnorePatterns() {
    // Load inherited ignore files
    const inheritedFiles = ['.gitignore', '.npmignore', '.dockerignore'];
    inheritedFiles.forEach(file => {
      const filePath = path.join(this.rootDir, file);
      if (fs.existsSync(filePath)) {
        const patterns = fs.readFileSync(filePath, 'utf8')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'));
        this.filePatterns.push(...patterns);
      }
    });
    
    // Load waymark config (JSONC format)
    const configPath = path.join(this.rootDir, '.waymark', 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        // note ::: strip comments for JSON parsing
        const configContent = fs.readFileSync(configPath, 'utf8');
        const jsonContent = configContent
          .split('\n')
          .map(line => {
            // Remove single-line comments
            const commentIndex = line.indexOf('//');
            if (commentIndex >= 0) {
              // Check if // is inside a string
              const beforeComment = line.substring(0, commentIndex);
              const quoteCount = (beforeComment.match(/"/g) || []).length;
              if (quoteCount % 2 === 0) {
                return line.substring(0, commentIndex);
              }
            }
            return line;
          })
          .join('\n')
          .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
          
        const config = JSON.parse(jsonContent);
        
        if (config.ignore?.patterns) {
          const patterns = config.ignore.patterns;
          
          if (patterns.files) {
            this.filePatterns.push(...patterns.files);
          }
          
          if (patterns.markers) {
            patterns.markers.forEach(m => this.markerFilters.add(m));
          }
          
          if (patterns.content) {
            this.contentPatterns.push(...patterns.content.map(p => new RegExp(p)));
          }
          
          if (patterns.properties) {
            this.propertyFilters.push(...patterns.properties);
          }
          
          if (patterns.actors) {
            patterns.actors.forEach(a => this.actorFilters.add(a));
          }
        }
      } catch (err) {
        console.error('Error parsing .waymark/config.json:', err.message);
      }
    }
    
    // Load .waymarkignore
    const waymarkIgnorePath = path.join(this.rootDir, '.waymarkignore');
    if (fs.existsSync(waymarkIgnorePath)) {
      const patterns = fs.readFileSync(waymarkIgnorePath, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      this.filePatterns.push(...patterns);
    }
  }
  
  shouldIgnoreFile(filePath) {
    const relativePath = path.relative(this.rootDir, filePath);
    return this.filePatterns.some(pattern => {
      return minimatch(relativePath, pattern) || minimatch(filePath, pattern);
    });
  }
  
  shouldIgnoreWaymark(marker, content, actor) {
    // Check marker filters
    if (this.markerFilters.has(marker)) {
      return true;
    }
    
    // Check content patterns
    if (this.contentPatterns.some(regex => regex.test(content))) {
      return true;
    }
    
    // Check actor filters
    if (actor && this.actorFilters.has(actor)) {
      return true;
    }
    
    // Check property filters
    for (const filter of this.propertyFilters) {
      if (content.includes(filter)) {
        return true;
      }
    }
    
    return false;
  }
}