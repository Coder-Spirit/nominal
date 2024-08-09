import type { __Impossible } from '@coderspirit/nominal-symbols'
import type { FastBrand, FastFlavor, FastProperty } from './markers.mts'

/**
 * It helps us to preserve brand-like markers
 */
export type PreserveBrandlikeMarkers<BaseType> = BaseType extends FastBrand<
	infer TrueBaseType,
	infer Brand
>
	? FastBrand<TrueBaseType, Brand>
	: BaseType extends FastFlavor<infer TrueBaseType, infer Flavor>
		? __Impossible extends Flavor
			? unknown
			: FastFlavor<TrueBaseType, Flavor>
		: never

/**
 * It helps us to preserve property markers
 */
export type PreservePropertyMarkers<BaseType> = BaseType extends FastProperty<
	infer TrueBaseType,
	infer Properties
>
	? FastProperty<TrueBaseType, Properties>
	: unknown
