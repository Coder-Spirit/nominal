# @coderspirit/nominal

[![NPM version](https://img.shields.io/npm/v/@coderspirit/nominal.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/nominal)
[![TypeScript](https://badgen.net/npm/types/@coderspirit/nominal)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/@coderspirit/nominal)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@coderspirit/nominal.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/nominal)
[![Known Vulnerabilities](https://snyk.io//test/github/Coder-Spirit/nominal/badge.svg?targetFile=package.json)](https://snyk.io//test/github/Coder-Spirit/nominal?targetFile=package.json)
[![Security Score](https://snyk-widget.herokuapp.com/badge/npm/@coderspirit%2Fnominal/badge.svg)](https://snyk.io/advisor/npm-package/@coderspirit/nominal)

`Nominal` provides a powerful toolkit to apply
[nominal typing](https://en.wikipedia.org/wiki/Nominal_type_system) on
[Typescript](https://www.typescriptlang.org/) with zero runtime overhead.

It offers three kinds of nominal types:

- **Brands:** Brands basically match the traditional concept of nominal typing.
  Branded values can only belong to one *brand*, and branded variables only
  accept values with that same *brand*.
- **Flavors:** *Flavors* are similar to brands, with one difference: flavored
  variables also accept unbranded/unflavored values with the same *base type*.
  They are very useful when dealing with "rigid" code generators or other cases
  where we would be forced to write tons of mappings just to content the type
  checker.
- **Properties:** They are very useful to express things like logical and
  mathematical properties, but also to implement a weak form of
  [dependent types](https://en.wikipedia.org/wiki/Dependent_type).

While each type can only have either a *brand* or a *flavor*, we can easily
combine *brands* or *flavors* with *properties*.

## Install instructions

### Node

```
# With NPM
npm install @coderspirit/nominal

# Or with Yarn:
yarn add @coderspirit/nominal
```

### [Deno](https://deno.land/)

`Nominal` is served through different CDNs
```typescript
import { ... } from 'https://denopkg.com/Coder-Spirit/nominal@[VERSION]/nominal/deno/index.ts'
import { ... } from 'https://deno.land/x/nominal@[VERSION]/nominal/deno/index.ts'
```

## Brands

```typescript
import { WithBrand } from '@coderspirit/nominal'

type Email = WithBrand<string, 'Email'>
type Username = WithBrand<string, 'Username'>

const email: Email = 'admin@acme.com' as Email // Ok
const user: Username = 'admin' as Username // Ok
const text: string = email // OK
const anotherText: string = user // Ok

const eMail: Email = 'admin@acme.com' // Error, as we don't have a cast here
const mail: Email = user // Error, as the brands don't match
```

#### **Advice**
- Although we perform a "static cast" here, this should be done only when:
  - the value is a literal (as in the example)
  - in validation, sanitization and/or anticorruption layers.
- One way to protect against other developers "forging" the type is to use
  symbols instead of strings as property keys or property values when defining
  the new nominal type.

## Flavors

```typescript
import { WithFlavor } from '@coderspirit/nominal'

type Email = WithFlavor<string, 'Email'>
type Username = WithFlavor<string, 'Username'>

const email: Email = 'admin@acme.com' as Email // Ok
const user: Username = 'admin' as Username // Ok
const text: string = email // OK
const anotherText: string = user // Ok

const eMail: Email = 'admin@acme.com' // Ok, flavors are more flexible than brands
const mail: Email = user // Error, as the flavors don't match
```

#### **Advice**
- Although we perform a "static cast" here, this should be done only when:
  - the value is a literal (as in the example)
  - in validation, sanitization and/or anticorruption layers.
- One way to protect against other developers "forging" the type is to use
  symbols instead of strings as property keys or property values when defining
  the new nominal type.


## Properties

### Introduction

To define a new type with a property, we can do:

```typescript
import { WithProperty } from '@coderspirit/nominal'
type Even = WithProperty<number, 'Parity', 'Even'>
const myEven: Even = 42 as Even
```

If we want to use the properties as simple tags, we can omit the property value,
and it will implicitly default to `true`, although it's less flexible:

```typescript
import { WithProperty } from '@coderspirit/nominal'
type Positive = WithProperty<number, 'Positive'>
const myPositive: Positive = 1 as Positive
```

#### **Advice**
- Although we perform a "static cast" here, this should be done only when:
  - the value is a literal (as in the example)
  - in validation, sanitization and/or anticorruption layers.
- One way to protect against other developers "forging" the type is to use
  symbols instead of strings as property keys or property values when defining
  the new nominal type.

#### **Interesting properties**
- `WithProperty` is additive, commutative and idempotent.
- The previous point means that we don't have to worry about the order of
  composition, we won't suffer typing inconsistencies because of that.

### Crazy-level strictness

If we want, we can even define "property types", to ensure that we don't set
invalid values:

```typescript
import { PropertyTypeDefinition, WithStrictProperty } from '@coderspirit/nominal'
type Parity = PropertyTypeDefinition<'Parity', 'Even' | 'Odd'>

// == WithProperty<number, 'Parity', 'Even'>
type Even = WithStrictProperty<number, Parity, 'Even'>

// == never
type Wrong = WithStrictProperty<number, Parity, 'Seven'>
```

### Advanced use cases (pseudo dependent types)

#### Faster brands and flavors

The types `WithBrand` and `WithFlavor`, although quite simple in their purpose,
hide a quite complex machinery that exists for the sole purpose of maintaining
full compatibility with other more complex types such as `WithProperty`.

Most times we won't really need to rely on such complex mechanisms because we
apply `WithBrandh` and `WithFlavor` to basic types. So, if we want to minimize
our compilation types, we can chose a simpler and faster implementation:

```typescript
import {
  FastBrand,
  FastFlavor,
  WithBrand,
  WithFlavor
} from '@coderspirit/nominal'

// These two types are 100% equivalent, but the second one takes less time to be
// compiled. Notice that they are 100% equivalent only because they were applied
// to "basic" types (without other associated metadata, like `WithProperty`).
type SlowEmailType = WithBrand<string, 'Email'>
type FastEmailType = FastBrand<string, 'Email'>

// Same for flavors.
type SlowPhoneNumberType = WithFlavor<string, 'PhoneNumber'>
type FastPhoneNumberType = FastFlavor<string, 'PhoneNumber'>
```

#### **Properties can be preserved across function boundaries**

This feature can be very useful when we need to verify many properties for the
same value and we don't want to lose this information along the way as the value
is passed from one function to another.

```typescript
function throwIfNotEven<T extends number>(v: T): WithProperty<T, 'Parity', 'Even'> {
  if (v % 2 == 1) throw new Error('Not Even!')
  return v as WithProperty<T, 'Even'>
}

function throwIfNotPositive<T extends number>(v: T): WithProperty<T, 'Sign', 'Positive'> {
  if (v <= 0) throw new Error('Not positive!')
  return v as WithProperty<T, 'Positive'>
}

const v1 = 42

// typeof v2 === WithProperty<number, 'Parity', 'Even'>
const v2 = throwIfNotEven(v1)

// typeof v3 extends WithProperty<number, 'Parity', 'Even'>
// typeof v3 extends WithProperty<number, 'Sign', 'Positive'>
const v3 = throwIfNotPositive(v2)
```

#### Chosing what properties to preserve across function boundaries

In the previous example, we could add many properties because we were just
making assertions about the values. When we transform the passed values, we must
be more careful about what we preserve.

As a simple example of what we are telling here, we can see that adding `1` to a
numeric variable would flip its parity, so in that case we wouldn't want to keep
that property on the return value.

```typescript
type Even<N extends number = number> = WithProperty<N, 'Parity', 'Even'>
type Odd<N extends number = number> = WithProperty<N, 'Parity', 'Odd'>

// 1. 'Parity' is overwritten (when available)
// 2. 'Sign' is kept only if it's positive
// 3. We discard all other properties because they might stop being true
type PlusOneResult<N> = KeepProperties<
  N extends Even
    ? KeepPropertyIfValueMatches<Odd<N>, 'Sign', 'Positive'>
    : N extends Odd
    ? KeepPropertyIfValueMatches<Even<N>, 'Sign', 'Positive'>
    : KeepPropertyIfValueMatches<N, 'Sign', 'Positive'>,
  'Sign' | 'Parity'
>

function plusOne<N extends number>(v: N): PlusOneResult<N> {
  return v + 1 as PlusOneResult<N>
}
```
