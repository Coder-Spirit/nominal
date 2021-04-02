import { Safe } from '..'
import { TaintSymbolType } from '../internal/Symbols'

describe('Safe', () => {
  it('does not allow "tainting tag"', () => {
    type SafeWithTaint = Safe<number, TaintSymbolType>
    type SafeWithTaint_extends_never = SafeWithTaint extends never
      ? true
      : false

    const _SafeWithTaint_extends_never: SafeWithTaint_extends_never = true
    expect(_SafeWithTaint_extends_never).toBe(true)
  })
})
