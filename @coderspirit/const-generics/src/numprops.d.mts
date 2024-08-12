export type IsPositive<N extends number> = `${N}` extends `-${string}`
	? false
	: N extends 0
		? false
		: true

export type IsNegative<N extends number> = `${N}` extends `-${string}`
	? true
	: false

export type IsInteger<N extends number> = `${N}` extends `${bigint}`
	? true
	: false
