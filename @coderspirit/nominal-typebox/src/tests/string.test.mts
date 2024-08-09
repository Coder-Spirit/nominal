import assert from 'node:assert/strict'

import type { FastBrand } from '@coderspirit/nominal'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { describe, expect, it } from 'vitest'

import { brandedString } from '../main.mjs'

describe('brandedString', () => {
	it('lets typebox to annotate a string with a brand', () => {
		const stringSchema = brandedString<'SSS'>()
		const stringValidator = TypeCompiler.Compile(stringSchema)

		const valueToCheck = 'hello'
		if (!stringValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		const stringSink: FastBrand<string, 'SSS'> = valueToCheck
		expect(stringSink).toBe('hello')

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedStringSink: FastBrand<string, 'SSS'> = 'hello'
		expect(corruptedStringSink).toBe('hello')
	})
})
