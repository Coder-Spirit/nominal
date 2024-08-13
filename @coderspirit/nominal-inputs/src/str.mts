/**
 * Copied from https://gist.github.com/sno2/7dac868ec6d11abb75250ce5e2b36041
 * @author Carter Snook <cartersnook04@gmail.com> github.com/sno2
 * @license https://unlicense.org/
 */

type TCache = [string, 0[]]

type StringLengthUp<
	T extends string,
	$Acc extends 0[] = [],
	$Cache extends TCache[] = [[`$${string}`, [0]]],
> = $Cache extends [
	infer C extends TCache,
	...infer $RestCache extends TCache[],
]
	? (
			`${C[0]}${C[0]}_` extends `$${string}$${infer $After}`
				? `${C[0]}${$After}` extends `${infer $Before}_`
					? $Before
					: never
				: never
		) extends infer $DoubleC extends string
		? `$${T}` extends `${$DoubleC}${infer $Rest}`
			? StringLengthUp<
					$Rest,
					[...$Acc, ...C[1], ...C[1]],
					[[$DoubleC, [...C[1], ...C[1]]], ...$Cache]
				>
			: `$${T}` extends `${C[0]}${infer $Rest}`
				? StringLengthUp<$Rest, [...$Acc, ...C[1]], $Cache>
				: StringLengthDown<T, $Acc, $RestCache>
		: never
	: $Acc['length']

type StringLengthDown<
	T extends string,
	$Acc extends 0[],
	$Cache extends TCache[],
> = $Cache extends [
	infer C extends TCache,
	...infer $RestCache extends TCache[],
]
	? `$${T}` extends `${C[0]}${infer $Rest}`
		? StringLengthDown<$Rest, [...$Acc, ...C[1]], $Cache>
		: StringLengthDown<T, $Acc, $RestCache>
	: $Acc['length']

export type StringLength<S extends string> = S extends ''
	? 0
	: string extends S
		? number
		: number extends S['length']
			? StringLengthUp<S>
			: S['length']
