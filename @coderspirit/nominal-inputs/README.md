# @coderspirit/nominal

[![NPM version](https://img.shields.io/npm/v/@coderspirit/nominal-inputs.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/nominal-inputs)
[![TypeScript](https://badgen.net/npm/types/@coderspirit/nominal-inputs)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/@coderspirit/nominal-inputs)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@coderspirit/nominal-inputs.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/nominal-inputs)

`Nominal-Inputs` is an extension for [`Nominal`](https://www.npmjs.com/package/@coderspirit/nominal).

## Install instructions

### Node

```
# With NPM
npm install @coderspirit/nominal-inputs

# Or with PNPM
pnpm add --save-dev @coderspirit/nominal-inputs

# Or with Yarn:
yarn add --dev @coderspirit/nominal-inputs
```

## Input Types

Input types are specifically designed to be used for function parameters, and we
have to use them in a very specific way. Examples below.

### `IntegerInput<N>`

```typescript
import type { IntegerInput } from '@coderspirit/nominal-inputs'

// Notice how we have to declare a generic type parameter in order to use
// `IntegerInput`
function onlyAcceptsIntegers<N extends number>(n: IntegerInput<N>): number {
  return n
}

// Using the function
onlyAcceptsIntegers(42) // All good :D
onlyAcceptsIntegers(0.5) // Type Error!
```

### Other Input types

- `NegativeInput<N>`
- `NegativeIntegerInput<N>`
- `PositiveInput<N>`
- `PositiveIntegerInput<N>`

## Tagged Types

The tagged types introduced by this package are not "special" as the previously
referred "input types", but they rely on the powerful features of `Nominal`.

Use them to track properties that you already verified either statically or at
runtime, so you can avoid having to check them again.

- `TaggedFloat<N>`
- `TaggedInteger<N>`
- `TaggedNegative<N>`
- `TaggedNegativeFloat<N>`
- `TaggedNegativeInteger<N>`
- `TaggedPositive<N>`
- `TaggedPositiveFloat<N>`
- `TaggedPositiveIntegger<N>`
