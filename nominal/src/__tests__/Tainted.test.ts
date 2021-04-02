import { Tainted } from '..'

type TaintedNumber = Tainted<number>
type TaintedString = Tainted<string>
type TaintedTaintedNumber = Tainted<TaintedNumber>

interface TestStruct {
  a: number
  b: string
}
type TaintedStruct = Tainted<TestStruct>
type TaintedTaintedStruct = Tainted<TaintedStruct>

describe('Tainted', () => {
  it('is idempotent (for primitive types)', () => {
    type TaintedTaintedNumber_extends_TaintedNumber = TaintedTaintedNumber extends TaintedNumber
      ? true
      : false
    type TaintedNumber_extends_TaintedTaintedNumber = TaintedNumber extends TaintedTaintedNumber
      ? true
      : false

    type IsIdempotent = TaintedTaintedNumber_extends_TaintedNumber extends true
      ? TaintedNumber_extends_TaintedTaintedNumber extends true
        ? true
        : false
      : false

    const isIdempotent: IsIdempotent = true
    expect(isIdempotent).toBe(true)
  })

  it('is idempotent (for complex types)', () => {
    type TaintedTaintedStruct_extends_TaintedStruct = TaintedTaintedStruct extends TaintedStruct
      ? true
      : false
    type TaintedStruct_extends_TaintedTaintedStruct = TaintedStruct extends TaintedTaintedStruct
      ? true
      : false

    type IsIdempotent = TaintedTaintedStruct_extends_TaintedStruct extends true
      ? TaintedStruct_extends_TaintedTaintedStruct extends true
        ? true
        : false
      : false

    const isIdempotent: IsIdempotent = true
    expect(isIdempotent).toBe(true)
  })

  it('taints subfields', () => {
    type IsATainted = TaintedStruct['a'] extends TaintedNumber ? true : false
    type IsBTainted = TaintedStruct['b'] extends TaintedString ? true : false

    const isATainted: IsATainted = true
    expect(isATainted).toBe(true)

    const isBTainted: IsBTainted = true
    expect(isBTainted).toBe(true)
  })
})
