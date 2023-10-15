import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import pluginTs from '@rollup/plugin-typescript'

const input = 'src/index.ts'

export default defineConfig([
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/nominal.cjs' },
			{ format: 'es', file: 'dist/nominal.mjs' },
		],
		plugins: [pluginTs()],
	},
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/nominal.d.cts' },
			{ format: 'es', file: 'dist/nominal.d.mts' },
		],
		plugins: [dts()],
	},
])
