

// export type Lt<
// 	A extends ConstGenericNum,
// 	B extends ConstGenericNum,
// > = LtTable[`k${A}_${B}`]

// TODO:
// - Gte
// - Lte

// - Mul
// - Div (integer division)
// - Mod (modulo)
// - Succ (increment)
// - Pred (decrement)
// - Clamp (clamp between two values)
// make variants related to negative numbers, there are may interesting combinations:
// - SmallerNums (4 -> 0 | 1 | 2 | 3)
// - LargerNums (4 -> 5 | 6 | 7 | 8 | 9 | 10 | ...)
// adapt the previous idea for arrays
// - ShorterArrays ([T, T, T] -> [] | [T] | [T, T])
// - LongerArrays ([T, T, T] -> [T, T, T, T] | [T, T, T, T, T])
// represent ranges, or at least some kind of interval
// - Range<2, 5> -> 2 | 3 | 4 | 5
// - LowerBound<Range<2, 5>> -> 2
// - UpperBound<Range<2, 5>> -> 5

// export type ArrayTable<T> = {
// 	s0: []
// 	s1: [T]
// 	s2: [T, T]
// 	s3: [T, T, T]
// }

// export type ExtendedArraytable<T> =  {
// 	s0: T[]
// 	s1: [T, ...(T | undefined)[]] & { length: 1 | 2 | 3 | 4 }
// 	s2: [T, T, ...T[]]
// 	s3: [T, T, T, ...T[]]
// }

// export type ArrayLength<T extends unknown[]> = T['length']

// export type SizedArray<N extends 0 | 1 | 2 | 3, T> = ArrayTable<T>[`s${N}`]
// export type BoundedArray<N extends 0 | 1 | 2 | 3, T> = ExtendedArraytable<T>[`s${N}`]

// type BA2 = BoundedArray<1, number>
// type LBA2 = ArrayLength<BA2>

// export type I0 = BA2[0]
// export type I1 = BA2[1]
// export type I2 = BA2[2]
// export type I3 = BA2[3]
// export type I4 = BA2[4]

// // type SA2 = SizedArray<2, number>

// // export type I0 = SA2[0]
// // export type I1 = SA2[1]
// // export type I2 = SA2[2]
// // export type I3 = SA2[3]
// // export type I4 = SA2[4]

// // function onlyAcceptsIntegers<N extends number>(n: IntegerInput<N>): number {

// function f<V extends number>(v: Exclude<V, 1>): Exclude<number, 1> {
// 	console.log(v)
// 	return v
// }

// // @ts-expect-error
// f(1)
