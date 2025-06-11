// :M: tldr Custom ESLint rules plugin
module.exports = {
  meta: {
    name: '@cairn/eslint-plugin',
    version: '0.0.0'
  },
  rules: {
    'enforce-result-pattern': require('./enforce-result-pattern'),
  },
};