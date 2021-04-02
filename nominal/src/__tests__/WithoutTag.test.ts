import { WithTag, WithoutTag } from '..'

type T1 = WithTag<number, 'T1'>
type T2 = WithTag<number, 'T2'>
type T1T2 = WithTag<T1, 'T2'>
type T2T1 = WithTag<T2, 'T1'>

type T1WithoutT1 = WithoutTag<T1, 'T1'>
type T2WithoutT2 = WithoutTag<T2, 'T2'>
type T1T2WithoutT1 = WithoutTag<T1T2, 'T1'>
type T1T2WithoutT2 = WithoutTag<T1T2, 'T2'>
type T2T1WithoutT1 = WithoutTag<T2T1, 'T1'>
type T2T1WithoutT2 = WithoutTag<T2T1, 'T2'>

describe('WithoutTag', () => {
  it('leaves primitive types "unchanged"', () => {
    type Unchanged = WithoutTag<number, 'T1'>

    type Unchanged_extends_Number = Unchanged extends number ? true : false
    type Number_extends_Unchanged = number extends Unchanged ? true : false

    type PrimitiveTypesRemainUnchanged = Unchanged_extends_Number extends true
      ? Number_extends_Unchanged extends true
        ? true
        : false
      : false

    const primitiveTypesRemainUnchanged: PrimitiveTypesRemainUnchanged = true
    expect(primitiveTypesRemainUnchanged).toBe(true)
  })

  it('is idempotent', () => {
    type T1T2WithoutT1WithoutT1 = WithoutTag<T1T2WithoutT1, 'T1'>
    type T1T2WithoutT1WithoutT1_extends_T1T2WithoutT1 = T1T2WithoutT1WithoutT1 extends T1T2WithoutT1
      ? true
      : false
    type T1T2WithoutT1_extends_T1T2WithoutT1WithoutT1 = T1T2WithoutT1 extends T1T2WithoutT1WithoutT1
      ? true
      : false
    type IsIdempotent = T1T2WithoutT1WithoutT1_extends_T1T2WithoutT1 extends true
      ? T1T2WithoutT1_extends_T1T2WithoutT1WithoutT1 extends true
        ? true
        : false
      : false
    const isIdempotent: IsIdempotent = true
    expect(isIdempotent).toBe(true)
  })

  it('leaves simple-tagged types as primitive types', () => {
    type T1WithoutT1_extends_Number = T1WithoutT1 extends number ? true : false
    type Number_extends_T1WithoutT1 = number extends T1WithoutT1 ? true : false

    type SingleTaggedBecomesPrimitive = T1WithoutT1_extends_Number extends true
      ? Number_extends_T1WithoutT1 extends true
        ? true
        : false
      : false

    const singleTaggedBecomesPrimitive: SingleTaggedBecomesPrimitive = true
    expect(singleTaggedBecomesPrimitive).toBe(true)
  })

  it('removes tag', () => {
    type T1WithoutT1_extends_T1 = T1WithoutT1 extends T1 ? true : false
    type T2WithoutT2_extends_T2 = T2WithoutT2 extends T2 ? true : false
    type T1T2WithoutT1_extends_T1 = T1T2WithoutT1 extends T1 ? true : false
    type T1T2WithoutT2_extends_T2 = T1T2WithoutT2 extends T2 ? true : false
    type T2T1WithoutT1_extends_T1 = T2T1WithoutT1 extends T1 ? true : false
    type T2T1WithoutT2_extends_T2 = T2T1WithoutT2 extends T2 ? true : false

    const _T1WithoutT1_extends_T1: T1WithoutT1_extends_T1 = false
    expect(_T1WithoutT1_extends_T1).toBe(false)

    const _T2WithoutT2_extends_T2: T2WithoutT2_extends_T2 = false
    expect(_T2WithoutT2_extends_T2).toBe(false)

    const _T1T2WithoutT1_extends_T1: T1T2WithoutT1_extends_T1 = false
    expect(_T1T2WithoutT1_extends_T1).toBe(false)

    const _T1T2WithoutT2_extends_T2: T1T2WithoutT2_extends_T2 = false
    expect(_T1T2WithoutT2_extends_T2).toBe(false)

    const _T2T1WithoutT1_extends_T1: T2T1WithoutT1_extends_T1 = false
    expect(_T2T1WithoutT1_extends_T1).toBe(false)

    const _T2T1WithoutT2_extends_T2: T2T1WithoutT2_extends_T2 = false
    expect(_T2T1WithoutT2_extends_T2).toBe(false)
  })

  it('preserves other present tags', () => {
    type T1T2WithoutT1_extends_T2 = T1T2WithoutT1 extends T2 ? true : false
    type T1T2WithoutT2_extends_T1 = T1T2WithoutT2 extends T1 ? true : false
    type T2T1WithoutT1_extends_T2 = T2T1WithoutT1 extends T2 ? true : false
    type T2T1WithoutT2_extends_T1 = T2T1WithoutT2 extends T1 ? true : false

    const _T1T2WithoutT1_extends_T2: T1T2WithoutT1_extends_T2 = true
    expect(_T1T2WithoutT1_extends_T2).toBe(true)

    const _T1T2WithoutT2_extends_T1: T1T2WithoutT2_extends_T1 = true
    expect(_T1T2WithoutT2_extends_T1).toBe(true)

    const _T2T1WithoutT1_extends_T2: T2T1WithoutT1_extends_T2 = true
    expect(_T2T1WithoutT1_extends_T2).toBe(true)

    const _T2T1WithoutT2_extends_T1: T2T1WithoutT2_extends_T1 = true
    expect(_T2T1WithoutT2_extends_T1).toBe(true)
  })

  it('accepts tagged values', () => {
    const value: T1WithoutT1 = 42 as T1
    expect(value).toBe(42)
  })
})
