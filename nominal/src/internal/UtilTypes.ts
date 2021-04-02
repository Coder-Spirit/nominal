export type SimpleTypeTag<TypeTag extends string | symbol> = {
  [key in TypeTag]: TypeTag
}

export type SimpleTypeNegation<TypeTag extends string | symbol> = {
  [key in TypeTag]?: null // It cannot be never, since it extends from everything
}

export type CompoundTypeTags<
  TypeTags extends (string | symbol)[]
> = TypeTags extends [infer TypeTag0, ...infer OtherTypeTags]
  ? TypeTag0 extends string | symbol
    ? SimpleTypeTag<TypeTag0> &
        (OtherTypeTags extends (string | symbol)[]
          ? CompoundTypeTags<OtherTypeTags>
          : unknown)
    : never
  : unknown
