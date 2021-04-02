import { GenericUntainted } from './GenericUntainted'
import { TaintSymbolType } from './internal/Symbols'

export type Untainted<BaseType> = GenericUntainted<BaseType, TaintSymbolType>
