import type { TaggedInteger } from '@coderspirit/nominal-inputs'
import { assert, describe, expect, it } from 'vitest'

import { getSafeEnv } from '../main.mts'

describe('getSafeEnv (regressions)', () => {
	it('shoud set correct type for .get with enum variables', () => {
		const env = { ENUM_A: 'bar', ENUM_B: 'foo' }

		const envWrapper = getSafeEnv(env, {
			ENUM_A: { enum: ['foo', 'bar'], default: 'foo' },
			ENUM_B: { enum: ['foo', 'bar'] },
		})

		// Type checks for enum with default value
		const valueA = envWrapper.get('ENUM_A')

		type Does_AValue_extend_FooBar = typeof valueA extends 'foo' | 'bar'
			? true
			: false
		const a_extends_FooBar: Does_AValue_extend_FooBar = true
		expect(a_extends_FooBar).toBe(true)

		type Does_FooBar_extend_AValue = 'foo' | 'bar' extends typeof valueA
			? true
			: false
		const fooBar_extends_a: Does_FooBar_extend_AValue = true
		expect(fooBar_extends_a).toBe(true)

		// Type checks for enum without default value
		const valueB = envWrapper.get('ENUM_B')

		type Does_BValue_extend_FooBar = typeof valueB extends 'foo' | 'bar'
			? true
			: false
		const b_extends_FooBar: Does_BValue_extend_FooBar = true
		expect(b_extends_FooBar).toBe(true)

		type Does_FooBar_extend_BValue = 'foo' | 'bar' extends typeof valueB
			? true
			: false
		const fooBar_extends_b: Does_FooBar_extend_BValue = true
		expect(fooBar_extends_b).toBe(true)
	})

	it('should not apply "const" to default value types', () => {
		const env = {}

		const envWrapper = getSafeEnv(env, {
			FOO: { type: 'int32', default: 42 },
		})

		const foo = envWrapper.get('FOO')
		type Does_TI_extend_Foo = TaggedInteger extends typeof foo ? true : false
		const number_extends_foo: Does_TI_extend_Foo = true
		expect(number_extends_foo).toBe(true)
	})

	it('should assign "string" type to "string" values', () => {
		const env = { FOO: 'hello' }

		const envWrapper = getSafeEnv(env, {
			FOO: { type: 'string' },
			BAR: { type: 'string', default: 'hello' },
		})

		const foo = envWrapper.get('FOO')
		type Does_String_extend_Foo = string extends typeof foo ? true : false
		const string_extends_foo: Does_String_extend_Foo = true
		expect(string_extends_foo).toBe(true)

		const bar = envWrapper.get('BAR')
		type Does_String_extend_Bar = string extends typeof bar ? true : false
		const string_extends_bar: Does_String_extend_Bar = true
		expect(string_extends_bar).toBe(true)
	})

	it('should aggregate all detected errors', () => {
		const env = { FOO: 'foo', XXX: 'hello' }

		const schema = {
			FOO: { type: 'string' },
			BAR: { type: 'string' },
			XXX: { type: 'uint8' },
		} as const

		expect(() => getSafeEnv(env, schema)).toThrowError(
			new AggregateError(
				[],
				'Multiple errors occurred while processing environment variables',
			),
		)

		try {
			getSafeEnv(env, schema)
			expect(true).toBe(false) // We shoudln't reach this point
		} catch (err) {
			expect(err).toBeInstanceOf(AggregateError)
			assert(err instanceof AggregateError)
			assert(err.errors.length === 2)

			expect(() => {
				throw err.errors[0]
			}).toThrowError('Missing required environment variable: "BAR"')
			expect(() => {
				throw err.errors[1]
			}).toThrowError('Environment variable "XXX" must be an integer')
		}
	})
})
