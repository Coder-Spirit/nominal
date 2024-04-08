import type {
	KeepProperties,
	KeepPropertyIfValueMatches,
	WithStrictProperty,
} from '../Properties'
import type { PropertyTypeDefinition, WithProperty } from '..'
import type { WithBrand, WithFlavor } from '../Brands'
import { describe, expect, it } from 'vitest'

describe('WithProperty', () => {
	type Even = WithProperty<number, 'Parity', 'Even'>
	type Odd = WithProperty<number, 'Parity', 'Odd'>

	// If we do not specify the property value, is set to `true` by default
	type P1 = WithProperty<number, 'P1'>
	type P2 = WithProperty<number, 'P2'>
	type P1P2 = WithProperty<P1, 'P2'>
	type P2P1 = WithProperty<P2, 'P1'>

	it('does not accept "primitive" types', () => {
		type Number_extends_P1 = number extends P1 ? true : false
		type Number_extends_P2 = number extends P2 ? true : false

		const _Number_extends_P1: Number_extends_P1 = false
		const _Number_extends_P2: Number_extends_P2 = false

		expect(_Number_extends_P1).toBe(false)
		expect(_Number_extends_P2).toBe(false)
	})

	it('does not accept values with different value for same property', () => {
		type Even_extends_Odd = Even extends Odd ? true : false
		type Odd_extends_Even = Odd extends Even ? true : false

		const _Even_extends_Odd: Even_extends_Odd = false
		const _Odd_extends_Even: Odd_extends_Even = false

		expect(_Even_extends_Odd).toBe(false)
		expect(_Odd_extends_Even).toBe(false)
	})

	it('is additive', () => {
		type P1P2_extends_P1 = P1P2 extends P1 ? true : false
		type P2P1_extends_P1 = P2P1 extends P1 ? true : false
		type P1P2_extends_P2 = P1P2 extends P2 ? true : false
		type P2P1_extends_P2 = P2P1 extends P2 ? true : false

		const _P1P2_extends_P1: P1P2_extends_P1 = true
		const _P2P1_extends_P1: P2P1_extends_P1 = true
		const _P1P2_extends_P2: P1P2_extends_P2 = true
		const _P2P1_extends_P2: P2P1_extends_P2 = true

		expect(_P1P2_extends_P1).toBe(true)
		expect(_P2P1_extends_P1).toBe(true)
		expect(_P1P2_extends_P2).toBe(true)
		expect(_P2P1_extends_P2).toBe(true)
	})

	it('is commutative', () => {
		// We need these two intermediate types because TS is not powerful enough to
		// perform the inference in one single step
		type P1P2_extends_P2P1 = P1P2 extends P2P1 ? true : false
		type P2P1_extends_P1P2 = P2P1 extends P1P2 ? true : false

		type IsCommutative = P1P2_extends_P2P1 extends true
			? P2P1_extends_P1P2 extends true
				? true
				: false
			: false

		const _IsCommutative: IsCommutative = true
		expect(_IsCommutative).toBe(true)
	})

	it('is idempotent', () => {
		// Simple case:
		// ------------
		type P1P1 = WithProperty<P1, 'P1'>

		type P1P1_extends_P1 = P1P1 extends P1 ? true : false
		type P1_extends_P1P1 = P1 extends P1P1 ? true : false

		type IsIdempotentA = P1P1_extends_P1 extends true
			? P1_extends_P1P1 extends true
				? true
				: false
			: false

		const _IsIdempotentA: IsIdempotentA = true
		expect(_IsIdempotentA).toBe(true)

		// Complex case:
		// -------------
		type P1P2P1 = WithProperty<P1P2, 'P1'>
		type P1P2P1_extends_P1P2 = P1P2P1 extends P1P2 ? true : false
		type P1P2_extends_P1P2P1 = P1P2 extends P1P2P1 ? true : false

		type IsIdempotentB = P1P2P1_extends_P1P2 extends true
			? P1P2_extends_P1P2P1 extends true
				? true
				: false
			: false

		const isIdempotentB: IsIdempotentB = true
		expect(isIdempotentB).toBe(true)
	})

	it('preserves types across function boundaries', () => {
		// eslint-disable-next-line unicorn/consistent-function-scoping
		function throwIfNotEven<T extends number>(v: T): WithProperty<T, 'Even'> {
			if (v % 2 === 1) {
				throw new Error('Not Even!')
			}
			return v as WithProperty<T, 'Even'>
		}

		// eslint-disable-next-line unicorn/consistent-function-scoping
		function throwIfNotPositive<T extends number>(
			v: T,
		): WithProperty<T, 'Positive'> {
			if (v <= 0) {
				throw new Error('Not positive!')
			}
			return v as WithProperty<T, 'Positive'>
		}

		const v1 = 42
		const v2 = throwIfNotEven(v1)
		const v3 = throwIfNotPositive(v2)

		type V3Type = typeof v3
		type V3Type_extends_Even = V3Type extends WithProperty<number, 'Even'>
			? true
			: false
		type V3Type_extends_Positive = V3Type extends WithProperty<
			number,
			'Positive'
		>
			? true
			: false

		type PreservesTypes = V3Type_extends_Even extends true
			? V3Type_extends_Positive extends true
				? true
				: false
			: false

		const _PreservesTypes: PreservesTypes = true
		expect(_PreservesTypes).toBe(true)
	})

	// eslint-disable-next-line sonarjs/no-duplicate-string
	it('is compatible with brand', () => {
		type Branded = WithBrand<number, 'ACME'>
		type BrandedP1 = WithProperty<Branded, 'P1'>

		type BrandedP1_extends_Branded = BrandedP1 extends Branded ? true : false
		type BrandedP1_extends_P1 = BrandedP1 extends P1 ? true : false

		const _BrandedP1_extends_Branded: BrandedP1_extends_Branded = true
		const _BrandedP1_extends_P1: BrandedP1_extends_P1 = true

		expect(_BrandedP1_extends_Branded).toBe(true)
		expect(_BrandedP1_extends_P1).toBe(true)
	})

	// eslint-disable-next-line sonarjs/no-duplicate-string
	it('is compatible with flavor', () => {
		type Flavored = WithFlavor<number, 'Sweet'>
		type FlavoredP1 = WithProperty<Flavored, 'P1'>

		type FlavoredP1_extendsFlavored = FlavoredP1 extends Flavored ? true : false
		type FlavoredP1_extends_P1 = FlavoredP1 extends P1 ? true : false

		const _FlavoredP1_extends_Flavored: FlavoredP1_extendsFlavored = true
		const _FlavoredP1_extends_P1: FlavoredP1_extends_P1 = true

		expect(_FlavoredP1_extends_Flavored).toBe(true)
		expect(_FlavoredP1_extends_P1).toBe(true)
	})
})

