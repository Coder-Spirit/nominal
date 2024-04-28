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
const numberTypes = [...integerTypes, ...floatTypes] as const

type UIntType = (typeof uintTypes)[number]
type IntType = (typeof intTypes)[number]
type IntegerType = IntType | UIntType
type FloatType = (typeof floatTypes)[number]
type NumberType = FloatType | IntegerType
type StringType = 'string'
type BooleanType = 'boolean'
type AllType = NumberType | StringType | BooleanType
type NotConstrainableType = BooleanType

type TMapper<T extends AllType> = {
	float32: number
	float64: number
	int8: number
	int16: number
	int32: number
	uint8: number
	uint16: number
	uint32: number
	string: string
	boolean: boolean
}[T]

type TOutMapper<T extends AllType> = {
	float32: TaggedFloat<number>
	float64: TaggedFloat<number>
	int8: TaggedInteger
	int16: TaggedInteger
	int32: TaggedInteger
	uint8: TaggedPositiveInteger
	uint16: TaggedPositiveInteger
	uint32: TaggedPositiveInteger
	string: string
	boolean: boolean
}[T]

type NumberConstraints = {
	min?: number
	max?: number
}

type NumberField<T extends NumberType> = (
	| { type: T; default?: undefined } // optional == false
	| { type: T; default: number }
	| { type: T; optional: true }
) &
	NumberConstraints

type StringConstraints = {
	minLength?: number
	maxLength?: number
	pattern?: RegExp
}

type StringField = (
	| { type: StringType; default?: undefined } // optional == false
	| { type: StringType; default: string }
	| { type: StringType; optional: true }
) &
	StringConstraints

type FieldWithDefault<T extends NotConstrainableType> = {
	type: T
	default: TMapper<T>
}

type Constraints<T extends AllType> = {
	float32: NumberConstraints
	float64: NumberConstraints
	int8: NumberConstraints
	int16: NumberConstraints
	int32: NumberConstraints
	uint8: NumberConstraints
	uint16: NumberConstraints
	uint32: NumberConstraints
	string: StringConstraints
	boolean: NonNullable<unknown>
}[T]

type NotConstrainableField =
	| {
			type: NotConstrainableType
			default?: undefined
	  } // optional == false
	| {
			type: NotConstrainableType
			optional: true
	  }
	// Add individual variants for each non-constrainable type:
	| FieldWithDefault<BooleanType>

export type Schema = {
	[key: string]:
		| NumberField<NumberType>
		| StringField
		| NotConstrainableField
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
	? T extends AllType
		? S[K] extends { optional: true }
			? TOutMapper<T> | undefined
			: TOutMapper<T>
		: never
	: S[K] extends { enum: infer E }
		? E extends string[]
			? S[K] extends { optional: true }
				? E[number] | undefined
				: E[number]
			: never
		: never

export type EnvWrapper<Values extends Record<string, unknown>> = {
	get<K extends keyof Values & string>(key: K): Values[K]
}

class SafeEnvError extends Error {}

const checkInteger = (
	value: unknown,
	fieldName: string,
	forDefault: boolean,
): value is TaggedInteger => {
	if (typeof value !== 'number' || !Number.isInteger(value)) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must be an integer`
				: `Environment variable "${fieldName}" must be an integer`,
		)
	}
	return true
}

const checkFloat = (
	value: unknown,
	fieldName: string,
	forDefault: boolean,
): value is TaggedFloat<number> => {
	if (
		typeof value !== 'number' ||
		Number.isNaN(value) ||
		!Number.isFinite(value)
	) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must be a finite real number`
				: `Environment variable "${fieldName}" must be a finite real number`,
		)
	}
	return true
}

