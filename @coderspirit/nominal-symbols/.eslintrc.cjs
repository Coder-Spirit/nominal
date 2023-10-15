'use strict';

module.exports = {
	root: true,
	env: {
		es2020: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		tsConfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
	extends: [
		'@coderspirit',
	],
	ignorePatterns: [
		'.eslintrc.cjs',
		'dist/**/*',
		'node_modules/**/*',
	]
}
