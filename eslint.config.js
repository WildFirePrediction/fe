const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');

const { fixupConfigRules } = require('@eslint/compat');

const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
      ),
    ),

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {},
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    extends: compat.extends('plugin:@typescript-eslint/recommended'),

    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-native/no-raw-text': 'off',
      'react-native/no-unused-styles': 'off',
      'react-native/sort-styles': 'off',
      'react/display-name': 'off',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
  globalIgnores(['**/node_modules/', '**/dist/', '**/build/', '**/.expo/', '**/.expo-shared/']),
]);
