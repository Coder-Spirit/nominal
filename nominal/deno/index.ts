export type {
  KeepProperties,
  KeepPropertyIfValueMatches,
  PropertyTypeDefinition,
  WithStrictProperty,
  WithProperty,
} from './Properties.ts';

export type { WithBrand, WithFlavor, WithoutBrand } from './Brands.ts';
export type {
  BrandMarker as FastBrand,
  FlavorMarker as FastFlavor,
  PropertiesMarker as FastProperty,
} from './internal/Markers.ts';
