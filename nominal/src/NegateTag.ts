import { NegatedTagWrapper, TagWrapper } from './internal/TagUtils'
import { OptionalTagsMarker, TagsMarker } from './internal/Markers'

export type NegateTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? NegateTagInternals<BaseType0, TypeTags0, TypeTag>
  : BaseType extends OptionalTagsMarker<infer BaseType0, infer TypeTags0>
  ? NegateTagInternals<BaseType0, TypeTags0, TypeTag>
  : BaseType & Partial<TagsMarker<BaseType, NegatedTagWrapper<TypeTag>>>

type NegateTagInternals<
  BaseType0,
  TypeTags0,
  TypeTag extends string | symbol
> = BaseType0 &
  (TagsMarker<BaseType0, TagWrapper<TypeTag>> extends TagsMarker<
    BaseType0,
    TypeTags0
  >
    ? Partial<
        TagsMarker<
          BaseType0,
          TypeTags0 extends TagWrapper<TypeTag> & infer RestTypeTags
            ? RestTypeTags & NegatedTagWrapper<TypeTag>
            : Omit<TypeTags0, TypeTag> & NegatedTagWrapper<TypeTag>
        >
      >
    : TagsMarker<
        BaseType0,
        TypeTags0 extends TagWrapper<TypeTag> & infer RestTypeTags
          ? RestTypeTags & NegatedTagWrapper<TypeTag>
          : Omit<TypeTags0, TypeTag> & NegatedTagWrapper<TypeTag>
      >)
