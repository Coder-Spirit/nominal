const currentDir = __dirname || '.'

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    tsConfigRootDir: __dirname,
    project: [
      `${currentDir}/tsconfig.json`,
      `${currentDir}/scripts/tsconfig.json`,
      `${currentDir}/src/__tests__/tsconfig.json`,
    ],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:node/recommended-module',
    'prettier',
  ],
  rules: {
    'node/no-missing-import': [
      'error',
      {
        resolvePaths: [
          `${currentDir}/src`,
          `${currentDir}/node_modules`,
          `${currentDir}/node_modules/@types`,
          `${currentDir}/node_modules/@types/node`,
        ],
        tryExtensions: ['.ts', '.d.ts'],
      },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    'sort-imports': 'error',
  },
  ignorePatterns: ['*.js', 'tsconfig.json', 'dist/**/*', 'deno/**/*'],
  overrides: [
    {
      files: ['**/__tests__/**/*.test.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      env: {
        jest: true,
        'jest/globals': true,
      },
      rules: {
        'jest/no-disabled-tests': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/consistent-test-it': 'error',
        'jest/valid-expect': ['error', { alwaysAwait: true }],
      },
    },
  ],
}
