import { GenericSafe } from './GenericSafe'
import { TaintSymbolType } from './internal/Symbols'

export type Safe<BaseType, TypeTag extends string | symbol> = GenericSafe<
  BaseType,
  TypeTag,
  TaintSymbolType
>
