import type { FastBrand } from '@coderspirit/nominal'
import type {
	Hint,
	Kind,
	OptionalKind,
	ReadonlyKind,
	TSchema,
} from '@sinclair/typebox'

export type BrandedSchema<B extends string, T extends TSchema> = Pick<
	T,
	| typeof Kind
	| typeof ReadonlyKind
	| typeof OptionalKind
	| typeof Hint
	| '$schema'
	| '$id'
	| 'title'
	| 'description'
	| 'default'
	| 'examples'
	| 'readOnly'
	| 'writeOnly'
	| 'params'
	// We leave out `static` on purpose, but we also loose some other properties
	// that might exist in TSchema subtypes, we can't do anything about it without
	// overcomplicating the code.
> & {
	static: FastBrand<T['static'], B>
}

export const brandedSchema = <const B extends string, S extends TSchema>(
	_b: B,
	schema: S,
): BrandedSchema<B, S> => {
	return schema as BrandedSchema<B, S>
}
