import type { FastBrand, FastBrandAndProperties } from '@coderspirit/nominal'
import type { IntegerOptions, NumberOptions, TSchema } from '@sinclair/typebox'
import { Kind } from '@sinclair/typebox'
import { Integer as TBInteger, Number as TBNumber } from '@sinclair/typebox'

export interface BrandedIntegerSchema<B extends string>
	extends TSchema,
		IntegerOptions {
	// Copied from TInteger
	[Kind]: 'Integer'
	type: 'integer'

	// Our sauce
	static: FastBrandAndProperties<number, B, { Fractional: false }>
}

export interface BrandedNumberSchema<B extends string>
	extends TSchema,
		NumberOptions {
	// Copied from TNumber
	[Kind]: 'Number'
	type: 'number'

	// Our sauce
	static: FastBrand<number, B>
}

export const brandedInteger = <const B extends string>(
	options?: IntegerOptions,
): BrandedIntegerSchema<B> => {
	return TBInteger(options) as BrandedIntegerSchema<B>
}

export const brandedNumber = <const B extends string>(
	options?: NumberOptions,
): BrandedNumberSchema<B> => {
	return TBNumber(options) as BrandedNumberSchema<B>
}
