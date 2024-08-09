import type { FastBrand } from '@coderspirit/nominal'
import type {
	Kind,
	SchemaOptions,
	Static,
	TNever,
	TSchema,
} from '@sinclair/typebox'
import { Union as TBUnion } from '@sinclair/typebox'

import type { BrandedSchema } from './schema.mts'

// Private types
// -----------------------------------------------------------------------------
type _UnionStatic<T extends TSchema[], P extends unknown[]> = {
	[K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never
}[number]

interface _BrandedUnionSchema<B extends string, T extends TSchema[] = TSchema[]>
	extends TSchema {
	// Copied from TUnion
	[Kind]: 'Union'
	anyOf: T

	// Our special sauce
	static: FastBrand<_UnionStatic<T, this['params']>, B>
}

// Stuff to be exported
// -----------------------------------------------------------------------------
export type BrandedUnionSchema<
	B extends string,
	T extends TSchema[],
> = T extends []
	? TNever
	: T extends [TSchema]
		? BrandedSchema<B, T[0]>
		: _BrandedUnionSchema<B, T>

export const brandedUnion = <B extends string, T extends TSchema[]>(
	_b: B,
	t: [...T],
	options?: SchemaOptions,
): BrandedUnionSchema<B, T> => {
	return TBUnion(t, options) as BrandedUnionSchema<B, T>
}
