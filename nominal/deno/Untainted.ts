import { GenericUntainted } from './GenericUntainted.ts';
import { TaintSymbolType } from './internal/Symbols.ts';

export type Untainted<BaseType> = GenericUntainted<BaseType, TaintSymbolType>
