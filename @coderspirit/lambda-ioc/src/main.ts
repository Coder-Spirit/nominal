type NNO = NonNullable<unknown>
type Dict = Record<string, unknown>

/**
 * Example:
 * - ExtractPrefix<'a:b' | 'a:c' | 'x:y' | 'w'> ~~> 'a' | 'x'
 */
type ExtractPrefix<T extends string> = T extends `${infer Prefix}:${string}`
	? Prefix
	: never

type ExtractPrefixedValues<
	Prefix extends string,
	Struct extends Dict,
	BaseKeys extends keyof Struct = keyof Struct,
> = BaseKeys extends `${Prefix}:${infer U}`
	? U extends '*'
		? never
		: Struct[`${Prefix}:${U}`]
	: never

export interface SyncContainer<out TSyncDependencies extends Dict> {
	resolve<TKey extends keyof TSyncDependencies>(
		k: TKey,
	): TSyncDependencies[TKey]
}

export interface AsyncContainer<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
> {
	resolveAsync<TKey extends keyof TSyncDependencies | keyof TAsyncDependencies>(
		k: TKey,
	): Promise<
		TKey extends keyof TSyncDependencies
			? TSyncDependencies[TKey]
			: TKey extends keyof TAsyncDependencies
				? TAsyncDependencies[TKey]
				: never
	>

	resolveGroup<
		TKey extends ExtractPrefix<
			string & (keyof TSyncDependencies | keyof TAsyncDependencies)
		>,
	>(
		k: TKey,
	): Promise<
		ExtractPrefixedValues<TKey, TSyncDependencies & TAsyncDependencies>[]
	>
}

export interface Container<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
> extends SyncContainer<TSyncDependencies>,
		AsyncContainer<TSyncDependencies, TAsyncDependencies> {}

type SyncDependencyFactory<V, TContainer extends SyncContainer<Dict>> = (
	container: TContainer,
) => Awaited<V>

type AsyncDependencyFactory<V, TContainer extends Container<Dict, Dict>> = (
	container: TContainer,
) => Promise<V>

type SyncFactoriesCollection = Record<
	string,
	SyncDependencyFactory<unknown, SyncContainer<Dict>>
>
type AsyncFactoriesCollection = Record<
	string,
	AsyncDependencyFactory<unknown, Container<Dict, Dict>>
>

/**
 * Examples:
 *  - KeysMatching<{ a: 1; b: 2; c: 3; d: 'hello' }, number> ~~> "a" | "b" | "c"
 *  - KeysMatching<{ a: 1; b: 2; c: 3; d: 'hello' }, 1> ~~> "a"
 *  - KeysMatching<{ a: 1; b: 2; c: 3; d: 'hello' }, string> ~~> "d"
 */
type KeysMatching<Collection, Value> = {
	[K in keyof Collection]-?: Collection[K] extends Value ? K : never
}[keyof Collection]

/**
 * Given a "dependencies collection" and a parameters list, it returns an
 * indexed collection type (which can be used as a tuple, because the indices
 * are numbers) where each parameter is mapped to the keys of the dependencies
 * collection that resolve to that parameter type.
 *
 * Example:
 * - ContextualParamsToSyncResolverKeys<
 *     { a: number; b: string; c: boolean, d: number },
 *     [number, string]
 *   > ~~> [ "a" | "d", "b" ]
 */
type ContextualParamsToSyncResolverKeys<
	TSyncDependencies extends Dict,
	TParams extends TSyncDependencies[keyof TSyncDependencies][] | [],
> = {
	[K in keyof TParams]: KeysMatching<TSyncDependencies, TParams[K]>
}

/**
 * Similar to `ContextualParamsToSyncResolverKeys`, but for async dependencies.
 */
type ContextualParamsToAsyncResolverKeys<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
	TParams extends
		| (
				| TSyncDependencies[keyof TSyncDependencies]
				| TAsyncDependencies[keyof TAsyncDependencies]
		  )[]
		| [],
