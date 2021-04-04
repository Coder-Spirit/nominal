import { TagsMarker } from './internal/Markers'
import { WithoutTag } from './WithoutTag'

export type WithoutTags<
  BaseType,
  TypeTags extends (string | symbol)[] | null = null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = BaseType extends TagsMarker<infer BaseType0, infer _TypeTags0>
  ? TypeTags extends null
    ? BaseType0
    : TypeTags extends [infer TypeTag0, ...infer OtherTypeTags]
    ? TypeTag0 extends string | symbol
      ? OtherTypeTags extends (string | symbol)[]
        ? WithoutTags<WithoutTag<BaseType, TypeTag0>, OtherTypeTags>
        : never
      : never
    : TypeTags extends [infer TypeTag0]
    ? TypeTag0 extends string | symbol
      ? WithoutTag<BaseType, TypeTag0>
      : never
    : BaseType
  : BaseType
