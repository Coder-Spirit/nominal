#!/usr/bin/env -S deno run --no-config --allow-env --allow-read --allow-sys --allow-run

import { readFile } from 'node:fs/promises'
import process from 'node:process'

import { $ } from 'npm:zx@8.1.4'

type PackageJson = {
	name: string
	version: string
}

const isPackageJson = (value: unknown): value is PackageJson => {
	if (typeof value !== 'object' || value === null) {
		throw new Error('Invalid package.json: not an object')
	}

	if (!('name' in value)) {
		throw new Error('Invalid package.json: missing "name" field')
	}
	if (typeof value['name'] !== 'string') {
		throw new Error('Invalid package.json: "name" field is not a string')
	}

	if (!('version' in value)) {
		throw new Error('Invalid package.json: missing "version" field')
	}
	if (typeof value['version'] !== 'string') {
		throw new Error('Invalid package.json: "version" field is not a string')
	}

	return true
}

const getPackageJson = async (): Promise<PackageJson> => {
	const packageJsonStr = await readFile('package.json', 'utf-8')
	const packageJson = JSON.parse(packageJsonStr) as unknown

	if (!isPackageJson(packageJson)) {
		throw new Error('Invalid package.json') // Never thrown
	}

	return packageJson
}

const getCurrentPublishedVersion = async (pkgName: string): Promise<string> => {
	return (await $`npm view --workspaces false --json ${pkgName} version`)
		.text()
		.trim()
		.replaceAll('"', '')
}

const main = async (): Promise<void> => {
	const packageJson = await getPackageJson()
	const publishedVersion = await getCurrentPublishedVersion(packageJson.name)

	// TODO: improve checks, to ensure that versions grow monotonically
	if (packageJson.version === publishedVersion) {
		return // Nothing to publish
	}

	await $`pnpm publish --provenance --no-git-checks --access public`.stdio(
		'inherit',
		'inherit',
		'inherit',
	)
}

try {
	await main()
} catch (err) {
	// biome-ignore lint/suspicious/noConsole: Internal usage
	console.error(err)
	process.exit(1)
}
