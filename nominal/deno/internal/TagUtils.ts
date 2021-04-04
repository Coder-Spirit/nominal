export type TagWrapper<TypeTag extends string | symbol> = {
  readonly [key in TypeTag]: TypeTag
}

export type NegatedTagWrapper<TypeTag extends string | symbol> = {
  readonly [key in TypeTag]?: null // It cannot be never, since it extends from everything
}

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
