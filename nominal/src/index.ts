/* eslint-disable @typescript-eslint/no-unused-vars */

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

export type GenericTainted<
  BaseType,
  TaintTag extends string | symbol
> = BaseType extends {
  __baseType: infer BaseType0
  __typeTags: infer TypeTags0
}
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
      : { [P in keyof BaseType0]: Tainted<BaseType0[P]> } & {
          __baseType: { [P in keyof BaseType0]: Tainted<BaseType0[P]> }
          __typeTags: TypeTags0 & SimpleTypeTag<TaintTag>
        }
    : BaseType0 & {
        __baseType: BaseType0
        __typeTags: TypeTags0 & SimpleTypeTag<TaintTag>
      }
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
    : WithTag<{ [P in keyof BaseType]: Tainted<BaseType[P]> }, TaintTag>
  : WithTag<BaseType, TaintTag>

export const TaintSymbol: unique symbol = Symbol('TaintSymbol')
export type Tainted<BaseType> = GenericTainted<BaseType, typeof TaintSymbol>

export type GenericUntainted<
  BaseType,
  TaintTag extends string | symbol
> = BaseType extends Tainted<infer _Irrelevant>
  ? BaseType extends {
      __baseType: infer BaseType0
      __typeTags: infer TypeTags0
    }
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
            { [P in keyof BaseType0]: Untainted<BaseType0[P]> } & {
              __baseType: { [P in keyof BaseType0]: Untainted<BaseType0[P]> }
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
      : WithoutTag<{ [P in keyof BaseType]: Untainted<BaseType[P]> }, TaintTag>
    : WithoutTag<BaseType, TaintTag>
  : BaseType

export type Untainted<BaseType> = GenericUntainted<BaseType, typeof TaintSymbol>

export type GenericSafe<
  BaseType,
  TypeTag extends string | symbol,
  TaintTag extends string | symbol
> = TypeTag extends TaintTag
  ? never
  : WithTag<GenericUntainted<BaseType, TaintTag>, TypeTag>

export type Safe<BaseType, TypeTag extends string | symbol> = GenericSafe<
  BaseType,
  TypeTag,
  typeof TaintSymbol
>

type SimpleTypeTag<TypeTag extends string | symbol> = {
  [key in TypeTag]: TypeTag
}

type SimpleTypeNegation<TypeTag extends string | symbol> = {
  [key in TypeTag]?: null // It cannot be never, since it extends from everything
}

type CompoundTypeTags<TypeTags extends (string | symbol)[]> = TypeTags extends [
  infer TypeTag0,
  ...infer OtherTypeTags
]
  ? TypeTag0 extends string | symbol
    ? SimpleTypeTag<TypeTag0> &
        (OtherTypeTags extends (string | symbol)[]
          ? CompoundTypeTags<OtherTypeTags>
          : unknown)
    : never
  : unknown
