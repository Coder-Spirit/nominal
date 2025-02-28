import type {
	TaggedFloat,
	TaggedInteger,
	TaggedPositiveInteger,
} from '@coderspirit/nominal-inputs'

interface SimpleEnv {
	[key: string]: string | undefined
}

const uintTypes = ['uint8', 'uint16', 'uint32'] as const
const intTypes = ['int8', 'int16', 'int32', 'int54'] as const
const integerTypes = [...uintTypes, ...intTypes] as const
const floatTypes = ['float32', 'float64'] as const
const numberTypes = [...integerTypes, ...floatTypes] as const
const arrayTypes = ([...numberTypes, 'string'] as const).map(
	t => `${t}[]` as const,
)

type UIntType = (typeof uintTypes)[number]
type IntType = (typeof intTypes)[number]
type IntegerType = IntType | UIntType
type FloatType = (typeof floatTypes)[number]
type NumberType = FloatType | IntegerType
type StringType = 'string'
type BooleanType = 'boolean'
type BasicType = NumberType | StringType | BooleanType
type ArrayType = (typeof arrayTypes)[number]
type AllType = BasicType | ArrayType
type NotConstrainableType = BooleanType

type TMapper<T extends AllType> = {
	float32: number
	float64: number
	int8: number
	int16: number
	int32: number
	int54: number
	uint8: number
	uint16: number
	uint32: number
	string: string
	boolean: boolean
	'float32[]': number[]
	'float64[]': number[]
	'int8[]': number[]
	'int16[]': number[]
	'int32[]': number[]
	'int54[]': number[]
	'uint8[]': number[]
	'uint16[]': number[]
	'uint32[]': number[]
	'string[]': string[]
}[T]

type TOutMapper<T extends AllType> = {
	float32: TaggedFloat<number>
	float64: TaggedFloat<number>
	int8: TaggedInteger
	int16: TaggedInteger
	int32: TaggedInteger
	int54: TaggedInteger
	uint8: TaggedPositiveInteger
	uint16: TaggedPositiveInteger
	uint32: TaggedPositiveInteger
	string: string
	boolean: boolean
	'float32[]': TaggedFloat<number>[]
	'float64[]': TaggedFloat<number>[]
	'int8[]': TaggedInteger[]
	'int16[]': TaggedInteger[]
	'int32[]': TaggedInteger[]
	'int54[]': TaggedInteger[]
	'uint8[]': TaggedPositiveInteger[]
	'uint16[]': TaggedPositiveInteger[]
	'uint32[]': TaggedPositiveInteger[]
	'string[]': string[]
}[T]

type NumberConstraints = {
	min?: number
	max?: number
}

type StringConstraints = {
	minLength?: number
	maxLength?: number
	pattern?: RegExp
}

type ArrayConstraints<T extends NumberType | StringType> = {
	minLength?: number
	maxLength?: number
	valueConstraints?: Constraints<T>
}

type NumberField<T extends NumberType> = (
	| { type: T; default?: undefined } // optional == false
	| { type: T; default: number }
	| { type: T; optional: true }
) &
	NumberConstraints

type StringField = (
	| { type: StringType; default?: undefined } // optional == false
	| { type: StringType; default: string }
	| { type: StringType; optional: true }
) &
	StringConstraints

type ArrayField<T extends NumberType | StringType> = (
	| { type: ArrayType; default?: undefined } // optional == false
	| { type: ArrayType; default: TMapper<`${T}[]`> }
	| { type: ArrayType; optional: true }
) &
	ArrayConstraints<T>

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
	int54: NumberConstraints
	uint8: NumberConstraints
	uint16: NumberConstraints
	uint32: NumberConstraints
	string: StringConstraints
	boolean: NonNullable<unknown>
	'float32[]': ArrayConstraints<'float32'>
	'float64[]': ArrayConstraints<'float64'>
	'int8[]': ArrayConstraints<'int8'>
	'int16[]': ArrayConstraints<'int16'>
	'int32[]': ArrayConstraints<'int32'>
	'int54[]': ArrayConstraints<'int54'>
	'uint8[]': ArrayConstraints<'uint8'>
	'uint16[]': ArrayConstraints<'uint16'>
	'uint32[]': ArrayConstraints<'uint32'>
	'string[]': ArrayConstraints<'string'>
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
		| ArrayField<NumberType>
		| ArrayField<StringType>
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

export class SafeEnvError extends Error {
	constructor(message: string, opts?: ErrorOptions) {
		super(message, opts)
		this.name = 'SafeEnvError'
	}
}

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

const checkArray = <const NT extends StringType | NumberType>(
	value: unknown,
	fieldName: string,
	nestedType: NT,
	constraints: ArrayConstraints<NT>,
	forDefault: boolean,
): void => {
	if (!Array.isArray(value)) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must be an array`
				: `Environment variable "${fieldName}" must be an array`,
		)
	}
	if (
		constraints.maxLength !== undefined &&
		value.length > constraints.maxLength
	) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must have at most ${constraints.maxLength} elements`
				: `Environment variable "${fieldName}" must have at most ${constraints.maxLength} elements`,
		)
	}

	if (
		constraints.minLength !== undefined &&
		value.length < constraints.minLength
	) {
		throw new SafeEnvError(
			forDefault
				? `Default value for "${fieldName}" must have at least ${constraints.minLength} elements`
				: `Environment variable "${fieldName}" must have at least ${constraints.minLength} elements`,
		)
	}
	for (const [i, v] of value.entries()) {
		validateValue(
			forDefault,
			`${fieldName}[${i}]`,
			nestedType,
			v,
			constraints.valueConstraints ?? {},
		)
	}
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

