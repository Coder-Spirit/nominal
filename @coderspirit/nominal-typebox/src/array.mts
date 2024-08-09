import type { FastBrand } from '@coderspirit/nominal'
import type { ArrayOptions, Kind, TArray, TSchema } from '@sinclair/typebox'
import { Array as TBArray } from '@sinclair/typebox'

export interface BrandedArraySchema<
	B extends string,
	S extends TSchema,
	A extends TArray<S>,
> extends TSchema,
		ArrayOptions {
	// We cannot rely on `&`, `extends` or generics here, because that would
	// impose too much work on the type inference engine.

	// Copied from TArray
	[Kind]: 'Array'
	type: 'array'
	items: S

	// Our special sauce
	static: FastBrand<A['static'], B>
}

export const brandedArray = <const B extends string, const S extends TSchema>(
	_b: B,
	schema: S,
	options?: ArrayOptions,
): BrandedArraySchema<B, S, TArray<S>> => {
	// We have to separate declaration and return statement because otherwise
	// TS goes crazy, thinking that there is some kind of type circularity.
	return TBArray(schema, options) as BrandedArraySchema<B, S, TArray<S>>
}
