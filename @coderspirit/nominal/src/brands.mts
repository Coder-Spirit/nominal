import type {
	BaseTypeMarker,
	BrandMarker,
	BrandType,
	FlavorMarker,
	WeakBaseTypeMarker,
} from './internal/markers.mts'
import type { PreservePropertyMarkers } from './internal/preservers.mts'

/**
 * It adds a brand to the passed base type, erasing previous brands or flavors,
 * and preserving "properties".
 * @see {WithFlavor}
 */
export type WithBrand<
	BaseType,
	Brand extends BrandType,
> = BaseType extends BaseTypeMarker<infer TrueBaseType>
	? BrandMarker<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
	: BaseType extends WeakBaseTypeMarker<infer TrueBaseType>
		? BrandMarker<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
		: BrandMarker<BaseType, Brand> & PreservePropertyMarkers<BaseType>

/**
 * It adds a flavor to the passed base type, erasing previous brands or flavors,
 * and preserving "properties".
 * @see {WithBrand}
 */
export type WithFlavor<
	BaseType,
	Brand extends BrandType,
> = BaseType extends BaseTypeMarker<infer TrueBaseType>
	? FlavorMarker<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
	: BaseType extends WeakBaseTypeMarker<infer TrueBaseType>
		? FlavorMarker<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
		: FlavorMarker<BaseType, Brand> & PreservePropertyMarkers<BaseType>

/**
 * It strips away brands and flavors from the passed base type.
 * @see {WithBrand}
 * @see {WithFlavor}
 */
export type WithoutBrand<BaseType> = BaseType extends BaseTypeMarker<
	infer TrueBaseType
>
	? PreservePropertyMarkers<BaseType> & TrueBaseType
	: BaseType extends WeakBaseTypeMarker<infer TrueBaseType>
		? PreservePropertyMarkers<BaseType> & TrueBaseType
		: BaseType
