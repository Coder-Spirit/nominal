import type { FastProperty } from '@coderspirit/nominal'

import type { StringLength } from './str.mts'

// Basic Types (copied from Type-Fest)
// -----------------------------------------------------------------------------
type Numeric = number | bigint
type Zero = 0 | 0n

// "Output" Types
// -----------------------------------------------------------------------------
export type TaggedInteger<N extends Numeric = number> = FastProperty<
	N,
	{ Fractional: false }
>

export type TaggedPositive<N extends Numeric = number> = FastProperty<
	N,
	{ Sign: '+' }
>

export type TaggedNegative<N extends Numeric = number> = FastProperty<
	N,
	{ Sign: '-' }
>

export type TaggedPositiveInteger<N extends Numeric = number> = FastProperty<
	N,
	{ Fractional: false; Sign: '+' }
>

export type TaggedNegativeInteger<N extends Numeric = number> = FastProperty<
	N,
	{ Fractional: false; Sign: '-' }
>

export type TaggedFloat<N extends number = number> = FastProperty<
	N,
	{ Fractional: true }
>

export type TaggedPositiveFloat<N extends number = number> = FastProperty<
	N,
	{ Fractional: true; Sign: '+' }
>

export type TaggedNegativeFloat<N extends number = number> = FastProperty<
	N,
	{ Fractional: true; Sign: '-' }
>

// "Input" Types
// -----------------------------------------------------------------------------
export type IntegerInput<N extends Numeric = number> = N extends TaggedInteger<
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	infer _NN
>
	? N
	: `${N}` extends `${bigint}`
		? N
		: never

export type PositiveInput<N extends Numeric> = N extends TaggedPositive<
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	infer _NN
>
	? N
	: N extends Zero
		? never
		: `${N}` extends `-${string}`
			? never
			: N

export type NegativeInput<N extends Numeric> = N extends TaggedNegative<
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	infer _NN
>
	? N
	: N extends Zero
		? never
		: `${N}` extends `-${string}`
			? N
			: never

export type PositiveIntegerInput<N extends Numeric = number> =
	PositiveInput<N> & IntegerInput<N>

export type NegativeIntegerInput<N extends Numeric = number> =
	NegativeInput<N> & IntegerInput<N>

export type SizedStringInput<
	T extends string,
	N extends number,
> = StringLength<T> extends N ? T : never
