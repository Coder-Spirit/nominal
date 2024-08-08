#!/usr/bin/env -S deno run --no-config --allow-env --allow-read --allow-sys --allow-run
import process from 'node:process'
import { $ } from 'npm:zx@8.1.4'

const JSON_EXT = 'json|jsonc'
const JS_EXT = 'js|mjs|cjs|jsx'
const TS_EXT = 'ts|mts|cts|tsx|d.ts'
const MARKUP_EXT = 'md|mdx|astro|vue|svelte'
const BIOME_EXTENSIONS = `(${JSON_EXT}|${JS_EXT}|${TS_EXT}|${MARKUP_EXT})`

const extsRegex = new RegExp(BIOME_EXTENSIONS)

const runGitDiffStaged = async (): Promise<string[]> => {
	return (
		await $`git diff --staged --relative --name-only --diff-filter=ACMR`
	).lines()
}

export const main = async () => {
	const stagedFiles = (await runGitDiffStaged()).filter(file =>
		extsRegex.test(file),
	)

	if (stagedFiles.length === 0) {
		return
	}

	const processOutput =
		await $`pnpm biome check --write --no-errors-on-unmatched --files-ignore-unknown=true ${stagedFiles}`.stdio(
			'inherit',
			'inherit',
			'inherit',
		)

	if (processOutput.exitCode !== null && processOutput.exitCode !== 0) {
		process.exit(processOutput.exitCode)
	}

	await $`git add ${stagedFiles}`
}

try {
	await main()
} catch (err) {
	console.error(err)
	process.exit(1)
}