> = {
	[K in keyof TParams]: KeysMatching<
		TSyncDependencies & TAsyncDependencies,
		TParams[K]
	>
}

type ConstrainedKey<
	K extends string,
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
> = Exclude<
	K,
	| keyof TSyncDependencies
	| keyof TAsyncDependencies
	| `${string}:`
	| `${string}:*`
>

type SyncRegisterResult<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
	K extends string,
	V,
> = ContainerBuilder<
	{
		[TK in keyof TSyncDependencies | K]: TK extends keyof TSyncDependencies
			? TSyncDependencies[TK]
			: V
	},
	K extends `${infer Prefix}:${string}`
		? {
				[TK in
					| keyof TAsyncDependencies
					| `${Prefix}:*`]: TK extends keyof TAsyncDependencies
					? TK extends `${Prefix}:*`
						? TAsyncDependencies[TK] extends unknown[]
							? [...TAsyncDependencies[TK], V]
							: never
						: TAsyncDependencies[TK]
					: [V]
			}
		: TAsyncDependencies
>

type RegisterFactoryFunc<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
> = <
	K extends ConstrainedKey<string, TSyncDependencies, TAsyncDependencies>,
	// biome-ignore lint/suspicious/noExplicitAny: WE NEED IT
	TArgs extends any[],
	V extends NNO,
	TParams extends TArgs & TSyncDependencies[keyof TSyncDependencies][],
	TDependencies extends ContextualParamsToSyncResolverKeys<
		TSyncDependencies,
		TParams
	>,
>(
	k: ConstrainedKey<K, TSyncDependencies, TAsyncDependencies>,
	f: (...args: TArgs) => Awaited<V>,
	...args: TDependencies
) => SyncRegisterResult<TSyncDependencies, TAsyncDependencies, K, V>

type RegisterAsyncFactory<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
> = <
	K extends ConstrainedKey<string, TSyncDependencies, TAsyncDependencies>,
	// biome-ignore lint/suspicious/noExplicitAny: WE NEED IT
	TArgs extends any[],
	V extends NNO,
	TParams extends TArgs &
		(
			| TSyncDependencies[keyof TSyncDependencies]
			| TAsyncDependencies[keyof TAsyncDependencies]
		)[],
	TDependencies extends ContextualParamsToAsyncResolverKeys<
		TSyncDependencies,
		TAsyncDependencies,
		TParams
	>,
>(
	k: ConstrainedKey<K, TSyncDependencies, TAsyncDependencies>,
	f: (...args: TArgs) => V,
	...args: TDependencies
) => ContainerBuilder<
	TSyncDependencies,
	K extends `${infer Prefix}:${string}`
		? {
				[TK in
					| keyof TAsyncDependencies
					| K
					| `${Prefix}:*`]: TK extends keyof TAsyncDependencies
					? TK extends `${Prefix}:*`
						? TAsyncDependencies[TK] extends unknown[]
							? [...TAsyncDependencies[TK], Awaited<V>]
							: never
						: TAsyncDependencies[TK]
					: TK extends `${Prefix}:*`
						? [Awaited<V>]
						: Awaited<V>
			}
		: {
				[TK in
					| keyof TAsyncDependencies
					| K]: TK extends keyof TAsyncDependencies
					? TAsyncDependencies[TK]
					: Awaited<V>
			}
>

export interface WritableContainer<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
> {
	/** Registers a value in the container. */
	registerValue<
		K extends Exclude<
			string,
			| keyof TSyncDependencies
			| keyof TAsyncDependencies
			| `${string}:`
			| `${string}:*`
		>,
		V extends K extends keyof TSyncDependencies | keyof TAsyncDependencies
			? never
			: unknown,
	>(
		k: Exclude<
			K,
			| keyof TSyncDependencies
			| keyof TAsyncDependencies
			| `${string}:`
			| `${string}:*`
		>,
		v: Awaited<NonNullable<V>>,
	): SyncRegisterResult<TSyncDependencies, TAsyncDependencies, K, V>

	/** Registers a factory in the container. */
	registerFactory: RegisterFactoryFunc<TSyncDependencies, TAsyncDependencies>

	/** Registers an async factory in the container. */
	registerAsyncFactory: RegisterAsyncFactory<
		TSyncDependencies,
		TAsyncDependencies
	>

	/** Registers a factory in the container and treats it as a singleton. */
	registerSingleton: RegisterFactoryFunc<TSyncDependencies, TAsyncDependencies>

	/** Registers an async factory in the container and treats it as a singleton. */
	registerAsyncSingleton: RegisterAsyncFactory<
		TSyncDependencies,
		TAsyncDependencies
	>
}

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Dict ? DeepPartial<T[K]> : T[K]
}