describe('WithStrictProperty', () => {
	type Parity = PropertyTypeDefinition<'Parity', 'Even' | 'Odd'>

	it('rejects invalid property values', () => {
		type WrongType = WithStrictProperty<number, Parity, 'Blue'> // Blue is not in 'Even' | 'Odd'

		type RejectsInvalidPropertyValues = WrongType extends never ? true : false
		const _RejectsInvalidPropertyValues: RejectsInvalidPropertyValues = true

		expect(_RejectsInvalidPropertyValues).toBe(true)
	})

	it('behaves as WithProperty when property value is correct', () => {
		type StrictEven = WithStrictProperty<number, Parity, 'Even'>
		type Even = WithProperty<number, 'Parity', 'Even'>

		type Even_extends_StrictEven = Even extends StrictEven ? true : false
		type StrictEven_extends_Even = StrictEven extends Even ? true : false

		const _Even_extends_StrictEven: Even_extends_StrictEven = true
		const _StrictEven_extends_Even: StrictEven_extends_Even = true

		expect(_Even_extends_StrictEven).toBe(true)
		expect(_StrictEven_extends_Even).toBe(true)
	})
})

describe('KeepProperties', () => {
	type P1 = WithProperty<number, 'P1'>
	type P1P2 = WithProperty<P1, 'P2'>
	type P1P2P3 = WithProperty<P1P2, 'P3'>
	type P2 = WithProperty<number, 'P2'>
	type P2P3 = WithProperty<P2, 'P3'>
	type P3 = WithProperty<number, 'P3'>
	type P3P1 = WithProperty<P3, 'P1'>

	it('keeps only the listed properties', () => {
		type KeepP1P2 = KeepProperties<P1P2P3, 'P1' | 'P2'>
		type KeepP2P3 = KeepProperties<P1P2P3, 'P2' | 'P3'>
		type KeepP3P1 = KeepProperties<P1P2P3, 'P1' | 'P3'>

		type KeepP1P2_extends_P1P2 = KeepP1P2 extends P1P2 ? true : false
		type KeepP1P2_extends_P3 = KeepP1P2 extends P3 ? true : false

		type KeepP2P3_extends_P2P3 = KeepP2P3 extends P2P3 ? true : false
		type KeepP2P3_extends_P1 = KeepP2P3 extends P1 ? true : false

		type KeepP3P1_extends_P3P1 = KeepP3P1 extends P3P1 ? true : false
		type KeepP3P1_extends_P2 = KeepP3P1 extends P2 ? true : false

		const _KeepP1P2_extends_P1P2: KeepP1P2_extends_P1P2 = true
		const _KeepP1P2_extends_P3: KeepP1P2_extends_P3 = false

		const _KeepP2P3_extends_P2P3: KeepP2P3_extends_P2P3 = true
		const _KeepP2P3_extends_P1: KeepP2P3_extends_P1 = false

		const _KeepP3P1_extends_P3P1: KeepP3P1_extends_P3P1 = true
		const _KeepP3P1_extends_P2: KeepP3P1_extends_P2 = false

		expect(_KeepP1P2_extends_P1P2).toBe(true)
		expect(_KeepP1P2_extends_P3).toBe(false)

		expect(_KeepP2P3_extends_P2P3).toBe(true)
		expect(_KeepP2P3_extends_P1).toBe(false)

		expect(_KeepP3P1_extends_P3P1).toBe(true)
		expect(_KeepP3P1_extends_P2).toBe(false)
	})

	it('is compatible with brand', () => {
		type Branded = WithBrand<number, 'ACME'>
		type BrandedP1 = WithProperty<Branded, 'P1'>
		type BrandedP1P2 = WithProperty<BrandedP1, 'P2'>
		type BrandedP1P2P3 = WithProperty<BrandedP1P2, 'P3'>

		type KeepP1P2 = KeepProperties<BrandedP1P2P3, 'P1' | 'P2'>
		type KeepP2P3 = KeepProperties<BrandedP1P2P3, 'P2' | 'P3'>
		type KeepP3P1 = KeepProperties<BrandedP1P2P3, 'P1' | 'P3'>

		type KeepP1P2_extends_P1P2 = KeepP1P2 extends BrandedP1P2 ? true : false
		type KeepP1P2_extends_P3 = KeepP1P2 extends P3 ? true : false
		type KeepP1P2_extends_Branded = KeepP1P2 extends Branded ? true : false

		type KeepP2P3_extends_P2P3 = KeepP2P3 extends P2P3 ? true : false
		type KeepP2P3_extends_P1 = KeepP2P3 extends BrandedP1 ? true : false
		type KeepP2P3_extends_Branded = KeepP2P3 extends Branded ? true : false

		type KeepP3P1_extends_P3P1 = KeepP3P1 extends P3P1 ? true : false
		type KeepP3P1_extends_P2 = KeepP3P1 extends P2 ? true : false
		type KeepP3P1_extends_Branded = KeepP3P1 extends Branded ? true : false

		const _KeepP1P2_extends_P1P2: KeepP1P2_extends_P1P2 = true
		const _KeepP1P2_extends_P3: KeepP1P2_extends_P3 = false
		const _KeepP1P2_extends_Branded: KeepP1P2_extends_Branded = true

		const _KeepP2P3_extends_P2P3: KeepP2P3_extends_P2P3 = true
		const _KeepP2P3_extends_P1: KeepP2P3_extends_P1 = false
		const _KeepP2P3_extends_Branded: KeepP2P3_extends_Branded = true

		const _KeepP3P1_extends_P3P1: KeepP3P1_extends_P3P1 = true
		const _KeepP3P1_extends_P2: KeepP3P1_extends_P2 = false
		const _KeepP3P1_extends_Branded: KeepP3P1_extends_Branded = true

		expect(_KeepP1P2_extends_P1P2).toBe(true)
		expect(_KeepP1P2_extends_P3).toBe(false)
		expect(_KeepP1P2_extends_Branded).toBe(true)

		expect(_KeepP2P3_extends_P2P3).toBe(true)
		expect(_KeepP2P3_extends_P1).toBe(false)
		expect(_KeepP2P3_extends_Branded).toBe(true)

		expect(_KeepP3P1_extends_P3P1).toBe(true)
		expect(_KeepP3P1_extends_P2).toBe(false)
		expect(_KeepP3P1_extends_Branded).toBe(true)
	})

	it('is compatible with flavor', () => {
		type Flavored = WithFlavor<number, 'Sweet'>
		type FlavoredP1 = WithProperty<Flavored, 'P1'>
		type FlavoredP1P2 = WithProperty<FlavoredP1, 'P2'>
		type FlavoredP1P2P3 = WithProperty<FlavoredP1P2, 'P3'>

		type KeepP1P2 = KeepProperties<FlavoredP1P2P3, 'P1' | 'P2'>
		type KeepP2P3 = KeepProperties<FlavoredP1P2P3, 'P2' | 'P3'>
		type KeepP3P1 = KeepProperties<FlavoredP1P2P3, 'P1' | 'P3'>

		type KeepP1P2_extends_P1P2 = KeepP1P2 extends FlavoredP1P2 ? true : false
		type KeepP1P2_extends_P3 = KeepP1P2 extends P3 ? true : false
		type KeepP1P2_extends_Flavored = KeepP1P2 extends Flavored ? true : false

		type KeepP2P3_extends_P2P3 = KeepP2P3 extends P2P3 ? true : false
		type KeepP2P3_extends_P1 = KeepP2P3 extends FlavoredP1 ? true : false
		type KeepP2P3_extends_Flavored = KeepP2P3 extends Flavored ? true : false

		type KeepP3P1_extends_P3P1 = KeepP3P1 extends P3P1 ? true : false
		type KeepP3P1_extends_P2 = KeepP3P1 extends P2 ? true : false
		type KeepP3P1_extends_Flavored = KeepP3P1 extends Flavored ? true : false

		const _KeepP1P2_extends_P1P2: KeepP1P2_extends_P1P2 = true
		const _KeepP1P2_extends_P3: KeepP1P2_extends_P3 = false
		const _KeepP1P2_extends_Flavored: KeepP1P2_extends_Flavored = true

		const _KeepP2P3_extends_P2P3: KeepP2P3_extends_P2P3 = true
		const _KeepP2P3_extends_P1: KeepP2P3_extends_P1 = false
		const _KeepP2P3_extends_Flavored: KeepP2P3_extends_Flavored = true

		const _KeepP3P1_extends_P3P1: KeepP3P1_extends_P3P1 = true
		const _KeepP3P1_extends_P2: KeepP3P1_extends_P2 = false
		const _KeepP3P1_extends_Flavored: KeepP3P1_extends_Flavored = true

		expect(_KeepP1P2_extends_P1P2).toBe(true)
		expect(_KeepP1P2_extends_P3).toBe(false)
		expect(_KeepP1P2_extends_Flavored).toBe(true)

		expect(_KeepP2P3_extends_P2P3).toBe(true)
		expect(_KeepP2P3_extends_P1).toBe(false)
		expect(_KeepP2P3_extends_Flavored).toBe(true)

		expect(_KeepP3P1_extends_P3P1).toBe(true)
		expect(_KeepP3P1_extends_P2).toBe(false)
		expect(_KeepP3P1_extends_Flavored).toBe(true)
	})
})

