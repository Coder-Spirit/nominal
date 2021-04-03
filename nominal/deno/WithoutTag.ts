import { SimpleTypeTag } from './internal/UtilTypes.ts';
import { TagsMarker } from './internal/TagsMarker.ts';

export type WithoutTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? TagsMarker<BaseType0, SimpleTypeTag<TypeTag>> extends TagsMarker<
      BaseType0,
      TypeTags0
    >
    ? BaseType0
    : BaseType0 &
        TagsMarker<
          BaseType0,
          TypeTags0 extends SimpleTypeTag<TypeTag> & infer RestTypeTags
            ? RestTypeTags
            : Omit<TypeTags0, TypeTag>
        >
  : BaseType
