import { describe, expect, it } from 'vitest'
import type { WithBrand, WithFlavor } from '..'
import type { WithoutBrand } from '../Brands'

type ACME = WithBrand<string, 'ACME'>
type Ubik = WithBrand<string, 'Ubik'>
type UbikFlavor = WithFlavor<string, 'Ubik'>

export type Sweet = WithFlavor<string, 'Sweet'>
export type Salty = WithFlavor<string, 'Salty'>
export type SaltyBrand = WithBrand<string, 'Salty'>

describe('WithBrand', () => {
	it('strictly extends base types', () => {
		type ACME_extends_String = ACME extends string ? true : false
		type String_extends_ACME = string extends ACME ? true : false

		const _ACME_extends_String: ACME_extends_String = true
		const _String_extends_ACME: String_extends_ACME = false

		expect(_ACME_extends_String).toBe(true)
		expect(_String_extends_ACME).toBe(false)
	})

	it('strictly extends flavor types with same "brand"', () => {
		type Ubik_extends_UbikFlavor = Ubik extends UbikFlavor ? true : false
		type UbikFlavor_extends_Ubik = UbikFlavor extends Ubik ? true : false

		const _Ubik_extends_UbikFlavor: Ubik_extends_UbikFlavor = true
		const _UbikFlavor_extends_Ubik: UbikFlavor_extends_Ubik = false

		expect(_Ubik_extends_UbikFlavor).toBe(true)
		expect(_UbikFlavor_extends_Ubik).toBe(false)
	})

	it('replaces previous brands', () => {
		type NewUbik = WithBrand<ACME, 'Ubik'>

		type NewUbik_extends_Ubik = NewUbik extends Ubik ? true : false
		type Ubik_extends_NewUbik = Ubik extends NewUbik ? true : false
		type NewUbik_extends_ACME = NewUbik extends ACME ? true : false

		const _NewUbik_extends_Ubik: NewUbik_extends_Ubik = true
		const _Ubik_extends_NewUbik: Ubik_extends_NewUbik = true
		const _NewUbik_extends_ACME: NewUbik_extends_ACME = false

		expect(_NewUbik_extends_Ubik).toBe(true)
		expect(_Ubik_extends_NewUbik).toBe(true)
		expect(_NewUbik_extends_ACME).toBe(false)
	})

	it('replaces previous flavors', () => {
		type NewUbik = WithBrand<Sweet, 'Ubik'>

		type NewUbik_extends_Ubik = NewUbik extends Ubik ? true : false
		type Ubik_extends_NewUbik = Ubik extends NewUbik ? true : false
		type NewUbik_extends_Sweet = NewUbik extends Sweet ? true : false

		const _NewUbik_extends_Ubik: NewUbik_extends_Ubik = true
		const _Ubik_extends_NewUbik: Ubik_extends_NewUbik = true
		const _NewUbik_extends_Sweet: NewUbik_extends_Sweet = false

		expect(_NewUbik_extends_Ubik).toBe(true)
		expect(_Ubik_extends_NewUbik).toBe(true)
		expect(_NewUbik_extends_Sweet).toBe(false)
	})
})

describe('WithFlavor', () => {
	it('is strictly compatible with base types', () => {
		type Sweet_extends_String = Sweet extends string ? true : false
		type String_extends_Sweet = string extends Sweet ? true : false

		const _Sweet_extends_String: Sweet_extends_String = true
		const _String_extends_Sweet: String_extends_Sweet = true

		expect(_Sweet_extends_String).toBe(true)
		expect(_String_extends_Sweet).toBe(true)
	})

	it('does not accept other flavors', () => {
		type Sweet_extends_Salty = Sweet extends Salty ? true : false
		type Salty_extends_Sweet = Salty extends Sweet ? true : false

		const _Sweet_extends_Salty: Sweet_extends_Salty = false
		const _Salty_extends_Sweet: Salty_extends_Sweet = false

		expect(_Sweet_extends_Salty).toBe(false)
		expect(_Salty_extends_Sweet).toBe(false)
	})

	it('replaces previous brands', () => {
		type NewSalty = WithFlavor<SaltyBrand, 'Salty'>

		type NewSalty_extends_Salty = NewSalty extends Salty ? true : false
		type Salty_extends_NewSalty = Salty extends NewSalty ? true : false
		type NewSalty_extends_SaltyBrand = NewSalty extends SaltyBrand
			? true
			: false

		const _NewSalty_extends_Salty: NewSalty_extends_Salty = true
		const _Salty_extends_NewSalty: Salty_extends_NewSalty = true
		const _NewSalty_extends_SaltyBrand: NewSalty_extends_SaltyBrand = false

		expect(_NewSalty_extends_Salty).toBe(true)
		expect(_Salty_extends_NewSalty).toBe(true)
		expect(_NewSalty_extends_SaltyBrand).toBe(false)
	})

	it('replaces previous flavors', () => {
		type NewSalty = WithFlavor<Sweet, 'Salty'>

		type NewSalty_extends_Salty = NewSalty extends Salty ? true : false
		type Salty_extends_NewSalty = Salty extends NewSalty ? true : false
		type NewSalty_extends_Sweet = NewSalty extends Sweet ? true : false

		const _NewSalty_extends_Salty: NewSalty_extends_Salty = true
		const _Salty_extends_NewSalty: Salty_extends_NewSalty = true
		const _NewSalty_extends_Sweet: NewSalty_extends_Sweet = false

		expect(_NewSalty_extends_Salty).toBe(true)
		expect(_Salty_extends_NewSalty).toBe(true)
		expect(_NewSalty_extends_Sweet).toBe(false)
	})
})

describe('WithoutBrand', () => {
	it('removes brands', () => {
		type NewString = WithoutBrand<ACME>

		type NewString_extends_String = NewString extends string ? true : false
		type String_extends_NewString = string extends NewString ? true : false

		const _NewString_extends_String: NewString_extends_String = true
		const _String_extends_NewString: String_extends_NewString = true

		expect(_NewString_extends_String).toBe(true)
		expect(_String_extends_NewString).toBe(true)
	})

	it('removes flavors', () => {
		type NewString = WithoutBrand<Sweet>

		type NewString_extends_String = NewString extends string ? true : false
		type String_extends_NewString = string extends NewString ? true : false
		type NewString_extends_Salty = NewString extends Salty ? true : false

		const _NewString_extends_String: NewString_extends_String = true
		const _String_extends_NewString: String_extends_NewString = true
		const _NewString_extends_Salty: NewString_extends_Salty = true

		expect(_NewString_extends_String).toBe(true)
		expect(_String_extends_NewString).toBe(true)
		expect(_NewString_extends_Salty).toBe(true)
	})
})
