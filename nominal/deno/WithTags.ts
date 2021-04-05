import { ManyTagsWrapper } from './internal/TagUtils.ts';
import { TagsMarker } from './internal/Markers.ts';
import { TupleToUnion } from './internal/GenericUtils.ts';

export type WithTags<
  BaseType,
  TypeTags extends (string | symbol)[]
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 &
      TagsMarker<
        BaseType0,
        Omit<
          TypeTags0,
          TupleToUnion<TypeTags> extends string | symbol
            ? TupleToUnion<TypeTags>
            : never
        > &
          ManyTagsWrapper<TypeTags>
      >
  : BaseType & TagsMarker<BaseType, ManyTagsWrapper<TypeTags>>
