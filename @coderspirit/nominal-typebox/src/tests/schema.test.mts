import assert from 'node:assert/strict'

import type { FastBrand } from '@coderspirit/nominal'
import { Record as TBRecord } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { describe, expect, it } from 'vitest'

import { brandedInteger, brandedSchema, brandedString } from '../main.mts'

describe('brandedSchema', () => {
	it('lets typebox to annotate records with a brand', () => {
		const personNameSchema = brandedString<'PersonName'>()
		const personAgeSchema = brandedInteger<'PersonAge'>()
		const recordSchema = brandedSchema(
			'PeopleAges',
			TBRecord(personNameSchema, personAgeSchema),
		)
		const recordValidator = TypeCompiler.Compile(recordSchema)

		const valueToCheck = { Alice: 20, Bob: 30 }
		if (!recordValidator.Check(valueToCheck)) {
			throw new assert.AssertionError({ message: 'validation should pass' })
		}

		// Checking "outer" brand
		const recordSink: FastBrand<
			Record<string, number>,
			'PeopleAges'
		> = valueToCheck
		expect(recordSink).toEqual({ Alice: 20, Bob: 30 })

		// IMPORTANT!: Notice that `brandedSchema` is unable to preserve the brands
		//             of keys & values in the record. This limitation is due to the
		//             fact that `brandedSchema` is "too generic".

		// We perform the following useless assignments to show the contrast between
		// tagged values and untagged values.

		// @ts-expect-error
		const corruptedRecordSink: FastBrand<
			Record<string, number>,
			'PeopleAges'
		> = { Alice: 20, Bob: 30 }
		expect(corruptedRecordSink).toEqual({ Alice: 20, Bob: 30 })
	})
})
