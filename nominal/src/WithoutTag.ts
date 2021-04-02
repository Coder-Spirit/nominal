import { SimpleTypeNegation, SimpleTypeTag } from './internal/UtilTypes'
import { TagsMarker } from './internal/TagsMarker'

export type WithoutTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 &
      (TagsMarker<BaseType0, SimpleTypeTag<TypeTag>> extends TagsMarker<
        BaseType0,
        TypeTags0
      >
        ? Partial<
            TagsMarker<
              BaseType0,
              TypeTags0 extends SimpleTypeTag<TypeTag> & infer RestTypeTags
                ? RestTypeTags & SimpleTypeNegation<TypeTag>
                : Omit<TypeTags0, TypeTag> & SimpleTypeNegation<TypeTag>
            >
          >
        : TagsMarker<
            BaseType0,
            TypeTags0 extends SimpleTypeTag<TypeTag> & infer RestTypeTags
              ? RestTypeTags & SimpleTypeNegation<TypeTag>
              : Omit<TypeTags0, TypeTag> & SimpleTypeNegation<TypeTag>
          >)
  : BaseType & Partial<TagsMarker<BaseType, SimpleTypeNegation<TypeTag>>>
