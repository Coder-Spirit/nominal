import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import pluginTs from '@rollup/plugin-typescript'

const input = 'src/symbols.ts'

export default defineConfig([
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/symbols.cjs' },
			{ format: 'es', file: 'dist/symbols.mjs' },
		],
		plugins: [pluginTs()],
	},
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/symbols.d.cts' },
			{ format: 'es', file: 'dist/symbols.d.mts' },
		],
		plugins: [dts()],
	},
])
