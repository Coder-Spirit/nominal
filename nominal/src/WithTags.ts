import { ManyTagsWrapper, MergeTags } from './internal/TagUtils'
import { OptionalTagsMarker, TagsMarker } from './internal/Markers'

export type WithTags<
  BaseType,
  TypeTags extends (string | symbol)[]
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 & TagsMarker<BaseType0, MergeTags<TypeTags0, TypeTags>>
  : BaseType extends OptionalTagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 & TagsMarker<BaseType0, MergeTags<TypeTags0, TypeTags>>
  : BaseType & TagsMarker<BaseType, ManyTagsWrapper<TypeTags>>
