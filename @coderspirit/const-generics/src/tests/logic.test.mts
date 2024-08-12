import type { And, Nand, Nor, Not, Or, Xnor, Xor } from '../logic.d.mts'

export const not_f: Not<false> = true
export const not_t: Not<true> = false

export const and_ff: And<false, false> = false
export const and_ft: And<false, true> = false
export const and_tf: And<true, false> = false
export const and_tt: And<true, true> = true

export const or_ff: Or<false, false> = false
export const or_ft: Or<false, true> = true
export const or_tf: Or<true, false> = true
export const or_tt: Or<true, true> = true

export const xor_ff: Xor<false, false> = false
export const xor_ft: Xor<false, true> = true
export const xor_tf: Xor<true, false> = true
export const xor_tt: Xor<true, true> = false

export const nand_ff: Nand<false, false> = true
export const nand_ft: Nand<false, true> = true
export const nand_tf: Nand<true, false> = true
export const nand_tt: Nand<true, true> = false

export const nor_ff: Nor<false, false> = true
export const nor_ft: Nor<false, true> = false
export const nor_tf: Nor<true, false> = false
export const nor_tt: Nor<true, true> = false

export const xnor_ff: Xnor<false, false> = true
export const xnor_ft: Xnor<false, true> = false
export const xnor_tf: Xnor<true, false> = false
export const xnor_tt: Xnor<true, true> = true