// biome-ignore lint/suspicious/noEmptyBlockStatements: We need this to ensure that the switch statement is exhaustive
const exhaustiveGuard = (_v: never): void => {}

/**
 * Extra runtime validations to cover cases that can't be covered by the type
 * system or the schema validation.
 */
function validateValue<const D extends boolean, const T extends AllType>(
	forDefault: D,
	fieldName: string,
	type: T,
	value: D extends true ? TMapper<T> : unknown,
	constraints: Constraints<T>,
): void {
	let v: unknown
	try {
		v = forDefault
			? value
			: typeof value === 'string'
				? numberTypes.includes(type as NumberType)
					? Number.parseFloat(value)
					: arrayTypes.includes(type as ArrayType)
						? JSON.parse(value)
						: value
				: value
	} catch (e) {
		throw new SafeEnvError(
			`Environment variable "${fieldName}" must be a valid JSON array`,
			{ cause: e },
		)
	}

	const min = 'min' in constraints ? constraints.min : Number.NEGATIVE_INFINITY
	const max = 'max' in constraints ? constraints.max : Number.POSITIVE_INFINITY

	// For now we only check integer types
	switch (type) {
		case 'int8': {
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
		}
		case 'int8[]': {
			checkArray(
				v,
				fieldName,
				'int8',
				constraints as ArrayConstraints<'int8'>,
				forDefault,
			)
			return
		}
		case 'int16': {
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
		}
		case 'int16[]': {
			checkArray(
				v,
				fieldName,
				'int16',
				constraints as ArrayConstraints<'int16'>,
				forDefault,
			)
			return
		}
		case 'int32': {
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
		}
		case 'int32[]': {
			checkArray(
				v,
				fieldName,
				'int32',
				constraints as ArrayConstraints<'int32'>,
				forDefault,
			)
			return
		}
		case 'int54': {
			if (checkInteger(v, fieldName, forDefault)) {
				checkBetween(
					v,
					Math.max(-9007199254740991, min),
					Math.min(9007199254740991, max),
					fieldName,
					forDefault,
				)
			}
			return
		}
		case 'int54[]': {
			checkArray(
				v,
				fieldName,
				'int54',
				constraints as ArrayConstraints<'int54'>,
				forDefault,
			)
			return
		}
		case 'uint8': {
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
		}
		case 'uint8[]': {
			checkArray(
				v,
				fieldName,
				'uint8',
				constraints as ArrayConstraints<'uint8'>,
				forDefault,
			)
			return
		}
		case 'uint16': {
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
		}
		case 'uint16[]': {
			checkArray(
				v,
				fieldName,
				'uint16',
				constraints as ArrayConstraints<'uint16'>,
				forDefault,
			)
			return
		}
		case 'uint32': {
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
		}
		case 'uint32[]': {
			checkArray(
				v,
				fieldName,
				'uint32',
				constraints as ArrayConstraints<'uint32'>,
				forDefault,
			)
			return
		}
		case 'float32': {
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
		}
		case 'float32[]': {
			checkArray(
				v,
				fieldName,
				'float32',
				constraints as ArrayConstraints<'float32'>,
				forDefault,
			)
			return
		}
		case 'float64': {
			if (checkFloat(v, fieldName, forDefault)) {
				checkBetween(v, min, max, fieldName, forDefault)
			}
			return
		}
		case 'float64[]': {
			checkArray(
				v,
				fieldName,
				'float64',
				constraints as ArrayConstraints<'float64'>,
				forDefault,
			)
			return
		}
		case 'string': {
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
							? `Default value for "${fieldName}" must have length between ${minLength} and ${maxLength} characters`
							: `Environment variable "${fieldName}" must have length between ${minLength} and ${maxLength} characters`,
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
		}
		case 'string[]': {
			checkArray(
				v,
				fieldName,
				'string',
				constraints as ArrayConstraints<'string'>,
				forDefault,
			)
			return
		}
		case 'boolean': {
			// We only need to check environment variables, default values will always be correct
			if (!forDefault && v !== 'true' && v !== 'false') {
				throw new SafeEnvError(
					`Environment variable "${fieldName}" must be a boolean`,
				)
			}
			return
		}
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

	const errors: unknown[] = []

	// Verify Defaults
	for (const key of Object.getOwnPropertyNames(schema)) {
		try {
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
				} else if (arrayTypes.includes(rule.type as ArrayType)) {
					validateValue(false, key, rule.type, envValue, rule)
					_env[key] = JSON.parse(envValue)
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
		} catch (err) {
			errors.push(err)
		}
	}

	if (errors.length === 1) {
		throw errors[0]
	}
	if (errors.length > 1) {
		throw new AggregateError(
			errors,
			'Multiple errors occurred while processing environment variables',
		)
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
