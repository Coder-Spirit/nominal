import { ManyTagsWrapper } from './internal/TagUtils.ts';
import { TagsMarker } from './internal/Markers.ts';

export type WithTags<
  BaseType,
  TypeTags extends (string | symbol)[]
> = BaseType extends TagsMarker<infer BaseType0, infer TypeTags0>
  ? BaseType0 & TagsMarker<BaseType0, TypeTags0 & ManyTagsWrapper<TypeTags>>
  : BaseType & TagsMarker<BaseType, ManyTagsWrapper<TypeTags>>
