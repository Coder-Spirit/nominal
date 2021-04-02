import { GenericTainted } from 'GenericTainted'
import { TaintSymbolType } from 'internal/Symbols'

export type Tainted<BaseType> = GenericTainted<BaseType, TaintSymbolType>
