import { GenericTainted } from './GenericTainted'
import { WithoutTag } from './WithoutTag'

export type GenericUntainted<
  BaseType,
  TaintTag extends string | symbol
// eslint-disable-next-line @typescript-eslint/no-unused-vars
> = BaseType extends GenericTainted<infer _Irrelevant, TaintTag>
  ? BaseType extends {
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
        ? WithoutTag<
            BaseType0 & {
              __baseType: BaseType0
              __typeTags: TypeTags0
            },
            TaintTag
          >
        : WithoutTag<
            {
              [P in keyof BaseType0]: GenericUntainted<BaseType0[P], TaintTag>
            } & {
              __baseType: {
                [P in keyof BaseType0]: GenericUntainted<BaseType0[P], TaintTag>
              }
              __typeTags: TypeTags0
            },
            TaintTag
          >
      : WithoutTag<
          BaseType0 & {
            __baseType: BaseType0
            __typeTags: TypeTags0
          },
          TaintTag
        >
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
      ? WithoutTag<BaseType, TaintTag>
      : WithoutTag<
          { [P in keyof BaseType]: GenericUntainted<BaseType[P], TaintTag> },
          TaintTag
        >
    : WithoutTag<BaseType, TaintTag>
  : BaseType
