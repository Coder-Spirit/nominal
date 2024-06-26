import type { __Impossible } from '@coderspirit/nominal-symbols'
import type { BrandMarker, FlavorMarker, PropertiesMarker } from './Markers'

/**
 * It helps us to preserve brand-like markers
 */
export type PreserveBrandlikeMarkers<BaseType> = BaseType extends BrandMarker<
	infer TrueBaseType,
	infer Brand
>
	? BrandMarker<TrueBaseType, Brand>
	: BaseType extends FlavorMarker<infer TrueBaseType, infer Flavor>
		? __Impossible extends Flavor
			? unknown
			: FlavorMarker<TrueBaseType, Flavor>
		: never

/**
 * It helps us to preserve property markers
 */
export type PreservePropertyMarkers<BaseType> =
	BaseType extends PropertiesMarker<infer TrueBaseType, infer Properties>
		? PropertiesMarker<TrueBaseType, Properties>
		: unknown
