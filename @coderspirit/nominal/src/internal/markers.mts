import type {
	__BaseType,
	__Brand,
	__Properties,
} from '@coderspirit/nominal-symbols'

// -----------------------------------------------------------------------------
// Property related types
// -----------------------------------------------------------------------------

export type PropertyKeyType = string | symbol
export type PropertyValueType = boolean | number | string | symbol

/**
 * It encapsulates specific property key-value metadata that will be attached
 * to other types.
 */
export type PropertyWrapper<
	PropertyKey extends PropertyKeyType,
	PropertyValue extends PropertyValueType,
> = {
	readonly [key in PropertyKey]: PropertyValue
}

/**
 * It helps us to construct new types with added properties "metadata".
 */
export type FastProperty<
	BaseType,
	Properties extends PropertyWrapper<PropertyKeyType, PropertyValueType>,
> = BaseType & {
	readonly [__BaseType]: BaseType
	readonly [__Properties]: Properties
}

// -----------------------------------------------------------------------------
// Brand & Flavor related types
// -----------------------------------------------------------------------------

export type BrandType = string | symbol

/**
 * It helps us to construct new branded types.
 */
export type FastBrand<BaseType, Brand extends BrandType> = BaseType & {
	readonly [__BaseType]: BaseType
	readonly [__Brand]: Brand
}

/**
 * It helps us to construct new flavored types.
 */
export type FastFlavor<BaseType, Brand extends BrandType> = BaseType & {
	readonly [__BaseType]?: BaseType
	readonly [__Brand]?: Brand
}

// -----------------------------------------------------------------------------
// Types for Brands & Properties combined (for fast inference)
// -----------------------------------------------------------------------------
export type FastBrandAndProperties<
	BaseType,
	Brand extends BrandType,
	Properties extends PropertyWrapper<PropertyKeyType, PropertyValueType>,
> = BaseType & {
	readonly [__BaseType]: BaseType
	readonly [__Brand]: Brand
	readonly [__Properties]: Properties
}

// -----------------------------------------------------------------------------
// Type inference utils
// -----------------------------------------------------------------------------

/**
 * Useful for type inference purposes
 */
export type FastBaseType<BaseType> = BaseType & {
	readonly [__BaseType]: BaseType
}

/**
 * Useful for type inference purposes
 */
export type FastWeakBaseType<BaseType> = BaseType & {
	readonly [__BaseType]?: BaseType
}

// -----------------------------------------------------------------------------
// Low-level types, for type inference performance on userland
// -----------------------------------------------------------------------------
export type BaseTypeMarker<BaseType> = {
	readonly [__BaseType]: BaseType
}

export type BrandMarker<Brand extends BrandType> = {
	readonly [__Brand]: Brand
}

export type BaseTypeAndBrandMarker<BaseType, Brand extends BrandType> = {
	readonly [__BaseType]: BaseType
	readonly [__Brand]: Brand
}
