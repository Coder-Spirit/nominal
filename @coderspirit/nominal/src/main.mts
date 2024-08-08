export type {
	KeepProperties,
	KeepPropertyIfValueMatches,
	PropertyTypeDefinition,
	WithStrictProperty,
	WithProperty,
} from './properties.mts'

export type { WithBrand, WithFlavor, WithoutBrand } from './brands.mts'

export type {
	BrandMarker as FastBrand,
	FlavorMarker as FastFlavor,
	PropertiesMarker as FastProperty,
} from './internal/markers.mts'
