const js = require('@eslint/js');
const prettier = require('eslint-plugin-prettier');

module.exports = {
  ...js.configs.recommended,
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: {
    prettier: prettier,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
        printWidth: 80,
        tabWidth: 2,
        endOfLine: 'auto',
      },
    ],
    'no-console': 'warn',
  },
};
