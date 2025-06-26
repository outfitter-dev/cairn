import { FileFinder } from './dist/lib/file-finder.js';

const finder = new FileFinder({ 
  rootDir: process.cwd()
});

console.log('Root dir:', process.cwd());
console.log('Finding files...');

const files = await finder.findFiles();
console.log('Found files:', files.length);
console.log('Files:', files.slice(0, 10));