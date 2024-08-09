import assert from 'node:assert/strict'

import type { FastBrand } from '@coderspirit/nominal'
import { Literal } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { describe, expect, it } from 'vitest'

import { brandedUnion } from '../union.mts'

describe('brandedUnion', () => {
	it('lets typebox to annotate unions with a brand', () => {
		const unionSchema = brandedUnion('UUU', [Literal('on'), Literal('off')])
		const unionValidator = TypeCompiler.Compile(unionSchema)

		const valueToCheck = 'on'
		if (!unionValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		// Checking "outer" brand
		const unionSink: FastBrand<'on' | 'off', 'UUU'> = valueToCheck
		expect(unionSink).toBe('on')

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedUnionSink: FastBrand<'on' | 'off', 'UUU'> = 'on'
		expect(corruptedUnionSink).toBe('on')
	})
})
