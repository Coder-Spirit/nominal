export type TupleToUnion<T extends (string | symbol)[]> = T extends [
  infer Head,
  ...infer Tail
]
  ? Head | (Tail extends (string | symbol)[] ? TupleToUnion<Tail> : never)
  : never
