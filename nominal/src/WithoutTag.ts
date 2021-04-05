import { TagWrapper } from './internal/TagUtils'
import { TagsMarker } from './internal/Markers'

export type WithoutTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? TagsMarker<BaseType0, TagWrapper<TypeTag>> extends TagsMarker<
      BaseType0,
      TypeTags0
    >
    ? BaseType0
    : BaseType0 &
        TagsMarker<
          BaseType0,
          TypeTags0 extends TagWrapper<TypeTag> & infer RestTypeTags
            ? RestTypeTags
            : Omit<TypeTags0, TypeTag>
        >
  : BaseType
