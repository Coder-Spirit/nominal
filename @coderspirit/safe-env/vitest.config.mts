import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			include: ['src/**/*.mjs', 'src/**/*.mts'],
			exclude: ['src/**/tests/**/*', 'coverage/**/*'],
			thresholds: {
				statements: 57.0,
				branches: 73.0,
				functions: 83.0,
				lines: 57.0,
			},
			reportsDirectory: 'coverage',
		},
		include: ['src/**/tests/**/*.test.mts'],
	},
})