const checkBetween = (
	value: number,
	lowerBound: number,
	upperBound: number,
	fieldName: string,
	forDefault: boolean,
): void => {
	if (value < lowerBound || value > upperBound) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must be between ${lowerBound} and ${upperBound}`
				: `Environment variable "${fieldName}" must be between ${lowerBound} and ${upperBound}`,
		)
	}
}

/**
 * We use this in switch statement default cases to ensure that they are
 * exhaustive.
 */
const exhaustiveGuard = (_v: never): void => {}

/**
 * Extra runtime validations to cover cases that can't be covered by the type
 * system or the schema validation.
 */
const validateValue = <const D extends boolean, const T extends AllType>(
	forDefault: D,
	fieldName: string,
	type: T,
	value: D extends true ? TMapper<T> : unknown,
	constraints: Constraints<T>,
): void => {
	const v = forDefault
		? value
		: numberTypes.includes(type as NumberType) && typeof value === 'string'
			? Number.parseFloat(value)
			: value

	const min = 'min' in constraints ? constraints.min : Number.NEGATIVE_INFINITY
	const max = 'max' in constraints ? constraints.max : Number.POSITIVE_INFINITY

	// For now we only check integer types
	switch (type) {
		case 'int8':
			if (checkInteger(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(-128, min),
					Math.min(127, max),
					fieldName,
					forDefault,
				)
			}
			return
		case 'int16':
			if (checkInteger(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(-32768, min),
					Math.min(32767, max),
					fieldName,
					forDefault,
				)
			}
			return
		case 'int32':
			if (checkInteger(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(-2147483648, min),
					Math.min(2147483647, max),
					fieldName,
					forDefault,
				)
			}
			return
		case 'uint8':
			if (checkInteger(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(0, min),
					Math.min(255, max),
					fieldName,
					forDefault,
				)
			}
			return
		case 'uint16':
			if (checkInteger(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(0, min),
					Math.min(65535, max),
					fieldName,
					forDefault,
				)
			}
			return
		case 'uint32':
			if (checkInteger(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(0, min),
					Math.min(4294967295, max),
					fieldName,
					forDefault,
				)
			}
			return
		case 'float32':
			if (checkFloat(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(-3.4028234663852886e38, min),
					Math.min(3.4028234663852886e38, max),
					fieldName,
					forDefault,
				)
			}
			return
		case 'float64':
			if (checkFloat(v, fieldName, forDefault)) {
				checkBetween(v, min, max, fieldName, forDefault)
			}
			return
		case 'boolean':
			// We only need to check environment variables, default values will always be correct
			if (!forDefault && v !== 'true' && v !== 'false') {
				throw new SafeEnvError(
					`Environment variable "${fieldName}" must be a boolean`,
				)
			}
			return
		case 'string':
			if (typeof v !== 'string') {
				// This should never happen
				throw new SafeEnvError(
					forDefault
						? `Default value for "${fieldName}" must be a string`
						: `Environment variable "${fieldName}" must be a string`,
				)
			}
			{
				const minLength = 'minLength' in constraints ? constraints.minLength : 1
				const maxLength =
					'maxLength' in constraints ? constraints.maxLength : 65535
				if (v.length < minLength || v.length > maxLength) {
					throw new SafeEnvError(
						forDefault
							? `Default value for "${fieldName}" must be between ${minLength} and ${maxLength} characters`
							: `Environment variable "${fieldName}" must be between ${minLength} and ${maxLength} characters`,
					)
				}
			}
			if ('pattern' in constraints && !constraints.pattern.test(v)) {
				throw new SafeEnvError(
					forDefault
						? `Default value for "${fieldName}" must match the pattern ${constraints.pattern}`
						: `Environment variable "${fieldName}" must match the pattern ${constraints.pattern}`,
				)
			}
			return
		default:
			exhaustiveGuard(type)
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
				? `Default value for "${fieldName}" must be one of [${enumValues.join(
						', ',
					)}], but it is "${value}"`
				: `Environment variable "${fieldName}" must be one of: [${enumValues.join(
						', ',
					)}], but it is "${value}"`,
		)
	}
}

const processEnv = <S extends Schema>(
	env: EnvData<S>,
	schema: Schema,
): Record<string, boolean | number | string> => {
	const _env: Record<string, boolean | number | string> = {}

	// Verify Defaults
	for (const key of Object.getOwnPropertyNames(schema)) {
		// biome-ignore lint/style/noNonNullAssertion: We know it exists
		const rule = schema[key]!

		if ('default' in rule && rule.default !== undefined) {
			if ('type' in rule) {
				const { type: _t, default: _d, ...constraints } = rule
				validateValue(true, key, _t, _d, constraints)
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
					`Environment variable "${key}" must be one of [${rule.enum.join(
						', ',
					)}], but it is "${envValue}"`,
				)
			}
			_env[key] = envValue
		} else if ('type' in rule) {
			if (numberTypes.includes(rule.type as NumberType)) {
				const fValue = Number.parseFloat(envValue)
				validateValue(false, key, rule.type, fValue, rule)
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
				validateValue(false, key, rule.type, envValue, rule)
				_env[key] = envValue
			} else {
				_env[key] = envValue // This should never happen
			}
		}
	}

	return _env
}

const buildEnvWrapper = <S extends Schema>(
	env: SimpleEnv,
	schema: S,
): EnvWrapper<{
	[K in keyof S]: EnvKeyType<S, K>
}> => {
	return {
		get: <K extends keyof S & string>(key: K): EnvKeyType<S, K> => {
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

export const getSafeEnv = <const S extends Schema>(
	env: SimpleEnv,
	schema: S,
): EnvWrapper<{
	[K in keyof S]: EnvKeyType<S, K>
}> => {
	const _env = schema ? processEnv(env, schema) : { ...env }
	return buildEnvWrapper(_env as EnvData<S>, schema)
}
