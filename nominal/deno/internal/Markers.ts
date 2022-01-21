import { __BaseType, __Brand, __Properties } from './Symbols.ts';

// -----------------------------------------------------------------------------
// Property related types
// -----------------------------------------------------------------------------

export type PropertyKeyType = string | symbol
export type PropertyValueType = string | number | boolean | symbol

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
export type PropertiesMarker<
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
export type BrandMarker<BaseType, Brand extends BrandType> = BaseType & {
  readonly [__BaseType]: BaseType
  readonly [__Brand]: Brand
}

/**
 * It helps us to construct new flavored types.
 */
export type FlavorMarker<BaseType, Brand extends BrandType> = BaseType & {
  readonly [__BaseType]?: BaseType
  readonly [__Brand]?: Brand
}

// -----------------------------------------------------------------------------
// Type inference utils
// -----------------------------------------------------------------------------

/**
 * Useful for type inference purposes
 */
export type BaseTypeMarker<BaseType> = BaseType & {
  readonly [__BaseType]: BaseType
}

/**
 * Useful for type inference purposes
 */
export type WeakBaseTypeMarker<BaseType> = BaseType & {
  readonly [__BaseType]?: BaseType
}
