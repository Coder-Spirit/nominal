import { BrandMarker, FlavorMarker, PropertiesMarker } from './Markers'
import { __Impossible } from './Symbols'

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
