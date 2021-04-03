import { GenericTainted } from './GenericTainted'
import { NegateTag } from './NegateTag'
import { TagsMarker } from './internal/TagsMarker'

export type GenericUntainted<
  BaseType,
  TaintTag extends string | symbol
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = BaseType extends GenericTainted<infer _Irrelevant, TaintTag>
  ? BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
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
        ? NegateTag<BaseType0 & TagsMarker<BaseType0, TypeTags0>, TaintTag>
        : NegateTag<
            {
              [P in keyof BaseType0]: GenericUntainted<BaseType0[P], TaintTag>
            } &
              TagsMarker<
                {
                  [P in keyof BaseType0]: GenericUntainted<
                    BaseType0[P],
                    TaintTag
                  >
                },
                TypeTags0
              >,
            TaintTag
          >
      : NegateTag<BaseType0 & TagsMarker<BaseType0, TypeTags0>, TaintTag>
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
      ? NegateTag<BaseType, TaintTag>
      : NegateTag<
          { [P in keyof BaseType]: GenericUntainted<BaseType[P], TaintTag> },
          TaintTag
        >
    : NegateTag<BaseType, TaintTag>
  : BaseType
