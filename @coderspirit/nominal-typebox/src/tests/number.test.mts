import assert from 'node:assert/strict'

import type { FastBrand } from '@coderspirit/nominal'
import type { TaggedInteger } from '@coderspirit/nominal-inputs'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { describe, expect, it } from 'vitest'

import { brandedInteger, brandedNumber } from '../main.mts'

describe('brandedInteger', () => {
	it('lets typebox to annotate a number as an integer', () => {
		const integerSchema = brandedInteger<'III'>()
		const integerValidator = TypeCompiler.Compile(integerSchema)

		const valueToCheck = 10
		if (!integerValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		const integerSink: TaggedInteger = valueToCheck
		expect(integerSink).toBe(10)
		const brandedSink: FastBrand<number, 'III'> = valueToCheck
		expect(brandedSink).toBe(10)

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedIntegerSink: TaggedInteger = 10
		expect(corruptedIntegerSink).toBe(10)
		// @ts-expect-error
		const corruptedBrandedSink: FastBrand<number, 'III'> = 10
		expect(corruptedBrandedSink).toBe(10)
	})
})

describe('brandedNumber', () => {
	it('lets typebox to annotate numbers with a brand', () => {
		const numberSchema = brandedNumber<'NNN'>()
		const numberValidator = TypeCompiler.Compile(numberSchema)

		const valueToCheck = 10.5
		if (!numberValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		const numberSink: FastBrand<number, 'NNN'> = valueToCheck
		expect(numberSink).toBe(10.5)

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedNumberSink: FastBrand<number, 'NNN'> = 10.5
		expect(corruptedNumberSink).toBe(10.5)
	})
})
