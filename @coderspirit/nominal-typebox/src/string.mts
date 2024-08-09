import type { FastBrand } from '@coderspirit/nominal'
import type { Kind, StringOptions, TSchema } from '@sinclair/typebox'
import { String as TBString } from '@sinclair/typebox'

export interface BrandedStringSchema<B extends string>
	extends TSchema,
		StringOptions {
	// Copied from TString
	[Kind]: 'String'
	type: 'string'

	// Our sauce
	static: FastBrand<string, B>
}

export const brandedString = <const B extends string>(
	options?: StringOptions,
): BrandedStringSchema<B> => {
	return TBString(options) as BrandedStringSchema<B>
}
