import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			include: ['src/**/*.mjs', 'src/**/*.mts'],
			exclude: ['src/**/tests/**/*', 'coverage/**/*'],
			thresholds: {
				statements: 100.0,
				branches: 100.0,
				functions: 100.0,
				lines: 100.0,
			},
			reportsDirectory: 'coverage',
		},
		include: ['src/**/tests/**/*.test.mts'],
	},
})
