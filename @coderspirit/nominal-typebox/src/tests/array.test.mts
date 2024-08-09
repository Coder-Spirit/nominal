import assert from 'node:assert/strict'

import type { FastBrand } from '@coderspirit/nominal'
import type { TaggedInteger } from '@coderspirit/nominal-inputs'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { describe, expect, it } from 'vitest'

import { brandedArray, brandedInteger } from '../main.mts'

describe('brandedArray', () => {
	it('lets typebox to annotate arrays with a brand', () => {
		const arraySchema = brandedArray('AAA', brandedInteger<'III'>())
		const arrayValidator = TypeCompiler.Compile(arraySchema)

		const valueToCheck = [10, 20, 30]
		if (!arrayValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		// Checking "outer" brand
		const arraySink: FastBrand<number[], 'AAA'> = valueToCheck
		expect(arraySink).toEqual([10, 20, 30])

		// Checking "inner" properties
		const integerListSink: TaggedInteger[] = valueToCheck
		expect(integerListSink).toEqual([10, 20, 30])

		// Checking "inner" brand
		const brandedListSink: FastBrand<number, 'III'>[] = valueToCheck
		expect(brandedListSink).toEqual([10, 20, 30])

		// Checking individual elements' properties
		// biome-ignore lint/style/noNonNullAssertion: We know the element is present
		const integerSink: TaggedInteger = valueToCheck[0]!
		expect(integerSink).toBe(10)

		// Checking individual elements' brand
		// biome-ignore lint/style/noNonNullAssertion: We know the element is present
		const brandedSink: FastBrand<number, 'III'> = valueToCheck[0]!
		expect(brandedSink).toBe(10)

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedArraySink: FastBrand<number[], 'AAA'> = [10, 20, 30]
		expect(corruptedArraySink).toEqual([10, 20, 30])
	})
})
