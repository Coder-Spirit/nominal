# @coderspirit/nominal

`Nominal` provides a powerful toolking to apply
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
- **Tags:** As you might imagine, *tags* allow us to "attach" multiple nominal
  types to a same variable. They are very useful to express things like:
  - *roles & capabilities*: some times interfaces & classes are not enough, we
    might need or want to encode many roles and/or capabilities at the same
    time for a single entity, and to use the type checker to enforce
    constraints based on that information.
  - *logical/mathematical properties*: each attached *tag* can be interpreted
    as, in some way, a property assertion (for example we could attach
    properties like *positive*, *odd* or *prime* to a number, at the same time).

On top of these three kinds of nominal type, `Nominal` also offers
[taint tracking](https://en.wikipedia.org/wiki/Taint_checking) capabilities with
zero runtime overhead.

## Install instructions

### Node

```
# With NPM
npm install @coderspirit/nominal

# Or with Yarn:
yarn add @coderspirit/nominal
```

### Deno

`Nominal` is served through different CDNs
```typescript
import { ... } from 'https://denopkg.com/Coder-Spirit/nominal@[VERSION]/nominal/deno/index.ts'
import { ... } from 'https://deno.land/x/nominal@[VERSION]/nominal/deno/index.ts'
```

## Brands

Pending explanation.
## Flavors

Pending explanation.

## Tags

### Basic tags

To define a new tagged type based on a previous type, we can do:

```typescript
import { WithTag } from '@coderspirit/nominal'

type Prime = WithTag<number, 'Prime'>

const myPrime: Prime = 23 as Prime
```

#### **Advice**
- Although we perform a "static cast" here, this should be done only when:
  - the value is a literal (as in the example)
  - in validation, sanitization and/or anticorruption layers.
- One way to protect against other developers "forging" the type is to use
  symbols instead of strings as "type tags" when defining the new nominal type.

### Combining tags

`WithTag` has been implemented in a way that allows us to easily compose many
nominal types for a same value:

```typescript
import { WithTag, WithTags } from '@coderspirit/nominal'

type Integer = WithTag<number, 'Integer'>
type Even = WithTag<number, 'Even'>
type Positive = WithTag<number, 'Positive'>

// The first way is by adding "tags" to an already "tagged" type
type EvenInteger = WithTag<Integer, 'Even'>

// The second way is by adding many "tags" at the same time
type EvenPositive = WithTags<number, ['Even', 'Positive']>
```

#### **Interesting properties**
- `WithTag` and `WithTags` are additive, commutative and idempotent.
- The previous point means that we don't have to worry about the order of
  composition, we won't suffer typing inconsistencies because of that.

#### **Unused type tags can be preserved across function boundaries**

This feature can be very useful when we need to verify many properties for the
same value and we don't want to lose this information along the way as the value
is passed from one function to another.

```typescript
function throwIfNotEven<T extends number>(v: T): WithTag<T, 'Even'> {
  if (v % 2 == 1) throw new Error('Not Even!')
  return v as WithTag<T, 'Even'>
}

function throwIfNotPositive<T extends number>(v: T): WithTag<T, 'Positive'> {
  if (v <= 0) throw new Error('Not positive!')
  return v as WithTag<T, 'Positive'>
}

const v1 = 42

// typeof v2 === WithTag<number, 'Even'>
const v2 = throwIfNotEven(v1)

// typeof v3 === WithTags<number, ['Even', 'Positive']>
const v3 = throwIfNotPositive(v2)
```

### Removing tags

If needed, we can easily remove *tags* from our types:

```typescript
import { WithTag, WithoutTag } from '@coderspirit/nominal'

type Email = WithTag<string, 'Email'>

// NotEmail === string
type NotEmail = WithoutTag<string, 'Email'>

// NotAnEmailAnymore === string
type NotAnEmailAnymore = WithoutTag<Email, 'Email'>
```

The tags that we do not explicitly remove are preserved:
```typescript
type FibonacciPrime = WithTags<number, ['Prime', 'Fibonacci']>
type Fibonacci = WithoutTag<FibonacciPrime, 'Prime'>
```

WARNING: Notice that it's not a good idea to preserve all the previous tags for
return types when the passed value is transformed. For example:
```typescript
function square<T extends number>(v: T): WithoutTag<T, 'Prime'> {
  return v * v as WithoutTag<T, 'Prime'>
}

const myNumber: FibonacciPrime = 13 as FibonacciPrime

// Notice that the return type's tag is wrong, as 169 is not a Fibonacci number
// typeof mySquaredNumber === WithTag<number, 'Fibonacci'>
// mySquaredNumber === 13*13 === 169
const mySquaredNumber = square(myNumber)

```

We can also remove many tags at once, or all of them:
```typescript
// Editor === WithTag<User, 'Editor'>
type Editor = WithoutTags<
  WithTags<User, ['Editor', 'Moderator', 'Admin']>,
  ['Moderator', 'Admin']
>

// NewNumber === number
type NewNumber = WithoutTags<FibonacciPrime>
```

### Negating tags

If needed, we can easily **negate** *tags* from our types. This is similar to
removing them, but it allows us to reject some values with certain tags.

```typescript
import { WithTag, NegateTag } from '@coderspirit/nominal'

type Email = WithTag<string, 'Email'>
type NegatedEmail = NegateTag<string, 'Email'>
type NegatedEmail2 = NegateTag<Email, 'Email'>

const email: Email = 'coyote@ac.me' as Email

// The type checked accepts this
const untypedEmail: string = email

// The type checker will error with any of the following two lines
const notEmail1: NegatedEmail = email // ERROR!
const notEmail2: NegatedEmail2 = email // ERROR!

// NotEmail & NotAnEmailAnymore are still compatible with string
const notEmail3: NegatedEmail = 'not an email'
const notEmail4: string = notEmail3 // This is OK :)

const notEmail5: NegatedEmail2 = 'not an email anymore'
const notEmail6: string = notEmail5 // This is also OK :)
```

This can be a powerful building block to implement values tainting, although we
already provide an out-of-box solution for that.

### Advanced use cases

Now that we know how to [add](#basic-tags), [remove](#removing-tags), and
[negate](#negating-tags) tags, let's see a fancy example:

```typescript
// By combining tags & tag negations we can define types that allow us to
// express logical or mathematical properties in a consistent way.

// Now we can use `Even` and `Odd` without fearing that they will be used at the
// same time for the same variable.
type Even<N extends number = number> = NegateTag<WithTag<N, 'Even'>, 'Odd'>
type Odd<N extends number = number> = NegateTag<WithTag<N, 'Odd'>, 'Even'>
type ChangeParity<N extends Even | Odd> = N extends Even ? Odd : Even

type Positive<N extends number = number> = NegateTag<WithTag<N, 'Positive'>, 'Negative'>
type Negative<N extends number = number> = NegateTag<WithTag<N, 'Negative'>, 'Positive'>

// We preserve sign when the number is positive for obvious reasons, but we
// cannot do the same for negative values (for example for the value -0.5).
type PlusOneResult<N extends Even | Odd> = N extends Positive
  ? Positive<ChangeParity<N>> // Notice that we do not write Positive & ChangeParity<N>
  : ChangeParity<N>

function <N extends Even | Odd>plusOne(v: N): PlusOneResult<N> {
  return v + 1 as PlusOneResult<N>
}

const positiveEven: Positive<Even> = 42 as Positive<Even>
const positiveOdd: Positive<Odd> = 3 as Positive<Odd>

// typeof positiveEvenPlus1 == Positive<Odd>
const positiveEvenPlus1 = plusOne(positiveEven)

// typeof positiveOddPlus1 === Positive<Even>
const positiveOddPlus1 = plusOne(positiveOdd)



```

## Tainting

### Tainting values

While using *brands*, *flavors* and *tags* is often enough, sometimes it can be
handy to mark all the values coming from the "external world" as *tainted* (and
therefore "dangerous"), independently of whether we took the time to assign them
a specific nominal type or not.

`Nominal` provides the types `Tainted<T>` and `Untainted<T>`, both of them
operate recursively on `T`.

```typescript
import { Tainted, Untainted } from '@coderspirit/nominal'

interface LoginRequest {
  username: string
  password: string
}

type TaintedLoginRequest = Tainted<LoginRequest>
type UntaintedLoginRequest = Untainted<LoginRequest>

function validateLoginRequest(req: TaintedLoginRequest): UntaintedLoginRequest {
  // throw Error if `req` is invalid
  return req as UntaintedLoginRequest
}

// This function accepts LoginRequest and UntaintedLoginRequest,
// but not TaintedLoginRequest
function login(req: UntaintedLoginRequest): void {
  // Do stuff
}

// When req is tainted, we cannot pass req.password to this function, as all
// req's fields are tainted as well.
function doStuffWithPassword(password: Untainted<string>): void {
  // Do stuff
}
```

While this specific use case is far from being exciting and quite simplistic,
this idea can be applied to much more sensitive and convoluted scenarios.

### Generic tainting

While it's difficult to imagine how a value might be tainted in multiple ways,
it's not unheard of. This could be useful when managing sensitive information,
if we need/want to statically enforce that some data won't cross certain
boundaries.

```typescript
import { GenericTainted, GenericUntainted } from '@coderspirit/nominal'

type BlueTaintedNumber = GenericTainted<number, 'Blue'>
type RedTaintedNumber = GenericTainted<number, 'Red'>

// Double-tainted type!
type BlueRedTaintedNumber = GenericTainted<BlueTaintedNumber, 'Red'>

// We removed again the 'Blue' taint
type OnlyBlueTaintedNumber = GenericUntainted<BlueRedTaintedNumber, 'Red'>
```
