import { SimpleTypeTag } from './internal/UtilTypes'
import { TagsMarker } from './internal/TagsMarker'

export type WithTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 & TagsMarker<BaseType0, TypeTags0 & SimpleTypeTag<TypeTag>>
  : BaseType & TagsMarker<BaseType, SimpleTypeTag<TypeTag>>
