# @coderspirit/safe-env

[![NPM version](https://img.shields.io/npm/v/@coderspirit/safe-env.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/safe-env)
[![TypeScript](https://badgen.net/npm/types/@coderspirit/safe-env)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/@coderspirit/safe-env)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@coderspirit/safe-env.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/safe-env)
[![Known Vulnerabilities](https://snyk.io//test/github/Coder-Spirit/safe-env/badge.svg?targetFile=package.json)](https://snyk.io//test/github/Coder-Spirit/safe-env?targetFile=package.json)
[![Security Score](https://snyk-widget.herokuapp.com/badge/npm/@coderspirit%2Fsafe-env/badge.svg)](https://snyk.io/advisor/npm-package/@coderspirit/safe-env)

Small library to load strongly typed values from environment variables and
enforcing constraints on them.

## Install instructions

### Node

```
# With PNPM
pnpm add @coderspirit/safe-env

# With NPM
npm install @coderspirit/safe-env

# Or with Yarn:
yarn add @coderspirit/safe-env
```

## Example

```ts
import { getSafeEnv } from '@coderspirit/safe-env'

// It validates the specified constraints at construction time
const safeEnv = getSafeEnv(process.env, {
  host: { type: 'string', default: 'localhost' },
  port: { type: 'uint16', default: 4321 },

  githubToken: { type: 'string', optional: true },
  secretToken: { type: 'string' },
})

// It leverages the powerful TypeScript's type system to tell you at
// compile time if you made a mistake.
const host = safeEnv.get('hostt') // Type Error

const host = safeEnv.get('host') // All good

// The return type tells you not only that you have a number, but also
// that it is an integer and positive.
const port = safeEnv.get('port')

// It will return undefined if the variable does not exist
const githubToken = safeEnv.get('githubToken')

// It fill fail if the variable does not exist
const secretToken = safeEnv.get('secretToken')
```

## Supported types

- `boolean`
- `string` and `string[]`
- `int8`, `int16`, `int32`, `int54`
- `int8[]`, `int16[]`, `int32[]`, `int54[]`
- `uint8`, `uint16`, `uint32`
- `uint8[]`, `uint16[]`, `uint32[]`

## Supported Constraints

### For numbers

- `min`
- `max`

### For strings

- `minLength`
- `maxLength`
- `pattern`: regular expression object.

### For arrays

- `minLength`
- `maxLength`
- `valueConstraints`: number or string constraints.
