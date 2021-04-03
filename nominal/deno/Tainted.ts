import { GenericTainted } from './GenericTainted.ts';
import { TaintSymbolType } from './internal/Symbols.ts';

export type Tainted<BaseType> = GenericTainted<BaseType, TaintSymbolType>
