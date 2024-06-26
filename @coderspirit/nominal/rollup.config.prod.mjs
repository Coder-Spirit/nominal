import pluginTs from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

const input = 'src/index.ts'

export default defineConfig([
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/nominal.cjs' },
			{ format: 'esm', file: 'dist/nominal.mjs' },
		],
		plugins: [pluginTs()],
	},
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/nominal.d.cts' },
			{ format: 'esm', file: 'dist/nominal.d.mts' },
		],
		plugins: [dts()],
	},
])
