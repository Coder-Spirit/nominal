import { WithTag } from '..'

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
})
