import {
  BaseTypeMarker,
  BrandMarker,
  BrandType,
  FlavorMarker,
  WeakBaseTypeMarker,
} from './internal/Markers.ts';
import { PreservePropertyMarkers } from './internal/Preservers.ts';

/**
 * It adds a brand to the passed base type, erasing previous brands or flavors,
 * and preserving "properties".
 * @see {WithFlavor}
 */
export type WithBrand<
  BaseType,
  Brand extends BrandType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  ? TrueBaseType & PreservePropertyMarkers<BaseType>
  : BaseType extends WeakBaseTypeMarker<infer TrueBaseType>
  ? TrueBaseType & PreservePropertyMarkers<BaseType>
  : BaseType
