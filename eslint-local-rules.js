// :A: tldr ESLint local rules configuration
try {
  module.exports = require('./src/eslint-rules/index.js');
} catch (error) {
  throw new Error(
    `Failed to load local ESLint rules from './src/eslint-rules/index.js'. ` +
    `Please ensure the file exists and all its dependencies use '.js' extensions. ` +
    `Error: ${error.message}`
  );
}