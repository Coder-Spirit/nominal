import { SimpleTypeTag } from './internal/UtilTypes'
import { TagsMarker } from './internal/TagsMarker'
import { WithTag } from './WithTag'

export type GenericTainted<
  BaseType,
  TaintTag extends string | symbol
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    BaseType0 extends Partial<Record<infer _K, infer _V>>
    ? BaseType0 extends
        | undefined
        | null
        | boolean
        | number
        | bigint
        | string
        | symbol
        | Date
      ? BaseType0 & TagsMarker<BaseType0, TypeTags0 & SimpleTypeTag<TaintTag>>
      : { [P in keyof BaseType0]: GenericTainted<BaseType0[P], TaintTag> } &
          TagsMarker<
            {
              [P in keyof BaseType0]: GenericTainted<BaseType0[P], TaintTag>
            },
            TypeTags0 & SimpleTypeTag<TaintTag>
          >
    : BaseType0 & TagsMarker<BaseType0, TypeTags0 & SimpleTypeTag<TaintTag>>
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  BaseType extends Partial<Record<infer _K, infer _V>>
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
