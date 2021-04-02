import { CompoundTypeTags } from './internal/UtilTypes'

export type WithTags<
  BaseType,
  TypeTags extends (string | symbol)[]
> = BaseType extends {
  __baseType: infer BaseType0
  __typeTags: infer TypeTags0
}
  ? BaseType0 & {
      __baseType: BaseType0
      __typeTags: TypeTags0 & CompoundTypeTags<TypeTags>
    }
  : BaseType & {
      __baseType: BaseType
      __typeTags: CompoundTypeTags<TypeTags>
    }
