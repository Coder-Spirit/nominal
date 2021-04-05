export type TagWrapper<TypeTag extends string | symbol> = {
  readonly [key in TypeTag]: true
}

export type NegatedTagWrapper<TypeTag extends string | symbol> = {
  readonly [key in TypeTag]?: null // It cannot be never, since it extends from everything
}

export type ExtendedTagWrapper<TypeTag extends string | symbol> =
  | TagWrapper<TypeTag>
  | NegatedTagWrapper<TypeTag>

export type ManyTagsWrapper<
  TypeTags extends (string | symbol)[]
> = TypeTags extends [infer TypeTag0, ...infer OtherTypeTags]
  ? TypeTag0 extends string | symbol
    ? TagWrapper<TypeTag0> &
        (OtherTypeTags extends (string | symbol)[]
          ? ManyTagsWrapper<OtherTypeTags>
          : unknown)
    : never
  : unknown

export type MergeTags<
  OldTypeTags,
  NewTypeTags extends (string | symbol)[]
> = NewTypeTags extends [infer TagsHead, ...infer TagsTail]
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TagsTail extends (string | symbol)[] & [infer _Head, ...infer _Tail]
    ? TagsHead extends string | symbol
      ? MergeTags<Omit<OldTypeTags, TagsHead> & TagWrapper<TagsHead>, TagsTail>
      : never
    : TagsHead extends string | symbol
    ? Omit<OldTypeTags, TagsHead> & TagWrapper<TagsHead>
    : never
  : never
