import { __BaseType, __TypeTags } from './Symbols'

export type TagsMarker<BaseType, TypeTags> = {
  readonly [__BaseType]: BaseType
  readonly [__TypeTags]: TypeTags
}
