# @coderspirit/nominal-typebox

[![NPM version](https://img.shields.io/npm/v/@coderspirit/nominal-typebox.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/nominal-typebox)
[![TypeScript](https://badgen.net/npm/types/@coderspirit/nominal-typebox)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/@coderspirit/nominal-typebox)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@coderspirit/nominal-typebox.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/nominal-typebox)
[![Known Vulnerabilities](https://snyk.io//test/github/Coder-Spirit/nominal/badge.svg?targetFile=@coderspirit/nominal-typebox/package.json)](https://snyk.io//test/github/Coder-Spirit/nominal?targetFile=@coderspirit/nominal-typebox/package.json)
[![Security Score](https://snyk-widget.herokuapp.com/badge/npm/@coderspirit%2Fnominal-typebox/badge.svg)](https://snyk.io/advisor/npm-package/@coderspirit/nominal-typebox)

`Nominal-Typebox` brings [nominal typing](https://en.wikipedia.org/wiki/Nominal_type_system)
capabilities to [Typebox](https://github.com/sinclairzx81/typebox) schema
definitions by leveraging [Nominal](https://github.com/Coder-Spirit/nominal/blob/main/%40coderspirit/nominal/README.md).

## Install instructions

### Node

```
# With NPM
npm install @sinclair/typebox
npm install @coderspirit/nominal-typebox

# Or with PNPM
pnpm add @sinclair/typebox
pnpm add @coderspirit/nominal-typebox

# Or with Yarn:
yarn add @sinclair/typebox
yarn add @coderspirit/nominal-typebox
```

## Usage instructions

### Typebox' Type.String -> brandedString

```typescript
import type { FastBrand } from '@coderspirit/nominal'
import { brandedString } from '@coderspirit/nominal-typebox'

import { Object as TBObject } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

type Username = FastBrand<string, 'Username'>

// Use `brandedString` instead of Typebox' `Type.String`
const requestSchema = TBObject({
	// We can pass the same options Type.String has
	username: brandedString<'Username'>()
})
const requestValidator = TypeCompiler.Compile(requestSchema)

const requestObject = getRequestFromSomewhere() // unknown
if (!requestValidator.Check(requestObject)) {
	throw new Error('Invalid request!')
}

// At this point, the type checker knows that requestObject.username is
// "branded" as 'Username'

const username: Username = requestObject.username // OK
const corruptedUserame: Username = 'untagged string' // type error
```

### Typebox' Type.Number -> brandedNumber


```typescript
import type { FastBrand } from '@coderspirit/nominal'
import { brandedNumber } from '@coderspirit/nominal-typebox'

import { Object as TBObject } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

type Latitude = FastBrand<number, 'Latitude'>
type Longitude = FastBrand<number, 'Longitude'>

const requestSchema = TBObject({
	// We can pass the same options Type.Number has
	latitude: brandedNumber<'Latitude'>(),
	longitude: brandedNumber<'Longitude'>(),
})
const requestValidator = TypeCompiler.Compile(requestSchema)

const requestObject = getRequestFromSomewhere() // unknown
if (!requestValidator.Check(requestObject)) {
	throw new Error('Invalid request!')
}

const latitude: Latitude = requestObject.latitude // OK
const longitude: Longitude = requestObject.longitude // OK

const corruptedLat: Latitude = 10 // type error
const corruptedLon: Longitude = 10 // type error
```

### Typebox' Type.Integer -> brandedInteger

The same applies as for the two previous examples, you can use `brandedInteger`
instead of Typebox' `Type.Integer`.

### Typebox' Type.Array -> brandedArray

`brandedArray` has the same signature as Typebox' `Type.Array`, except that we
have to pass a "brand" string argument as its first parameter:

```typescript
import { brandedArray } from '@coderspirit/nominal-typebox'
import { String as TBString } from '@sinclair/typebox'

const arraySchema = brandedArray(
	'MyArray',
	// Type.Array arguments:
	TBString(),
	{ minItems: 2 }
)
```

### Typebox' Type.Object -> brandedObject

`brandedObject` has the same signature as Typebox' `Type.Object`, except that we
have to pass a "brand" string argument as its first parameter:

```typescript
import { brandedObject } from '@coderspirit/nominal-typebox'
import { String as TBString } from '@sinclair/typebox'

const objectSchema = brandedObject(
	'MyObject',
	{
		a: TBstring(),
		b: TBString()
	},
	{ additionalProperties: true }
)
```

### Typebox' Type.Union -> brandedUnion

`brandedUnion` has the same signature as Typebox' `Type.Union`, except that we
have to pass a "brand" string argument as its first parameter:

```typescript
import { brandedUnion } from '@coderspirit/nominal-typebox'
import { Literal } from '@sinclair/typebox'

const unionSchema = brandedUnion(
	'State',
	[Literal('on'), Literal('off')]
)
```
