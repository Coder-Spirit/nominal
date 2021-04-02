import { Tainted, Untainted } from '..'

type TaintedNumber = Tainted<number>
type UnTaintedNumber = Untainted<number>
type UntaintedTaintedNumber = Untainted<TaintedNumber>
type UntaintedUntaintedTaintedNumber = Untainted<UntaintedTaintedStruct>

interface TestStruct {
  a: number
  b: string
}
type TaintedStruct = Tainted<TestStruct>
type UntaintedStruct = Untainted<TestStruct>
type UntaintedTaintedStruct = Untainted<TaintedStruct>
type UntaintedUntaintedTaintedStruct = Untainted<UntaintedTaintedStruct>

describe('Untainted', () => {
  it('leaves primitive untainted types "unchanged"', () => {
    type UntaintedNumber_extends_Number = UnTaintedNumber extends number
      ? true
      : false
    type Number_extends_UntainteedPrimitive = number extends UnTaintedNumber
      ? true
      : false

    type PrimitiveTypesRemainUnchanged = UntaintedNumber_extends_Number extends true
      ? Number_extends_UntainteedPrimitive extends true
        ? true
        : false
      : false

    const primitiveTypesRemainUnchanged: PrimitiveTypesRemainUnchanged = true
    expect(primitiveTypesRemainUnchanged).toBe(true)
  })

  it('leaves complex untainted types "unchanged"', () => {
    type UntaintedStruct_extends_TestStruct = UntaintedStruct extends TestStruct
      ? true
      : false
    type TestStruct_extends_UntaintedStruct = TestStruct extends UntaintedStruct
      ? true
      : false

    type ComplexTypesRemainUnchanged = UntaintedStruct_extends_TestStruct extends true
      ? TestStruct_extends_UntaintedStruct extends true
        ? true
        : false
      : false

    const complexTypesRemainUnchanged: ComplexTypesRemainUnchanged = true
    expect(complexTypesRemainUnchanged).toBe(true)
  })

  it('leaves primitive tainted types as primitive untainted types', () => {
    type UntaintedTaintedNumber_extends_Number = UntaintedTaintedNumber extends number
      ? true
      : false
    type Number_extends_UntaintedTaintedNumber = number extends UntaintedTaintedNumber
      ? true
      : false

    type TaintedNumberBecomesPrimitive = UntaintedTaintedNumber_extends_Number extends true
      ? Number_extends_UntaintedTaintedNumber extends true
        ? true
        : false
      : false

    const taintedNumberBecomesPrimitive: TaintedNumberBecomesPrimitive = true
    expect(taintedNumberBecomesPrimitive).toBe(true)
  })

  it('leaves complex tainted types as complex untainted types', () => {
    type UntaintedTaintedStruct_extends_TestStruct = UntaintedTaintedStruct extends TestStruct
      ? true
      : false
    type TestStruct_extends_UntaintedTaintedStruct = TestStruct extends UntaintedTaintedStruct
      ? true
      : false

    type TaintedStructBecomesStruct = UntaintedTaintedStruct_extends_TestStruct extends true
      ? TestStruct_extends_UntaintedTaintedStruct extends true
        ? true
        : false
      : false

    const taintedStructBecomesStruct: TaintedStructBecomesStruct = true
    expect(taintedStructBecomesStruct).toBe(true)
  })

  it('is idempotent (for primitive types)', () => {
    type UntaintedUntaintedTaintedNumber_extends_UntaintedTaintedNumber = UntaintedUntaintedTaintedNumber extends UntaintedTaintedStruct
      ? true
      : false
    type UntaintedTaintedNumber_extends_UntaintedUntaintedTaintedNumber = UntaintedTaintedStruct extends UntaintedUntaintedTaintedNumber
      ? true
      : false

    type IsIdempotent = UntaintedUntaintedTaintedNumber_extends_UntaintedTaintedNumber extends true
      ? UntaintedTaintedNumber_extends_UntaintedUntaintedTaintedNumber extends true
        ? true
        : false
      : false

    const isIdempotent: IsIdempotent = true
    expect(isIdempotent).toBe(true)
  })

  it('is idempotent (for complex types)', () => {
    type UntaintedUntaintedTaintedStruct_extends_UntaintedTaintedStruct = UntaintedUntaintedTaintedStruct extends UntaintedTaintedStruct
      ? true
      : false
    type UntaintedTaintedStruct_extends_UntaintedUntaintedTaintedStruct = UntaintedTaintedStruct extends UntaintedUntaintedTaintedStruct
      ? true
      : false

    type IsIdempotent = UntaintedUntaintedTaintedStruct_extends_UntaintedTaintedStruct extends true
      ? UntaintedTaintedStruct_extends_UntaintedUntaintedTaintedStruct extends true
        ? true
        : false
      : false

    const isIdempotent: IsIdempotent = true
    expect(isIdempotent).toBe(true)
  })
})
