import type {
	__PropertyName,
	__PropertyValues,
} from '@coderspirit/nominal-symbols'
import type {
	FastBaseType,
	FastProperty,
	FastWeakBaseType,
	PropertyKeyType,
	PropertyValueType,
	PropertyWrapper,
} from './internal/markers.mts'
import type { PreserveBrandlikeMarkers } from './internal/preservers.mts'

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
	PropertyValue extends PropertyValueType = true, // By default we consider binary properties (the property holds or not)
> = BaseType extends FastProperty<infer TrueBaseType, infer Properties>
	? PreserveBrandlikeMarkers<BaseType> &
			FastProperty<
				TrueBaseType,
				Omit<Properties, PropertyKey> &
					PropertyWrapper<PropertyKey, PropertyValue>
			>
	: BaseType extends FastBaseType<infer TrueBaseType>
		? PreserveBrandlikeMarkers<BaseType> &
				FastProperty<TrueBaseType, PropertyWrapper<PropertyKey, PropertyValue>>
		: BaseType extends FastWeakBaseType<infer TrueBaseType>
			? PreserveBrandlikeMarkers<BaseType> &
					FastProperty<
						TrueBaseType,
						PropertyWrapper<PropertyKey, PropertyValue>
					>
			: PreserveBrandlikeMarkers<BaseType> &
					FastProperty<BaseType, PropertyWrapper<PropertyKey, PropertyValue>>

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
	AcceptedValues extends PropertyValueType,
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
	PropertyValue extends PropertyValueType,
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
	PropertyKeys extends PropertyKeyType,
> = BaseType extends FastProperty<infer TrueBaseType, infer Properties>
	? PreserveBrandlikeMarkers<BaseType> &
			FastProperty<TrueBaseType, Pick<Properties, PropertyKeys>>
	: BaseType

/**
 * It preserves the property specified by `PropertyKey` only if its value
 * matches one of the provided values in `Propertyvalues`.
 * @see {KeepProperties}
 */
export type KeepPropertyIfValueMatches<
	BaseType,
	PropertyKey extends PropertyKeyType,
	PropertyValues extends PropertyValueType,
> = BaseType extends FastProperty<infer TrueBaseType, infer Properties>
	? Properties extends PropertyWrapper<PropertyKey, PropertyValueType>
		? Properties[PropertyKey] extends PropertyValues
			? BaseType
			: PropertyWrapper<PropertyKey, Properties[PropertyKey]> extends Properties
				? PreserveBrandlikeMarkers<BaseType> & TrueBaseType
				: PreserveBrandlikeMarkers<BaseType> &
						FastProperty<TrueBaseType, Omit<Properties, PropertyKey>>
		: BaseType
	: BaseType
