import { GenericUntainted } from 'GenericUntainted'
import { WithTag } from 'WithTag'

export type GenericSafe<
  BaseType,
  TypeTag extends string | symbol,
  TaintTag extends string | symbol
> = TypeTag extends TaintTag
  ? never
  : WithTag<GenericUntainted<BaseType, TaintTag>, TypeTag>
