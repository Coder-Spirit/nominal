import { SimpleTypeTag } from 'internal/UtilTypes'

export type WithTag<
  BaseType,
  TypeTag extends string | symbol
> = BaseType extends {
  __baseType: infer BaseType0
  __typeTags: infer TypeTags0
}
  ? BaseType0 & {
      __baseType: BaseType0
      __typeTags: TypeTags0 & SimpleTypeTag<TypeTag>
    }
  : BaseType & {
      __baseType: BaseType
      __typeTags: SimpleTypeTag<TypeTag>
    }
