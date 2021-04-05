import { ExtendedTagWrapper, NegatedTagWrapper, TagWrapper } from './internal/TagUtils.ts';
import { OptionalTagsMarker, TagsMarker } from './internal/Markers.ts';

export type WithTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 &
      TagsMarker<
        BaseType0,
        (TypeTags0 extends ExtendedTagWrapper<TypeTag> & infer TypeTags1
          ? TypeTags1
          : TypeTags0) &
          TagWrapper<TypeTag>
      >
  : BaseType extends OptionalTagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 &
      TagsMarker<
        BaseType0,
        TypeTags0 extends NegatedTagWrapper<TypeTag> & infer TypeTags1
          ? TypeTags1 & TagWrapper<TypeTag>
          : TagWrapper<TypeTag>
      >
  : BaseType & TagsMarker<BaseType, TagWrapper<TypeTag>>
