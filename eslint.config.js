import loguxTsConfig from '@logux/eslint-config/ts'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/errors.ts'] },
  ...loguxTsConfig,
  {
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'n/no-unsupported-features/node-builtins': 'off'
    }
  }
]
