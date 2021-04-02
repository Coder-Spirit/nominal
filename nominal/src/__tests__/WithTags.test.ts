import { WithTag, WithTags } from '..'

type T1 = WithTag<number, 'T1'>
type T1T2 = WithTag<T1, 'T2'>
type T1T2s = WithTags<number, ['T1', 'T2']>
type T2T1s = WithTags<number, ['T2', 'T1']>

describe('WithTags', () => {
  it('is commutative', () => {
    // We need these two intermediate types because TS is not powerful enough to
    // perform the inference in one single step
    type T1T2s_extends_T2T1s = T1T2s extends T2T1s ? true : false
    type T2T1s_extends_T1T2s = T2T1s extends T1T2s ? true : false

    type IsCommutative = T1T2s_extends_T2T1s extends true
      ? T2T1s_extends_T1T2s extends true
        ? true
        : false
      : false

    const isCommutative: IsCommutative = true
    expect(isCommutative).toBe(true)
  })

  it('is equivalent to multiple composed AddTag', () => {
    type T1T2_extends_T1T2s = T1T2 extends T1T2s ? true : false
    type T1T2s_extends_T1T2 = T1T2s extends T1T2 ? true : false

    type IsComposition = T1T2_extends_T1T2s extends true
      ? T1T2s_extends_T1T2 extends true
        ? true
        : false
      : false

    const isComposition: IsComposition = true
    expect(isComposition).toBe(true)
  })
})
