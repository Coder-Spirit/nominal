import { describe, expect, it } from 'vitest'
import { getSafeEnv } from '../main'

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
		const env = { }

		const envWrapper = getSafeEnv(env, {
			FOO: { type: 'int32', default: 42 },
			BAR: { type: 'int32', default: 42n },
		})

		const foo = envWrapper.get('FOO')
		type Does_Number_extend_Foo = number extends typeof foo ? true : false
		const number_extends_foo: Does_Number_extend_Foo = true
		expect(number_extends_foo).toBe(true)

		const bar = envWrapper.get('BAR')
		type Does_BigInt_extend_Bar = bigint extends typeof bar ? true : false
		const bigint_extends_bar: Does_BigInt_extend_Bar = true
		expect(bigint_extends_bar).toBe(true)
	})
})
