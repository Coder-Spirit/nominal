import {
  BaseTypeMarker,
  PropertiesMarker,
  PropertyKeyType,
  PropertyValueType,
  PropertyWrapper,
  WeakBaseTypeMarker,
} from './internal/Markers'
import { __PropertyName, __PropertyValues } from './internal/Symbols'
import { PreserveBrandlikeMarkers } from './internal/Preservers'

/**
 * `WithProperty` adds a new property to the passed base type, and it overwrites
 * previous property values in case they were already set.
 * ```
 * // Example:
 * type Even = WithProperty<number, 'Parity', 'Even'>
 * ```
 * @see {WithStrictProperty}
 */
export type WithProperty<
  BaseType,
  PropertyKey extends PropertyKeyType,
  PropertyValue extends PropertyValueType = true // By default we consider binary properties (the property holds or not)
> = BaseType extends PropertiesMarker<infer TrueBaseType, infer Properties>
  ? PropertiesMarker<
      TrueBaseType,
      Omit<Properties, PropertyKey> &
        PropertyWrapper<PropertyKey, PropertyValue>
    > &
      PreserveBrandlikeMarkers<BaseType>
  : BaseType extends BaseTypeMarker<infer TrueBaseType>
  ? PropertiesMarker<
      TrueBaseType,
      PropertyWrapper<PropertyKey, PropertyValue>
    > &
      PreserveBrandlikeMarkers<BaseType>
  : BaseType extends WeakBaseTypeMarker<infer TrueBaseType>
  ? PropertiesMarker<
      TrueBaseType,
      PropertyWrapper<PropertyKey, PropertyValue>
    > &
      PreserveBrandlikeMarkers<BaseType>
  : PropertiesMarker<BaseType, PropertyWrapper<PropertyKey, PropertyValue>> &
      PreserveBrandlikeMarkers<BaseType>

/**
 * It helps to provide a strict definition of a property, delimiting which
 * values it does accept.
 * ```
 * // Example:
 * type Parity = PropertyTypeDefinition<'Parity', 'Odd' | 'Even'>
 * type Even = WithStrictProperty<number, Parity, 'Even'>
 * ```
 * @see {WithStrictProperty}
 */
export type PropertyTypeDefinition<
  PropertyName extends PropertyKeyType,
  AcceptedValues extends PropertyValueType
> = {
  readonly [__PropertyName]: PropertyName
  readonly [__PropertyValues]: AcceptedValues
}

/**
 * Similar to `WithProperty`, but it enforces that properties have only accepted
 * values.
 * ```
 * // Example:
 * type Parity = PropertyTypeDefinition<'Parity', 'Odd' | 'Even'>
 * type Even = WithStrictProperty<number, Parity, 'Even'>
 * ```
 * @see {WithProperty}
 * @see {PropertyTypeDefinition}
 */
export type WithStrictProperty<
  BaseType,
  PropertyType,
  PropertyValue extends PropertyValueType
> = PropertyType extends PropertyTypeDefinition<
  infer PropertyName,
  infer AcceptedValues
>
  ? PropertyValue extends AcceptedValues
    ? PropertyValue extends never
      ? never
      : WithProperty<BaseType, PropertyName, PropertyValue>
    : never
  : never

/**
 * It strips away from `BaseType` all properties not specified in
 * `PropertyKeys`. It preserves brands, flavors.
 * @see {KeepPropertyIfValueMatches}
 */
export type KeepProperties<
  BaseType,
  PropertyKeys extends PropertyKeyType
> = BaseType extends PropertiesMarker<infer TrueBaseType, infer Properties>
  ? PropertiesMarker<TrueBaseType, Pick<Properties, PropertyKeys>> &
      PreserveBrandlikeMarkers<BaseType>
  : BaseType

/**
 * It preserves the property specified by `PropertyKey` only if its value
 * matches one of the provided values in `Propertyvalues`.
 * @see {KeepProperties}
 */
export type KeepPropertyIfValueMatches<
  BaseType,
  PropertyKey extends PropertyKeyType,
  PropertyValues extends PropertyValueType
> = BaseType extends PropertiesMarker<infer TrueBaseType, infer Properties>
  ? Properties extends PropertyWrapper<PropertyKey, PropertyValueType>
    ? Properties[PropertyKey] extends PropertyValues
      ? BaseType
      : PropertyWrapper<PropertyKey, Properties[PropertyKey]> extends Properties
      ? TrueBaseType & PreserveBrandlikeMarkers<BaseType>
      : PropertiesMarker<TrueBaseType, Omit<Properties, PropertyKey>> &
          PreserveBrandlikeMarkers<BaseType>
    : BaseType
  : BaseType
