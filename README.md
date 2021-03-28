# @coderspirit/nominal

This library provides some powerful types to implement nominal typing and values
tainting with zero runtime overhead. This can be very useful to enforce complex
pre-conditions and post-conditions, and to make your code more secure against
malicious inputs.

## Basic nominal types

To define a new nominal type based on a previous type, we can do:

```typescript
import { WithTag } from '@coderspirit/nominal'

type Email = WithTag<string, 'Email'>

const email: Email = 'coyote@ac.me' as Email
```

### Advice
- Although we perform a "static cast" here, this should be done only in
  validation, sanitization and/or anticorruption layers.
- One way to protect against other developers "forging" the type is to use
  symbols instead of strings as "type tags" when defining the new nominal type.

## Combining nominal types

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

### Interesting properties
- `WithTag` and `WithTags` are additive, commutative and idempotent.
- The previous point means that we don't have to worry about the order of
  composition, we won't suffer typing inconsistencies because of that.

### Unused type tags can be preserved across function boundaries

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

## Removing nominal types

If needed, we can easily remove "tags" from our types:

```typescript
import { WithTag, WithoutTag } from '@coderspirit/nominal'

type Email = WithTag<string, 'Email'>
type NotEmail = WithoutTag<string, 'Email'>
type NotAnEmailAnymore = WithoutTag<Email, 'Email'>

const email: Email = 'coyote@ac.me' as Email

// The type checked accepts this
const untypedEmail: string = email

// The type checker will error with any of the following two lines
const notEmail1: NotEmail = email
const notEmail2: NotAnEmailAnymore = email

// NotEmail & NotAnEmailAnymore are still compatible with string
const notEmail3: NotEmail = 'not an email'
const notEmail4: string = notEmail3 // This is OK :)

const notEmail5: NotAnEmailAnymore = 'not an email anymore'
const notEmail6: string = notEmail5 // This is also OK :)
```

This can be a powerful building block to implement values tainting, although we
already provide an out-of-box solution for that.

## Tainting values

While using nominal types in the typical way is often enough, sometimes it can
be handy to mark all the values coming from the "external world" as tainted (and
therfore "dangerous"), independently of whether we took the time to assign them
a specific nominal type or not.

`@coderspirit/nominal` provides the types `Tainted<T>` and `Untainted<T>`, both
of them operate recursively on `T`.

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

### Advice

If you really want to use the tainting feature, it's better to rely on these two
types, rather than trying to do it with `WithTag` and `WithoutTags`, as there
are some complicated details to take into account, like nested tainting.

## "Safe" values

We also have a handy shortcut to combine (un)tainting with other nominal types:
```typescript
import { Safe, Tainted } from '@coderspirit/nominal'

// Compared with WithTag, it imposes slightly stricter conditions when used in
// function signatures.
type Email = Safe<string, 'Email'>

type InsecureString = Tainted<string>

// It can be applied to "tainted types" too.
type PostalCode = Safe<InsecureString, 'PostalCode'>
```

## Generic tainting

While it's difficult to imagine how a value might be tainted in multiple ways,
it's not unheard of. This could be useful when managing sensitive information,
if we need/want to statically enforce that some data won't cross certain
boundaries.

```typescript
import { GenericTainted, GenericUntainted, GenericSafe } from '@coderspirit/nominal'

type BlueTaintedNumber = GenericTainted<number, 'Blue'>
type RedTaintedNumber = GenericTainted<number, 'Red'>

// Double-tainted type!
type BlueRedTaintedNumber = GenericTainted<BlueTaintedNumber, 'Red'>

// We removed again the 'Blue' taint
type OnlyBlueTaintedNumber = GenericUntainted<BlueRedTaintedNumber, 'Red'>

// We removed the 'Red' taint, and added a "type tag"
type SafeOnBlueZoneNumber = GenericSafe<BlueRedTaintedNumber, 'SafeOnBlue', 'Blue'>
```
