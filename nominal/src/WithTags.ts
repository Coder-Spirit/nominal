import { CompoundTypeTags } from './internal/UtilTypes'
import { TagsMarker } from './internal/TagsMarker'

export type WithTags<
  BaseType,
  TypeTags extends (string | symbol)[]
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 & TagsMarker<BaseType0, TypeTags0 & CompoundTypeTags<TypeTags>>
  : BaseType & TagsMarker<BaseType, CompoundTypeTags<TypeTags>>
