module.exports = {
  env: {
    node: true,
    es2021: true,
    mocha: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off', // Allow console statements for debugging
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-undef': 'error',
  },
};
