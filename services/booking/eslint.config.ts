import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import type { Linter } from 'eslint';

const config: Linter.Config = {
  ...js.configs.recommended,

  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },

  plugins: {
    prettier,
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

export default config;
