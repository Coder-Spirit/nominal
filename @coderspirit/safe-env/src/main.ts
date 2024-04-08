import type {
	TaggedFloat,
	TaggedInteger,
	TaggedPositiveInteger,
} from '@coderspirit/nominal-inputs'

interface SimpleEnv {
	[key: string]: string | undefined
}

const uintTypes = ['uint8', 'uint16', 'uint32'] as const
const intTypes = ['int8', 'int16', 'int32'] as const
const integerTypes = [...uintTypes, ...intTypes] as const
const floatTypes = ['float32', 'float64'] as const

type JtdUIntType = (typeof uintTypes)[number]
type JtdIntType = (typeof intTypes)[number]
type JtdIntegerType = JtdIntType | JtdUIntType
type JtdFloatType = (typeof floatTypes)[number]
type JtdNumberType = JtdFloatType | JtdIntegerType
type JtdStringType = 'string' | 'timestamp'
type JtdAllType = JtdNumberType | JtdStringType | 'boolean'

type TMapper<T extends JtdAllType> = T extends JtdFloatType
	? number
	: T extends JtdIntegerType
		? number | bigint
		: T extends JtdStringType
			? string
			: T extends 'boolean'
				? boolean
				: never

type TOutMapper<T extends JtdAllType> = T extends JtdFloatType
	? TaggedFloat<number>
	: T extends JtdIntegerType
		? T extends 'uint8' | 'uint16' | 'uint32'
			? TaggedPositiveInteger<number | bigint>
			: TaggedInteger<number | bigint>
		: T extends JtdStringType
			? string
			: T extends 'boolean'
				? boolean
				: never

type FieldWithDefault<T extends JtdAllType> = {
	type: T
	default: TMapper<T>
}

export type Schema = {
	[key: string]:
		| {
				type: JtdAllType
				default?: undefined
		  } // optional == false
		| {
				type: JtdAllType
				optional: true
		  }
		| FieldWithDefault<JtdFloatType>
		| FieldWithDefault<JtdIntegerType>
		| FieldWithDefault<JtdStringType>
		| FieldWithDefault<'boolean'>
		| { enum: string[] }
		| {
				enum: string[]
				optional: true
		  }
		| {
				enum: string[]
				default: string
		  }
}

type EnvData<S extends Schema> = {
	[key in keyof S]?: string
}

type EnvKeyType<S extends Schema, K extends keyof S> = S[K] extends {
	type: infer T
}
	? T extends JtdAllType
		? S[K] extends { optional: true }
			? TOutMapper<T> | undefined
			: S[K] extends { default: infer D }
				? D extends undefined
					? TOutMapper<T>
					: D
				: TOutMapper<T>
		: never
	: S[K] extends { enum: infer E }
		? E extends string[]
			? S[K] extends { optional: true }
				? E[number] | undefined
				: S[K] extends { default: infer D }
					? D extends undefined
						? E[number]
						: D
					: E[number]
			: never
		: never

interface EnvWrapper<S extends Schema | undefined> {
	get<K extends S extends Schema ? keyof S & string : string>(
		key: K,
	): S extends Schema ? EnvKeyType<S, K> : string | undefined
}

class SafeEnvError extends Error {}

const checkInteger = (
	value: unknown,
	fieldName: string,
	forDefault: boolean,
): value is TaggedInteger<number | bigint> => {
	if (typeof value !== 'bigint' && !Number.isInteger(value)) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must be an integer`
				: `Environment variable "${fieldName}" must be an integer`,
		)
	}
	return true
}

const checkBetween = (
	value: number | bigint,
	lowerBound: number,
	upperBound: number,
	fieldName: string,
	forDefault: boolean,
) => {
	if (value < lowerBound || value > upperBound) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must be between ${lowerBound} and ${upperBound}`
				: `Environment variable "${fieldName}" must be between ${lowerBound} and ${upperBound}`,
		)
	}
}

/**
 * Extra runtime validations to cover cases that can't be covered by the type
 * system or the schema validation.
 */
const validateValue = <T extends JtdAllType>(
	fieldName: string,
	type: T,
	value: TMapper<T>,
	forDefault: boolean,
): void => {
	// For now we only check integer types
	switch (type) {
		case 'int8':
			if (checkInteger(value, fieldName, forDefault)) {
				checkBetween(value, -128, 127, fieldName, forDefault)
			}
			break
		case 'int16':
			if (checkInteger(value, fieldName, forDefault)) {
				checkBetween(value, -32768, 32767, fieldName, forDefault)
			}
			break
		case 'int32':
			if (checkInteger(value, fieldName, forDefault)) {
				checkBetween(value, -2147483648, 2147483647, fieldName, forDefault)
			}
			break
		case 'uint8':
			if (checkInteger(value, fieldName, forDefault)) {
				checkBetween(value, 0, 255, fieldName, forDefault)
			}
			break
		case 'uint16':
			if (checkInteger(value, fieldName, forDefault)) {
				checkBetween(value, 0, 65535, fieldName, forDefault)
			}
			break
		case 'uint32':
			if (checkInteger(value, fieldName, forDefault)) {
				checkBetween(value, 0, 4294967295, fieldName, forDefault)
			}
			break
	}
}

