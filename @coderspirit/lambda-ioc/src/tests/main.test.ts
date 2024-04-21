import { createContainer } from '../main'
import { describe, expect, it } from 'vitest'

describe('container', () => {
	it('resolves registered simple values', () => {
		const container = createContainer()
			.registerValue('a', 1)
			.registerValue('b', 2)
			.close()

		expect(container.resolve('a')).toBe(1)
		expect(container.resolve('b')).toBe(2)
	})

	it('returns the same instance for registered values', () => {
		const a = { v: 42 }
		const container = createContainer().registerValue('a', a).close()

		expect(container.resolve('a')).toBe(a)
		expect(container.resolve('a')).toBe(container.resolve('a'))
	})

	it('resolves from registered factories', () => {
		const container = createContainer()
			.registerValue('a', 1)
			.registerValue('b', 2)
			.registerFactory('sum', (a, b) => a + b, 'a', 'b')
			.close()

		expect(container.resolve('sum')).toBe(3)
	})

	it('does not return the same instance for registered factories', () => {
		const container = createContainer()
			.registerFactory('a', () => ({ v: 42 }))
			.close()

		expect(container.resolve('a')).not.toBe(container.resolve('a'))
	})

	it('returns the same instance for registered singletons', () => {
		const container = createContainer()
			.registerSingleton('a', () => ({ v: 42 }))
			.close()

		expect(container.resolve('a')).toBe(container.resolve('a'))
	})

	it('resolves from registered async factories', async () => {
		const container = createContainer()
			.registerValue('a', 1)
			.registerValue('b', 2)
			.registerAsyncFactory('sum', async (a, b) => a + b, 'a', 'b')
			.close()

		expect(await container.resolveAsync('sum')).toBe(3)
	})

	it('does not return the same instance for registered async factories', async () => {
		const container = createContainer()
			.registerAsyncFactory('a', async () => ({ v: 42 }))
			.close()

		expect(await container.resolveAsync('a')).not.toBe(
			await container.resolveAsync('a'),
		)
	})

	it('returns the same instance for registered async singletons', async () => {
		const container = createContainer()
			.registerAsyncSingleton('a', async () => ({ v: 42 }))
			.close()

		expect(await container.resolveAsync('a')).toBe(
			await container.resolveAsync('a'),
		)
	})

	it('resolves from factories with sync & async dependencies', async () => {
		const container = createContainer()
			.registerValue('a', 1)
			.registerValue('b', 2)
			.registerFactory('sum', (a, b) => a + b, 'a', 'b')
			.registerAsyncFactory('mul', async (b, sum) => b * sum, 'b', 'sum')
			.registerAsyncFactory('combine1', async (mul, a) => mul / a, 'mul', 'a')
			.registerAsyncFactory('combine2', async (mul, b) => mul ** b, 'mul', 'b')
			.close()

		expect(await container.resolveAsync('mul')).toBe(6)
		expect(await container.resolveAsync('combine1')).toBe(6)
		expect(await container.resolveAsync('combine2')).toBe(36)
	})

	it('resolves groups', async () => {
		const container = createContainer()
			.registerValue('g1:a', 1)
			.registerValue('g1:b', 2)
			.registerFactory('g1:sum', (a, b) => a + b, 'g1:a', 'g1:b')
			.registerValue('g2:a', 3)
			.registerValue('g2:b', 4)
			.registerFactory('g2:sum', (a, b) => a + b, 'g2:a', 'g2:b')
			.close()

		const g1 = await container.resolveGroup('g1')
		expect(g1.length).toBe(3)
		expect(g1).toContain(1)
		expect(g1).toContain(2)
		expect(g1).toContain(3)

		const g2 = await container.resolveGroup('g2')
		expect(g2.length).toBe(3)
		expect(g2).toContain(3)
		expect(g2).toContain(4)
		expect(g2).toContain(7)

		// @ts-expect-error
		const g3 = await container.resolveGroup('g3') // g3 is not registered
		expect(g3.length).toBe(0)
	})

	it('throws when trying to register a dependency twice', () => {
		const container = createContainer()
			.registerValue('a', 1)
			.registerValue('b', 2)

		// @ts-expect-error
		expect(() => container.registerValue('a', 1)).toThrow()
		// @ts-expect-error
		expect(() => container.registerFactory('a', () => 1)).toThrow()
		// @ts-expect-error
		expect(() => container.registerAsyncFactory('a', async () => 1)).toThrow()
	})

	it('throws when trying to resolve a non-registered dependency', () => {
		const container = createContainer()
			.registerValue('a', 1)
			.registerValue('b', 2)
			.close()

		// @ts-expect-error
		expect(() => container.resolve('c')).toThrow()
		// @ts-expect-error
		expect(() => container.resolveAsync('c')).rejects.toThrow()
	})
})

describe('@types/container', () => {
	it('has same signature for registerFactory and registerSingleton', () => {
		type RegisterFactory = ReturnType<typeof createContainer>['registerFactory']
		type RegisterSingleton = ReturnType<
			typeof createContainer
		>['registerSingleton']

		type RegisterFactory_extends_RegisterSingleton =
			RegisterFactory extends RegisterSingleton ? true : false
		type RegisterSingleton_extends_RegisterFactory =
			RegisterSingleton extends RegisterFactory ? true : false

		const a: RegisterFactory_extends_RegisterSingleton &
			RegisterSingleton_extends_RegisterFactory = true
		expect(a).toBe(true)
	})

	it('has same signature for registerAsyncFactory and registerAsyncSingleton', () => {
		type RegisterAsyncFactory = ReturnType<
			typeof createContainer
		>['registerAsyncFactory']
		type RegisterAsyncSingleton = ReturnType<
			typeof createContainer
		>['registerAsyncSingleton']

		type RegisterAsyncFactory_extends_RegisterAsyncSingleton =
			RegisterAsyncFactory extends RegisterAsyncSingleton ? true : false
		type RegisterAsyncSingleton_extends_RegisterAsyncFactory =
			RegisterAsyncSingleton extends RegisterAsyncFactory ? true : false

		const a: RegisterAsyncFactory_extends_RegisterAsyncSingleton &
			RegisterAsyncSingleton_extends_RegisterAsyncFactory = true
		expect(a).toBe(true)
	})
})
