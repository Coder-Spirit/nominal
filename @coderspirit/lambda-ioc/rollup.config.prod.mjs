import pluginTs from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

const input = 'src/main.ts'

export default defineConfig([
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/main.cjs' },
			{ format: 'esm', file: 'dist/main.mjs' },
		],
		plugins: [pluginTs()],
	},
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/main.d.cts' },
			{ format: 'esm', file: 'dist/main.d.mts' },
		],
		plugins: [dts()],
	},
])
