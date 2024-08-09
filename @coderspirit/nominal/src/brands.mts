import type {
	BrandType,
	FastBaseType,
	FastBrand,
	FastFlavor,
	FastWeakBaseType,
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
> = BaseType extends FastBaseType<infer TrueBaseType>
	? FastBrand<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
	: BaseType extends FastWeakBaseType<infer TrueBaseType>
		? FastBrand<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
		: FastBrand<BaseType, Brand> & PreservePropertyMarkers<BaseType>

/**
 * It adds a flavor to the passed base type, erasing previous brands or flavors,
 * and preserving "properties".
 * @see {WithBrand}
 */
export type WithFlavor<
	BaseType,
	Brand extends BrandType,
> = BaseType extends FastBaseType<infer TrueBaseType>
	? FastFlavor<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
	: BaseType extends FastWeakBaseType<infer TrueBaseType>
		? FastFlavor<TrueBaseType, Brand> & PreservePropertyMarkers<BaseType>
		: FastFlavor<BaseType, Brand> & PreservePropertyMarkers<BaseType>

/**
 * It strips away brands and flavors from the passed base type.
 * @see {WithBrand}
 * @see {WithFlavor}
 */
export type WithoutBrand<BaseType> = BaseType extends FastBaseType<
	infer TrueBaseType
>
	? PreservePropertyMarkers<BaseType> & TrueBaseType
	: BaseType extends FastWeakBaseType<infer TrueBaseType>
		? PreservePropertyMarkers<BaseType> & TrueBaseType
		: BaseType
