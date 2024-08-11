import assert from 'node:assert/strict'

import type { FastBrand } from '@coderspirit/nominal'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { describe, expect, it } from 'vitest'

import { brandedRegExp } from '../main.mjs'

describe('brandedRegExp', () => {
	it('lets typebox to annotate a regexp with a brand', () => {
		const regexpSchema = brandedRegExp<'UUID'>(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
		)
		const regexpValidator = TypeCompiler.Compile(regexpSchema)

		const valueToCheck = '09e77e4a-175d-46a1-b6c6-ff960c30193b'
		if (!regexpValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		const regexpSink: FastBrand<string, 'UUID'> = valueToCheck
		expect(regexpSink).toBe('09e77e4a-175d-46a1-b6c6-ff960c30193b')

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedRegexpSink: FastBrand<string, 'UUID'> =
			'09e77e4a-175d-46a1-b6c6-ff960c30193b'
		expect(corruptedRegexpSink).toBe('09e77e4a-175d-46a1-b6c6-ff960c30193b')
	})
})