const verifyEnumDefault = (
	fieldName: string,
	enumValues: string[],
	value: string,
	forDefault: boolean,
): void => {
	if (!enumValues.includes(value)) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must be one of: [${enumValues.join(
						', ',
					)}]`
				: `Environment variable "${fieldName}" must be one of: [${enumValues.join(
						', ',
					)}]`,
		)
	}
}

const processEnv = <S extends Schema>(
	env: EnvData<S>,
	schema: Schema,
): Record<string, boolean | number | bigint | string> => {
	const _env: Record<string, boolean | number | bigint | string> = {}

	// Verify Defaults
	for (const key of Object.getOwnPropertyNames(schema)) {
		// biome-ignore lint/style/noNonNullAssertion: We know it exists
		const rule = schema[key]!

		if ('default' in rule && rule.default !== undefined) {
			if ('type' in rule) {
				validateValue(key, rule.type, rule.default, true)
			} else {
				verifyEnumDefault(key, rule.enum, rule.default, true)
			}
		}

		const envValue = env[key]

		if (envValue === undefined) {
			if (
				!('optional' in rule) &&
				(!('default' in rule) || rule.default === undefined)
			) {
				throw new SafeEnvError(
					`Missing required environment variable: "${key}"`,
				)
			}
			continue
		}

		if ('enum' in rule) {
			if (!rule.enum.includes(envValue)) {
				throw new SafeEnvError(
					`Environment variable "${key}" must be one of: [${rule.enum.join(
						', ',
					)}]`,
				)
			}

			_env[key] = envValue
		} else if ('type' in rule) {
			if (integerTypes.includes(rule.type as JtdIntegerType)) {
				const fValue = Number.parseFloat(envValue)
				if (!Number.isInteger(fValue)) {
					throw new SafeEnvError(
						`Environment variable "${key}" must be an integer`,
					)
				}
				switch (rule.type) {
					case 'int8':
						checkBetween(fValue, -128, 127, key, false)
						break
					case 'int16':
						checkBetween(fValue, -32768, 32767, key, false)
						break
					case 'int32':
						checkBetween(fValue, -2147483648, 2147483647, key, false)
						break
					case 'uint8':
						checkBetween(fValue, 0, 255, key, false)
						break
					case 'uint16':
						checkBetween(fValue, 0, 65535, key, false)
						break
					case 'uint32':
						checkBetween(fValue, 0, 4294967295, key, false)
						break
				}
				_env[key] = fValue
			} else if (floatTypes.includes(rule.type as JtdFloatType)) {
				const fValue = Number.parseFloat(envValue)
				if (Number.isNaN(fValue) || !Number.isFinite(fValue)) {
					throw new SafeEnvError(
						`Environment variable "${key}" must be a finite real number`,
					)
				}
				switch (rule.type) {
					case 'float32':
						checkBetween(
							fValue,
							-3.4028234663852886e38,
							3.4028234663852886e38,
							key,
							false,
						)
						break
					case 'float64':
						// No need to check, it's always valid
						break
				}
				_env[key] = fValue
			} else if (rule.type === 'boolean') {
				if (envValue === 'true') {
					_env[key] = true
				} else if (envValue === 'false') {
					_env[key] = false
				} else {
					throw new SafeEnvError(
						`Environment variable "${key}" must be a boolean`,
					)
				}
			} else if (rule.type === 'string') {
				// This should never happen with real environment objects, but it's a
				// possibility for "mock" environments
				if (typeof envValue !== 'string') {
					throw new SafeEnvError(
						`Environment variable "${key}" must be a string`,
					)
				}
				_env[key] = envValue
			} else {
				_env[key] = envValue
			}
		}
	}

	return _env
}

const buildEnvWrapper = <
	S extends Schema,
	SS extends S | undefined = S | undefined,
>(
	env: SimpleEnv,
	schema?: SS,
): EnvWrapper<S | undefined> => {
	return {
		get: <K extends keyof S & string>(
			key: K,
		): S extends Schema ? EnvKeyType<S, K> : string | undefined => {
			const value = env[key]

			if (value === undefined) {
				const keySchema = schema?.[key] as
					| { default: EnvKeyType<S, typeof key>; optional?: true }
					| undefined

				const defaultValue = keySchema?.default

				if (defaultValue !== undefined) {
					return defaultValue
				}
				if (keySchema?.optional === true) {
					return undefined as EnvKeyType<S, typeof key>
				}

				throw new SafeEnvError(`Missing environment variable: "${key}"`)
			}

			return value as EnvKeyType<S, typeof key>
		},
	}
}

export const getSafeEnv = <
	S extends Schema,
	SS extends S | undefined = S | undefined,
>(
	env: SimpleEnv,
	schema?: SS,
): EnvWrapper<SS> => {
	const _env = schema ? processEnv(env, schema) : { ...env }
	return buildEnvWrapper(_env as EnvData<S>, schema)
}
