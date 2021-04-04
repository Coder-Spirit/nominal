import { __BaseType, __Brand, __TypeTags } from './Symbols'

export type BrandMarker<BaseType, Brand extends string | symbol> = {
  readonly [__BaseType]: BaseType
  readonly [__Brand]: Brand
}

export type FlavorMarker<BaseType, Flavor extends string | symbol> = {
  readonly [__BaseType]?: BaseType
  readonly [__Brand]?: Flavor
}

export type TagsMarker<BaseType, TypeTags> = {
  readonly [__BaseType]: BaseType
  readonly [__TypeTags]: TypeTags
}
