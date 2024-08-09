import type { FastBrand } from '@coderspirit/nominal'
import type {
	Kind,
	ObjectOptions,
	TObject,
	TProperties,
	TSchema,
} from '@sinclair/typebox'
import { Object as TBObject } from '@sinclair/typebox'

export interface BrandedObjectSchema<
	B extends string,
	T extends TProperties,
	O extends TObject<T>,
> extends TSchema,
		ObjectOptions {
	// We cannot rely on `&`, `extends` or generics here, because that would
	// impose too much work on the type inference engine.

	// Copied from TObject
	[Kind]: 'Object'
	type: 'object'
	properties: T
	required?: string[]

	// Our special sauce
	static: FastBrand<O['static'], B>
}

export const brandedObject = <
	const B extends string,
	const T extends TProperties,
>(
	_b: B,
	properties: T,
	options?: ObjectOptions,
): BrandedObjectSchema<B, T, TObject<T>> => {
	return TBObject(properties, options) as BrandedObjectSchema<B, T, TObject<T>>
}
