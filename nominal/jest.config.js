// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/configuration

module.exports = {
  automock: false,
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: [
    'node_modules',
    'dist'
  ]
}
