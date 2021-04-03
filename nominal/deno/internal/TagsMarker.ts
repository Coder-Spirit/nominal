import { __BaseType, __TypeTags } from './Symbols.ts';

export type TagsMarker<BaseType, TypeTags> = {
  readonly [__BaseType]: BaseType
  readonly [__TypeTags]: TypeTags
}