describe('KeepPropertyIfValueMatches', () => {
	type Red = WithProperty<string, 'Color', 'Red'>
	type Green = WithProperty<string, 'Color', 'Green'>
	type Blue = WithProperty<string, 'Color', 'Blue'>

	it('keeps property if the set value matches (one property)', () => {
		type R = KeepPropertyIfValueMatches<Red, 'Color', 'Blue' | 'Green'>
		type G = KeepPropertyIfValueMatches<Green, 'Color', 'Blue' | 'Green'>
		type B = KeepPropertyIfValueMatches<Blue, 'Color', 'Blue' | 'Green'>

		// We strip the 'Color' property from Red
		type R_extends_String = R extends string ? true : false
		type String_extends_R = string extends R ? true : false

		// Green & Blue keep their 'Color' property
		type G_extends_Green = G extends Green ? true : false
		type Green_extends_G = Green extends G ? true : false

		type B_extends_Blue = B extends Blue ? true : false
		type Blue_extends_B = Blue extends B ? true : false

		const _R_extends_String: R_extends_String = true
		const _String_extends_R: String_extends_R = true

		const _G_extends_Green: G_extends_Green = true
		const _Green_extends_G: Green_extends_G = true

		const _B_extends_Blue: B_extends_Blue = true
		const _Blue_extends_B: Blue_extends_B = true

		expect(_R_extends_String).toBe(true)
		expect(_String_extends_R).toBe(true)

		expect(_G_extends_Green).toBe(true)
		expect(_Green_extends_G).toBe(true)

		expect(_B_extends_Blue).toBe(true)
		expect(_Blue_extends_B).toBe(true)
	})

	it('keeps property if the set value matches (many properties)', () => {
		type Big<T = string> = WithProperty<T, 'Size', 'Big'>
		type BigRed = Big<Red>
		type BigGreen = Big<Green>
		type BigBlue = Big<Blue>

		type R = KeepPropertyIfValueMatches<BigRed, 'Color', 'Blue' | 'Green'>
		type G = KeepPropertyIfValueMatches<BigGreen, 'Color', 'Blue' | 'Green'>
		type B = KeepPropertyIfValueMatches<BigBlue, 'Color', 'Blue' | 'Green'>

		// We strip the 'Color' property from Red, but we keep 'Big'
		type R_extends_Big = R extends Big ? true : false
		type Big_extends_R = Big extends R ? true : false

		// Green & Blue keep their 'Color' property
		type G_extends_BigGreen = G extends BigGreen ? true : false
		type BigGreen_extends_G = BigGreen extends G ? true : false

		type B_extends_BigBlue = B extends BigBlue ? true : false
		type BigBlue_extends_B = BigBlue extends B ? true : false

		const _R_extends_Big: R_extends_Big = true
		const _Big_extends_R: Big_extends_R = true

		const _G_extends_BigGreen: G_extends_BigGreen = true
		const _BigGreen_extends_G: BigGreen_extends_G = true

		const _B_extends_BigBlue: B_extends_BigBlue = true
		const _BigBlue_extends_B: BigBlue_extends_B = true

		expect(_R_extends_Big).toBe(true)
		expect(_Big_extends_R).toBe(true)

		expect(_G_extends_BigGreen).toBe(true)
		expect(_BigGreen_extends_G).toBe(true)

		expect(_B_extends_BigBlue).toBe(true)
		expect(_BigBlue_extends_B).toBe(true)
	})

	it('is compatible with brand', () => {
		type Branded = WithBrand<number, 'ACME'>
		type Big<T = Branded> = WithProperty<T, 'Size', 'Big'>
		type BrandedRed = WithProperty<Branded, 'Color', 'Red'>
		type BrandedGreen = WithProperty<Branded, 'Color', 'Green'>
		type BrandedBlue = WithProperty<Branded, 'Color', 'Blue'>
		type BigRed = Big<BrandedRed>
		type BigGreen = Big<BrandedGreen>
		type BigBlue = Big<BrandedBlue>

		type R = KeepPropertyIfValueMatches<BigRed, 'Color', 'Blue' | 'Green'>
		type G = KeepPropertyIfValueMatches<BigGreen, 'Color', 'Blue' | 'Green'>
		type B = KeepPropertyIfValueMatches<BigBlue, 'Color', 'Blue' | 'Green'>

		// We strip the 'Color' property from Red, but we keep 'Big'
		type R_extends_Big = R extends Big ? true : false
		type Big_extends_R = Big extends R ? true : false
		type R_extends_Branded = R extends Branded ? true : false

		// Green & Blue keep their 'Color' property
		type G_extends_BigGreen = G extends BigGreen ? true : false
		type BigGreen_extends_G = BigGreen extends G ? true : false
		type G_extends_Branded = G extends Branded ? true : false

		type B_extends_BigBlue = B extends BigBlue ? true : false
		type BigBlue_extends_B = BigBlue extends B ? true : false
		type B_extends_Branded = B extends Branded ? true : false

		const _R_extends_Big: R_extends_Big = true
		const _Big_extends_R: Big_extends_R = true
		const _R_extends_Branded: R_extends_Branded = true

		const _G_extends_BigGreen: G_extends_BigGreen = true
		const _BigGreen_extends_G: BigGreen_extends_G = true
		const _G_extends_Branded: G_extends_Branded = true

		const _B_extends_BigBlue: B_extends_BigBlue = true
		const _BigBlue_extends_B: BigBlue_extends_B = true
		const _B_extends_Branded: B_extends_Branded = true

		expect(_R_extends_Big).toBe(true)
		expect(_Big_extends_R).toBe(true)
		expect(_R_extends_Branded).toBe(true)

		expect(_G_extends_BigGreen).toBe(true)
		expect(_BigGreen_extends_G).toBe(true)
		expect(_G_extends_Branded).toBe(true)

		expect(_B_extends_BigBlue).toBe(true)
		expect(_BigBlue_extends_B).toBe(true)
		expect(_B_extends_Branded).toBe(true)
	})

	it('is compatible with flavor', () => {
		type Flavored = WithFlavor<number, 'Sweet'>
		type Big<T = Flavored> = WithProperty<T, 'Size', 'Big'>
		type FlavoredRed = WithProperty<Flavored, 'Color', 'Red'>
		type FlavoredGreen = WithProperty<Flavored, 'Color', 'Green'>
		type FlavoredBlue = WithProperty<Flavored, 'Color', 'Blue'>
		type BigRed = Big<FlavoredRed>
		type BigGreen = Big<FlavoredGreen>
		type BigBlue = Big<FlavoredBlue>

		type R = KeepPropertyIfValueMatches<BigRed, 'Color', 'Blue' | 'Green'>
		type G = KeepPropertyIfValueMatches<BigGreen, 'Color', 'Blue' | 'Green'>
		type B = KeepPropertyIfValueMatches<BigBlue, 'Color', 'Blue' | 'Green'>

		// We strip the 'Color' property from Red, but we keep 'Big'
		type R_extends_Big = R extends Big ? true : false
		type Big_extends_R = Big extends R ? true : false
		type R_extends_Flavoreed = R extends Flavored ? true : false

		// Green & Blue keep their 'Color' property
		type G_extends_BigGreen = G extends BigGreen ? true : false
		type BigGreen_extends_G = BigGreen extends G ? true : false
		type G_extends_Flavored = G extends Flavored ? true : false

		type B_extends_BigBlue = B extends BigBlue ? true : false
		type BigBlue_extends_B = BigBlue extends B ? true : false
		type B_extends_Flavored = B extends Flavored ? true : false

		const _R_extends_Big: R_extends_Big = true
		const _Big_extends_R: Big_extends_R = true
		const _R_extends_Flavored: R_extends_Flavoreed = true

		const _G_extends_BigGreen: G_extends_BigGreen = true
		const _BigGreen_extends_G: BigGreen_extends_G = true
		const _G_extends_Flavored: G_extends_Flavored = true

		const _B_extends_BigBlue: B_extends_BigBlue = true
		const _BigBlue_extends_B: BigBlue_extends_B = true
		const _B_extends_Flavored: B_extends_Flavored = true

		expect(_R_extends_Big).toBe(true)
		expect(_Big_extends_R).toBe(true)
		expect(_R_extends_Flavored).toBe(true)

		expect(_G_extends_BigGreen).toBe(true)
		expect(_BigGreen_extends_G).toBe(true)
		expect(_G_extends_Flavored).toBe(true)

		expect(_B_extends_BigBlue).toBe(true)
		expect(_BigBlue_extends_B).toBe(true)
		expect(_B_extends_Flavored).toBe(true)
	})
})
