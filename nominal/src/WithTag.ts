import { TagWrapper } from './internal/TagUtils'
import { TagsMarker } from './internal/Markers'

export type WithTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 & TagsMarker<BaseType0, TypeTags0 & TagWrapper<TypeTag>>
  : BaseType & TagsMarker<BaseType, TagWrapper<TypeTag>>
