import { SimpleTypeTag } from './internal/UtilTypes'
import { WithTag } from './WithTag'

export type GenericTainted<
  BaseType,
  TaintTag extends string | symbol
> = BaseType extends {
  __baseType: infer BaseType0
  __typeTags: infer TypeTags0
}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ? BaseType0 extends Partial<Record<infer _K, infer _V>>
    ? BaseType0 extends
        | undefined
        | null
        | boolean
        | number
        | bigint
        | string
        | symbol
        | Date
      ? BaseType0 & {
          __baseType: BaseType0
          __typeTags: TypeTags0 & SimpleTypeTag<TaintTag>
        }
      : { [P in keyof BaseType0]: GenericTainted<BaseType0[P], TaintTag> } & {
          __baseType: {
            [P in keyof BaseType0]: GenericTainted<BaseType0[P], TaintTag>
          }
          __typeTags: TypeTags0 & SimpleTypeTag<TaintTag>
        }
    : BaseType0 & {
        __baseType: BaseType0
        __typeTags: TypeTags0 & SimpleTypeTag<TaintTag>
      }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : BaseType extends Partial<Record<infer _K, infer _V>>
  ? BaseType extends
      | undefined
      | null
      | boolean
      | number
      | bigint
      | string
      | symbol
      | Date
    ? WithTag<BaseType, TaintTag>
    : WithTag<
        { [P in keyof BaseType]: GenericTainted<BaseType[P], TaintTag> },
        TaintTag
      >
  : WithTag<BaseType, TaintTag>
