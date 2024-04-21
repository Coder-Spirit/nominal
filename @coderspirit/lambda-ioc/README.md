# @coderspirit/lambda-ioc

[![NPM version](https://img.shields.io/npm/v/@coderspirit/lambda-ioc.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/lambda-ioc)
[![TypeScript](https://badgen.net/npm/types/@coderspirit/lambda-ioc)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/@coderspirit/lambda-ioc)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@coderspirit/lambda-ioc.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/lambda-ioc)
[![Known Vulnerabilities](https://snyk.io//test/github/Coder-Spirit/lambda-ioc/badge.svg?targetFile=package.json)](https://snyk.io//test/github/Coder-Spirit/lambda-ioc?targetFile=package.json)
[![Security Score](https://snyk-widget.herokuapp.com/badge/npm/@coderspirit%2Flambda-ioc/badge.svg)](https://snyk.io/advisor/npm-package/@coderspirit/lambda-ioc)

> Super type safe dependency injection 💉 for TypeScript

## Install instructions

### Node

```
# With PNPM
pnpm add @coderspirit/lambda-ioc

# With NPM
npm install @coderspirit/lambda-ioc

# With Yarn:
yarn add @coderspirit/lambda-ioc
```

## Example

```ts
import { createContainer } from '@coderspirit/lambda-ioc'
import { pino } from 'pino'

import { getDb } from './infra/db.ts'
import {
  buildService,
  buildServiceA,
  buildServiceB
} from './services.ts'
import { buildServer } from './server.ts'

const container = createContainer()
  // We can register already instantiated values
  .registerValue('logger', pino())
  // We can register factories as well
  .registerFactory('logger2', pino)
  // Factories don't guarantee returning the same instance every time,
  // which can be necessary sometimes, so we provide a solution:
  .registerSingleton('logger3', pino)
  .registerSingleton('db', getDb)
  // We can also pass dependencies to factories and singleton factories.
  // What follows is "equivalent" to:
  // .registerValue('service', buildService(pino(), getDb()))
  .registerSingleton('service', buildService, 'logger', 'db')
  // The type checker will raise an error if we try to pass dependencies
  // that we didn't specify before, protecting us from having errors at
  // runtime:
  .registerSingleton('brokenService', buildService, 'logger', 'db2')
  // We might want to register some things within "groups". This is done
  // by specifying a prefix. We'll see later how this can be useful:
  .registerSingleton('svc:a', buildServiceA, 'logger', 'db')
  .registerSingleton('svc:b', buildServiceB, 'logger', 'db')
  // Sometimes our factories are asynchronous
  .registerAsyncFactory('asyncStuff', async () => Promise.resolve(42))
  .registerAsyncSingleton(
    'aSingleton',
    async () => Promise.resolve({ v: 42 })
  )
  // We can inject groups into other registered dependencies by using
  // the `:*` suffix
  .registerAsync('server', buildServer, 'svc:*')
  // The next call is not strictly necessary, but it helps to "clean up"
  // the container's type for faster type checking.
  .close()

// Once we have the container, we can start resolving its registered
// values in a type-safe way:

// The type checker will know that `logger` is an instance of `Logger`
const logger = container.resolve('logger')

// The type checker will raise an error because it knows we didn't
// register anything under the key 'wrong'.
const wrong = container.resolve('wrong')

// To resolve what we registered asynchronously, we have to use the
// asynchronous resolver
const asyncStuff = await container.resolveAsync('asyncStuff')

// We can't resolve synchronously what was registered asynchronously,
// what follows will raise a type checking error:
const asyncAsSync = container.resolve('asyncStuff')

// To resolve "groups", we also have to do it asynchronously, even if
// they were registered synchronously. This is because groups can have
// synchronous and asynchronous dependencies.
// `svcGroup` will be an array (with arbitrary order) containing the
// dependencies registered under the 'svc:` prefix.
const svcGroup = await container.resolveGroup('svc')

// Having a specific method to resolve groups is fine, but it does not
// fit well in dependency resolution pipelines. For this reason, we also
// provide a way to asynchronously resolve groups by relying on the `:*`
// suffix, so we can pass whole groups as dependencies.
const svcGroup = await container.resolveAsync('svc:*')
```

## Other considerations

While this library is intended to provide compile-time safety, it also provides
runtime safety to ensure that there are no surprises when it's used in pure JS
projects.

## Benefits

- 100% type safe:
  - The type checker will complain if we try to resolve unregistered
    dependencies.
  - The type checker will complain if we try to register new dependencies that
    depend on unregistered dependencies, or if there is any kind of type
    mismatch.
- Purely functional
- Immutable
- Circular dependencies are impossible

## Drawbacks

- All dependencies must be declared "in order".
  - This implies that this IoC container cannot be used in combination with some
    auto-wiring solutions, such as IoC decorators.
- The involved types are a bit convoluted:
  - They might cause the type checker to be slow.
  - In some situations, the type checker might be unable to infer the involved
    types due to excessive "nested types" depth.
