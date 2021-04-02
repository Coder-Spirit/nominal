import { SimpleTypeNegation, SimpleTypeTag } from './internal/UtilTypes'

export type WithoutTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends {
  __baseType: infer BaseType0
  __typeTags: infer TypeTags0
}
  ? BaseType0 &
      ({ __baseType: BaseType0; __typeTags: SimpleTypeTag<TypeTag> } extends {
        __baseType: BaseType0
        __typeTags: TypeTags0
      }
        ? {
            __baseType?: BaseType0
            __typeTags?: TypeTags0 extends SimpleTypeTag<TypeTag> &
              infer RestTypeTags
              ? RestTypeTags & SimpleTypeNegation<TypeTag>
              : Omit<TypeTags0, TypeTag> & SimpleTypeNegation<TypeTag>
          }
        : {
            __baseType: BaseType0
            __typeTags: TypeTags0 extends SimpleTypeTag<TypeTag> &
              infer RestTypeTags
              ? RestTypeTags & SimpleTypeNegation<TypeTag>
              : Omit<TypeTags0, TypeTag> & SimpleTypeNegation<TypeTag>
          })
  : BaseType & {
      __baseType?: BaseType
      __typeTags?: SimpleTypeNegation<TypeTag>
    }
