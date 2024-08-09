import assert from 'node:assert/strict'

import type { FastBrand } from '@coderspirit/nominal'
import type { TaggedInteger } from '@coderspirit/nominal-inputs'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { describe, expect, it } from 'vitest'

import { brandedInteger, brandedObject, brandedString } from '../main.mts'

describe('brandedObject', () => {
	it('lets typebox to annotate objects with a brand', () => {
		const objectSchema = brandedObject('OOO', {
			foo: brandedInteger<'III'>(),
			bar: brandedString<'SSS'>(),
		})
		const objectValidator = TypeCompiler.Compile(objectSchema)

		const valueToCheck = { foo: 10, bar: 'hello' }
		if (!objectValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		// Checking "outer" brand
		const objectSink: FastBrand<{ foo: number; bar: string }, 'OOO'> =
			valueToCheck
		expect(objectSink).toEqual({ foo: 10, bar: 'hello' })

		// Checking "inner" properties
		const integerSink: TaggedInteger = valueToCheck.foo
		expect(integerSink).toBe(10)
		const stringSink: FastBrand<string, 'SSS'> = valueToCheck.bar
		expect(stringSink).toBe('hello')

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedObjectSink: FastBrand<{ foo: number; bar: string }, 'OOO'> =
			{ foo: 10, bar: 'hello' }
		expect(corruptedObjectSink).toEqual({ foo: 10, bar: 'hello' })
	})
})
