import { describe, expect, it } from 'vitest'
import { getSafeEnv } from '../main'

describe('getSafeEnv', () => {
	it('should return a safe env wrapper when a schema is specified', () => {
		const env = { FOO: 'foo', HAH: 'hah' }

		const envWrapper = getSafeEnv(env, {
			FOO: { type: 'string' },
			BAR: { type: 'string', optional: true },
			FUN: { type: 'string', default: 'fun' },

			HAH: { enum: ['hah', 'heh'] },
			OMG: { enum: ['omg', 'wow'], default: 'wow' },
			FEW: { enum: ['few', 'fow'], optional: true },
		})

		expect(envWrapper.get('FOO')).toBe('foo')
		expect(envWrapper.get('BAR')).toBe(undefined)
		expect(envWrapper.get('FUN')).toBe('fun')

		expect(envWrapper.get('HAH')).toBe('hah')
		expect(envWrapper.get('OMG')).toBe('wow')
		expect(envWrapper.get('FEW')).toBe(undefined)
	})

	it('should return values with the correct types', () => {
		const env = { FOO: '42', BAR: '42', WOW: '42', HEH: 'false' }

		const envWrapper = getSafeEnv(env, {
			FOO: { type: 'uint8' },
			BAR: { type: 'uint32' },
			WOW: { type: 'string' },
			HEH: { type: 'boolean' },
		})

		expect(envWrapper.get('FOO')).toBe(42)
		expect(envWrapper.get('BAR')).toBe(42)
		expect(envWrapper.get('WOW')).toBe('42')
		expect(envWrapper.get('HEH')).toBe(false)
	})

	it('should throw an error when a required variable is missing', () => {
		const env = { FOO: 'foo' }

		const schema = {
			FOO: { type: 'string' },
			BAR: { type: 'string' },
		} as const

		expect(() => getSafeEnv(env, schema)).toThrowError(
			'Missing required environment variable: "BAR"',
		)
	})

	it.each([
		[
			{ FOO: 'foo' },
			{ FOO: { type: 'uint32' } },
			'Environment variable "FOO" must be an integer',
		] as const,
		[
			{ FOO: 42 },
			{ FOO: { type: 'string' } },
			'Environment variable "FOO" must be a string',
		] as const,
		[
			{ FOO: '64.5' },
			{ FOO: { type: 'uint32' } },
			'Environment variable "FOO" must be an integer',
		] as const,
	])(
		'should return an error when a variable has the wrong type',
		(env, schema, errMsg) => {
			expect(() =>
				getSafeEnv(env as Record<string, string>, schema),
			).toThrowError(errMsg)
		},
	)

	it.each([
		[
			{ FOO: 'foo' },
			{ FOO: { type: 'uint8', default: -42 } },
			'Default value for "FOO" must be between 0 and 255',
		] as const,
		[
			{ FOO: 'foo' },
			{ FOO: { type: 'uint8', default: 384 } },
			'Default value for "FOO" must be between 0 and 255',
		] as const,
	])(
		'should return an error when the default value has the wrong type',
		(env, schema, errorMsg) => {
			expect(() =>
				getSafeEnv(env as Record<string, string>, schema),
			).toThrowError(errorMsg)
		},
	)

	it('should return an error when trying to read an unknown variable', () => {
		const env = { FOO: 'foo' }

		const envWrapper = getSafeEnv(env, {
			FOO: { type: 'string' },
		})

		// @ts-expect-error
		expect(() => envWrapper.get('BAR')).toThrowError(
			'Missing environment variable: "BAR"',
		)
	})

	it.each([
		[
			{ FOO: 'foo' },
			{ FOO: { type: 'string', minLength: 4 } },
			'Environment variable "FOO" must be between 4 and 65535 characters',
		] as const,
		[
			{ FOO: 'foo' },
			{ FOO: { type: 'string', maxLength: 2 } },
			'Environment variable "FOO" must be between 1 and 2 characters',
		] as const,
		[
			{ FOO: 'foo' },
			{ FOO: { type: 'string', pattern: /bar/ } },
			'Environment variable "FOO" must match the pattern /bar/',
		] as const,
		[
			{ FOO: '128000' },
			{ FOO: { type: 'uint32', max: 75000 } },
			'Environment variable "FOO" must be between 0 and 75000',
		] as const,
		[
			{ FOO: '128000' },
			{ FOO: { type: 'int32', max: 75000 } },
			'Environment variable "FOO" must be between -2147483648 and 75000',
		] as const,
		[
			{ FOO: '64000' },
			{ FOO: { type: 'int32', min: 75000 } },
			'Environment variable "FOO" must be between 75000 and 2147483647',
		] as const,
	])(
		'should return an error when a default value breaks a constraint',
		(env, schema, errorMsg) => {
			expect(() => getSafeEnv(env, schema)).toThrowError(errorMsg)
		},
	)
})