export interface ContainerBuilder<
	TSyncDependencies extends Dict,
	TAsyncDependencies extends Dict,
> extends Container<TSyncDependencies, TAsyncDependencies>,
		WritableContainer<TSyncDependencies, TAsyncDependencies> {
	/**
	 * "Closes" the container, making it read-only. It also allows us to expose
	 * less dependencies than the ones we have registered.
	 */
	close<
		SD extends DeepPartial<TSyncDependencies> = TSyncDependencies,
		AD extends DeepPartial<TAsyncDependencies> = TAsyncDependencies,
	>(): Container<SD, AD>
}

export class LambdaIoCError extends Error {}

export function __createContainer<
	TSyncFactories extends SyncFactoriesCollection,
	TAsyncFactories extends AsyncFactoriesCollection,
>(
	syncFactories: TSyncFactories,
	asyncFactories: TAsyncFactories,
): ContainerBuilder<NNO, NNO> {
	// We don't bother with internal types, as they are not exposed to the user,
	// and are extremely difficult to maintain.
	const c = {
		resolve(k: string): unknown {
			const factory = syncFactories[k as keyof TSyncFactories]
			if (factory === undefined) {
				throw new LambdaIoCError(`Dependency "${k as string}" not found`)
			}
			return factory(c)
		},

		async resolveAsync(k: string): Promise<unknown> {
			if (k.endsWith(':*')) {
				return c.resolveGroup(k.slice(0, -2))
			}

			const syncFactory = syncFactories[k as keyof TSyncFactories]

			if (syncFactory === undefined) {
				const asyncFactory = asyncFactories[k as keyof TAsyncFactories]
				if (asyncFactory === undefined) {
					throw new LambdaIoCError(`Dependency "${k as string}" not found`)
				}
				return asyncFactory(c as unknown as Container<Dict, Dict>)
			}

			return syncFactory(c)
		},

		async resolveGroup(k: string): Promise<unknown[]> {
			return Object.entries(syncFactories)
				.filter(([key]) => key.startsWith(k))
				.map(([_, factory]) => factory(c))
				.concat(
					await Promise.all(
						Object.entries(asyncFactories)
							.filter(([key]) => key.startsWith(k))
							.map(([_, factory]) =>
								factory(c as unknown as Container<Dict, Dict>),
							),
					),
				)
		},

		registerValue(k: string, v: unknown): ContainerBuilder<NNO, NNO> {
			if (syncFactories[k] !== undefined || asyncFactories[k] !== undefined) {
				throw new LambdaIoCError(
					`Dependency "${k as string}" already registered`,
				)
			}
			if (k.endsWith(':*')) {
				throw new LambdaIoCError(`Invalid dependency name: "${k as string}"`)
			}

			return __createContainer(
				{
					...syncFactories,
					[k]: () => v,
				},
				asyncFactories,
			)
		},

		registerFactory(
			k: string,
			factory: (...args: unknown[]) => Awaited<NNO>,
			...args: string[]
		): ContainerBuilder<NNO, NNO> {
			if (syncFactories[k] !== undefined || asyncFactories[k] !== undefined) {
				throw new LambdaIoCError(
					`Dependency "${k as string}" already registered`,
				)
			}
			if (k.endsWith(':*')) {
				throw new LambdaIoCError(`Invalid dependency name: "${k as string}"`)
			}

			return __createContainer(
				{
					...syncFactories,
					[k]: () => {
						const resolvedParams = args.map(arg => c.resolve(arg))
						return factory(...resolvedParams)
					},
				},
				asyncFactories,
			)
		},

		registerAsyncFactory(
			k: string,
			factory: (...args: unknown[]) => Promise<NNO>,
			...args: string[]
		) {
			if (syncFactories[k] !== undefined || asyncFactories[k] !== undefined) {
				throw new LambdaIoCError(
					`Dependency "${k as string}" already registered`,
				)
			}
			if (k.endsWith(':*')) {
				throw new LambdaIoCError(`Invalid dependency name: "${k as string}"`)
			}

			return __createContainer(syncFactories, {
				...asyncFactories,
				[k]: async () => {
					const resolvedParams = await Promise.all(
						args.map(arg => {
							if (arg.endsWith(':*')) {
								return c.resolveGroup(arg.slice(0, -2))
							}
							if (syncFactories[arg] !== undefined) {
								// biome-ignore lint/style/noNonNullAssertion: asserted above!
								return syncFactories[arg]!(c)
							}
							if (asyncFactories[arg] !== undefined) {
								// biome-ignore lint/style/noNonNullAssertion: asserted above!
								return asyncFactories[arg]!(
									c as unknown as Container<Dict, Dict>,
								)
							}
							throw new LambdaIoCError(
								`Dependency "${arg as string}" not found`,
							)
						}),
					)

					return factory(...resolvedParams)
				},
			})
		},

		registerSingleton(
			k: string,
			factory: (...args: unknown[]) => Awaited<NNO>,
			...args: string[]
		): ContainerBuilder<NNO, NNO> {
			if (syncFactories[k] !== undefined || asyncFactories[k] !== undefined) {
				throw new LambdaIoCError(
					`Dependency "${k as string}" already registered`,
				)
			}
			if (k.endsWith(':*')) {
				throw new LambdaIoCError(`Invalid dependency name: "${k as string}"`)
			}

			let singleton: unknown = undefined

			return __createContainer(
				{
					...syncFactories,
					[k]: () => {
						if (singleton === undefined) {
							const resolvedParams = args.map(arg => c.resolve(arg))
							singleton = factory(...resolvedParams)
						}
						return singleton
					},
				},
				asyncFactories,
			)
		},

		registerAsyncSingleton(
			k: string,
			factory: (...args: unknown[]) => Promise<NNO>,
			...args: string[]
		) {
			if (syncFactories[k] !== undefined || asyncFactories[k] !== undefined) {
				throw new LambdaIoCError(
					`Dependency "${k as string}" already registered`,
				)
			}
			if (k.endsWith(':*')) {
				throw new LambdaIoCError(`Invalid dependency name: "${k as string}"`)
			}

			let singleton: unknown = undefined

			return __createContainer(syncFactories, {
				...asyncFactories,
				[k]: async () => {
					if (singleton === undefined) {
						const resolvedParams = await Promise.all(
							args.map(arg => {
								if (arg.endsWith(':*')) {
									return c.resolveGroup(arg.slice(0, -2))
								}
								if (syncFactories[arg] !== undefined) {
									// biome-ignore lint/style/noNonNullAssertion: asserted above!
									return syncFactories[arg]!(c)
								}
								if (asyncFactories[arg] !== undefined) {
									// biome-ignore lint/style/noNonNullAssertion: asserted above!
									return asyncFactories[arg]!(
										c as unknown as Container<Dict, Dict>,
									)
								}
								throw new LambdaIoCError(
									`Dependency "${arg as string}" not found`,
								)
							}),
						)

						singleton = factory(...resolvedParams)
					}
					return singleton
				},
			})
		},

		close: () => c,
	} satisfies {
		// We just check that functions are present, but not their signatures.
		[k in keyof ContainerBuilder<NNO, NNO>]: unknown
	}

	return c as unknown as ContainerBuilder<NNO, NNO>
}

export function createContainer(): ContainerBuilder<NNO, NNO> {
	return __createContainer({}, {})
}
