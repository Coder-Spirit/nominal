import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getTsconfig } from 'get-tsconfig'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const projectDir = dirname(fileURLToPath(import.meta.url))
const tsconfig = getTsconfig(projectDir)
const target = tsconfig?.config.compilerOptions?.target ?? 'es2022'

const input = 'src/main.mts'
const external = ['@coderspirit/nominal-inputs']

export default defineConfig([
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/main.cjs', sourcemap: true },
			{ format: 'esm', file: 'dist/main.mjs', sourcemap: true },
		],
		plugins: [
			esbuild({
				target: ['node20', 'node22', target],
				loaders: { '.mts': 'ts' },
				minify: true,
			}),
		],
		external,
	},
	{
		input,
		output: [
			{ format: 'cjs', file: 'dist/main.d.cts' },
			{ format: 'esm', file: 'dist/main.d.mts' },
		],
		plugins: [dts()],
		external,
	},
])
