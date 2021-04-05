import { NegateTag, WithTag } from '..'

type T1 = WithTag<number, 'T1'>
type T2 = WithTag<number, 'T2'>
type T1T2 = WithTag<T1, 'T2'>
type T2T1 = WithTag<T2, 'T1'>

type T1NegateT1 = NegateTag<T1, 'T1'>
type T2NegateT2 = NegateTag<T2, 'T2'>
type T1T2NegateT1 = NegateTag<T1T2, 'T1'>
type T1T2NegateT2 = NegateTag<T1T2, 'T2'>
type T2T1NegateT1 = NegateTag<T2T1, 'T1'>
type T2T1NegateT2 = NegateTag<T2T1, 'T2'>

describe('NegateTag', () => {
  it('leaves primitive types "unchanged"', () => {
    type Unchanged = NegateTag<number, 'T1'>

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
    type T1T2NegateT1NegateT1 = NegateTag<T1T2NegateT1, 'T1'>
    type T1T2NegateT1NegateT1_extends_T1T2NegateT1 = T1T2NegateT1NegateT1 extends T1T2NegateT1
      ? true
      : false
    type T1T2NegateT1_extends_T1T2NegateT1NegateT1 = T1T2NegateT1 extends T1T2NegateT1NegateT1
      ? true
      : false
    type IsIdempotent = T1T2NegateT1NegateT1_extends_T1T2NegateT1 extends true
      ? T1T2NegateT1_extends_T1T2NegateT1NegateT1 extends true
        ? true
        : false
      : false
    const isIdempotent: IsIdempotent = true
    expect(isIdempotent).toBe(true)
  })

  it('leaves simple-tagged types as primitive-compatible types', () => {
    type T1NegateT1_extends_Number = T1NegateT1 extends number ? true : false
    type Number_extends_T1NegateT1 = number extends T1NegateT1 ? true : false

    type SingleTaggedBecomesPrimitive = T1NegateT1_extends_Number extends true
      ? Number_extends_T1NegateT1 extends true
        ? true
        : false
      : false

    const singleTaggedBecomesPrimitive: SingleTaggedBecomesPrimitive = true
    expect(singleTaggedBecomesPrimitive).toBe(true)

    // Here we test that we can assign "naked" primitive literals
    const literalExample: T1NegateT1 = 42
    expect(literalExample).toBe(42)
  })

  it('accepts primitive types when multiple negations are combined', () => {
    type NegateT1 = NegateTag<number, 'T1'>
    type NegateT1T2 = NegateTag<NegateT1, 'T2'>

    const doublyNegated: NegateT1T2 = 42
    expect(doublyNegated).toBe(42)
  })

  it('removes tag', () => {
    type T1NegateT1_extends_T1 = T1NegateT1 extends T1 ? true : false
    type T2NegateT2_extends_T2 = T2NegateT2 extends T2 ? true : false
    type T1T2NegateT1_extends_T1 = T1T2NegateT1 extends T1 ? true : false
    type T1T2NegateT2_extends_T2 = T1T2NegateT2 extends T2 ? true : false
    type T2T1NegateT1_extends_T1 = T2T1NegateT1 extends T1 ? true : false
    type T2T1NegateT2_extends_T2 = T2T1NegateT2 extends T2 ? true : false

    const _T1NegateT1_extends_T1: T1NegateT1_extends_T1 = false
    expect(_T1NegateT1_extends_T1).toBe(false)

    const _T2NegateT2_extends_T2: T2NegateT2_extends_T2 = false
    expect(_T2NegateT2_extends_T2).toBe(false)

    const _T1T2NegateT1_extends_T1: T1T2NegateT1_extends_T1 = false
    expect(_T1T2NegateT1_extends_T1).toBe(false)

    const _T1T2NegateT2_extends_T2: T1T2NegateT2_extends_T2 = false
    expect(_T1T2NegateT2_extends_T2).toBe(false)

    const _T2T1NegateT1_extends_T1: T2T1NegateT1_extends_T1 = false
    expect(_T2T1NegateT1_extends_T1).toBe(false)

    const _T2T1NegateT2_extends_T2: T2T1NegateT2_extends_T2 = false
    expect(_T2T1NegateT2_extends_T2).toBe(false)
  })

  it('preserves other present tags', () => {
    type T1T2NegateT1_extends_T2 = T1T2NegateT1 extends T2 ? true : false
    type T1T2NegateT2_extends_T1 = T1T2NegateT2 extends T1 ? true : false
    type T2T1NegateT1_extends_T2 = T2T1NegateT1 extends T2 ? true : false
    type T2T1NegateT2_extends_T1 = T2T1NegateT2 extends T1 ? true : false

    const _T1T2NegateT1_extends_T2: T1T2NegateT1_extends_T2 = true
    expect(_T1T2NegateT1_extends_T2).toBe(true)

    const _T1T2NegateT2_extends_T1: T1T2NegateT2_extends_T1 = true
    expect(_T1T2NegateT2_extends_T1).toBe(true)

    const _T2T1NegateT1_extends_T2: T2T1NegateT1_extends_T2 = true
    expect(_T2T1NegateT1_extends_T2).toBe(true)

    const _T2T1NegateT2_extends_T1: T2T1NegateT2_extends_T1 = true
    expect(_T2T1NegateT2_extends_T1).toBe(true)
  })

  it('does not accept tagged values', () => {
    type T1NegateT1_extends_T1 = T1NegateT1 extends T1 ? true : false

    const does_T1NegateT1_extend_T1: T1NegateT1_extends_T1 = false
    expect(does_T1NegateT1_extend_T1).toBe(false)
  })
})
