import { NegateTag, WithTag } from '..'

type T1 = WithTag<number, 'T1'>
type T2 = WithTag<number, 'T2'>
type T1T2 = WithTag<T1, 'T2'>
type T2T1 = WithTag<T2, 'T1'>

describe('WithTag', () => {
  it('does not accept primitive types', () => {
    type Number_extends_T1 = number extends T1 ? true : false
    type Number_extends_T2 = number extends T2 ? true : false

    const number_extends_T1: Number_extends_T1 = false
    const number_extends_T2: Number_extends_T2 = false

    expect(number_extends_T1).toBe(false)
    expect(number_extends_T2).toBe(false)
  })

  it('is additive', () => {
    type T1T2_extends_T1 = T1T2 extends T1 ? true : false
    type T2T1_extends_T1 = T2T1 extends T1 ? true : false
    type T1T2_extends_T2 = T1T2 extends T2 ? true : false
    type T2T1_extends_T2 = T2T1 extends T2 ? true : false

    const t1t2_extends_t1: T1T2_extends_T1 = true
    const t2t1_extends_t1: T2T1_extends_T1 = true
    const t1t2_extends_t2: T1T2_extends_T2 = true
    const t2t1_extends_t2: T2T1_extends_T2 = true

    expect(t1t2_extends_t1).toBe(true)
    expect(t2t1_extends_t1).toBe(true)
    expect(t1t2_extends_t2).toBe(true)
    expect(t2t1_extends_t2).toBe(true)
  })

  it('is commutative', () => {
    // We need these two intermediate types because TS is not powerful enough to
    // perform the inference in one single step
    type T1T2_extends_T2T1 = T1T2 extends T2T1 ? true : false
    type T2T1_extends_T1T2 = T2T1 extends T1T2 ? true : false

    type IsCommutative = T1T2_extends_T2T1 extends true
      ? T2T1_extends_T1T2 extends true
        ? true
        : false
      : false

    const isCommutative: IsCommutative = true
    expect(isCommutative).toBe(true)
  })

  it('is idempotent', () => {
    // Simple case:
    // ------------
    type T1T1 = WithTag<T1, 'T1'>

    type T1T1_extends_T1 = T1T1 extends T1 ? true : false
    type T1_extends_T1T1 = T1 extends T1T1 ? true : false

    type IsIdempotentA = T1T1_extends_T1 extends true
      ? T1_extends_T1T1 extends true
        ? true
        : false
      : false

    const isIdempotentA: IsIdempotentA = true
    expect(isIdempotentA).toBe(true)

    // Complex case:
    // -------------
    type T1T2T1 = WithTag<T1T2, 'T1'>
    type T1T2T1_extends_T1T2 = T1T2T1 extends T1T2 ? true : false
    type T1T2_extends_T1T2T1 = T1T2 extends T1T2T1 ? true : false

    type IsIdempotentB = T1T2T1_extends_T1T2 extends true
      ? T1T2_extends_T1T2T1 extends true
        ? true
        : false
      : false

    const isIdempotentB: IsIdempotentB = true
    expect(isIdempotentB).toBe(true)
  })

  it('preserves types across function boundaries', () => {
    function throwIfNotEven<T extends number>(v: T): WithTag<T, 'Even'> {
      if (v % 2 == 1) throw new Error('Not Even!')
      return v as WithTag<T, 'Even'>
    }

    function throwIfNotPositive<T extends number>(
      v: T,
    ): WithTag<T, 'Positive'> {
      if (v <= 0) throw new Error('Not positive!')
      return v as WithTag<T, 'Positive'>
    }

    const v1 = 42
    const v2 = throwIfNotEven(v1)
    const v3 = throwIfNotPositive(v2)

    type V3Type = typeof v3
    type V3Type_extends_Even = V3Type extends WithTag<number, 'Even'>
      ? true
      : false
    type V3Type_extends_Positive = V3Type extends WithTag<number, 'Positive'>
      ? true
      : false

    type PreservesTypes = V3Type_extends_Even extends true
      ? V3Type_extends_Positive extends true
        ? true
        : false
      : false

    const preservesTypes: PreservesTypes = true
    expect(preservesTypes).toBe(true)
  })

  it('reverses tag negation (simple case)', () => {
    type NegatedT1 = NegateTag<number, 'T1'>
    type NegatedT1WithT1 = WithTag<NegatedT1, 'T1'>

    type NegatedT1WithT1_extends_T1 = NegatedT1WithT1 extends T1 ? true : false
    type T1_extends_NegatedT1WithT1 = T1 extends NegatedT1WithT1 ? true : false

    type ReversesTagNegation = NegatedT1WithT1_extends_T1 extends true
      ? T1_extends_NegatedT1WithT1 extends true
        ? true
        : false
      : false

    const reversesTagNegation: ReversesTagNegation = true
    expect(reversesTagNegation).toBe(true)
  })

  it('reverses tag negation, and keeps the other negations', () => {
    type NegatedT1 = NegateTag<number, 'T1'>
    type NegatedT2 = NegateTag<number, 'T2'>
    type NegatedT1T2 = NegateTag<NegatedT1, 'T2'>
    type NegatedT1T2WithT1 = WithTag<NegatedT1T2, 'T1'>

    type NegatedT1T2WithT1_extends_T1 = NegatedT1T2WithT1 extends T1 ? true : false
    type T1_extends_NegatedT1T2WithT1 = T1 extends NegatedT1T2WithT1 ? true : false

    type ReversesTagNegation = NegatedT1T2WithT1_extends_T1 extends true
      ? T1_extends_NegatedT1T2WithT1 extends true
        ? true
        : false
      : false

    const reversesTagNegation: ReversesTagNegation = true
    expect(reversesTagNegation).toBe(true)

    type PreservesT2Negation = NegatedT1T2WithT1 extends NegatedT2 ? true : false
    const preservesT2Negation: PreservesT2Negation = true
    expect(preservesT2Negation).toBe(true)
  })
})
