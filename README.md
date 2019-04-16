# factory-t

[![Build Status](https://travis-ci.org/rodmax/factory-t.svg?branch=master)](https://travis-ci.org/rodmax/factory-t) [![Greenkeeper badge](https://badges.greenkeeper.io/rodmax/factory-t.svg)](https://greenkeeper.io/)

> pronounced like `ˈfakt(ə)rē tē`

TypeScript library for building data objects
Useful for unit tests and mocking data during development

With strong typing in mind

## Goals
- Provide factory for building data objects based on predefined config
- Factory instance should **strongly depends** from target TypeScript interface, so if interface will changed factory should not be built until syncing with interface changes
- All kind of API "sugar" appreciated but with typings in mind

## Install

```bash
npm install factory-t
```

## Usage


```ts
import { FactoryT, INDEX_KEY, makeSequenceFromEnum } from 'factory-t';

interface User {
    id: number;
    role: Role;
    email: string;
    profile: { avatar: string }
}

enum Role {
    Admin = 'admin',
    Watcher = 'watcher',
}

// Create factory in strongly dependency to target interface
const userFactory = FactoryT<User>({
    id: INDEX_KEY,
    role: makeSequenceFromEnum(Role),
    email: {
        deps: ['id', 'role'],
        make: ctx => `${ctx.partial.role}-${ctx.partial.id}@test.domain`,
    }
    profile: {
        value: {avatar: 'http://const-avatar-url-for-all-user'}
    }
});

// Then use build() or buildList() methods to generate data

userFactory.buildList({
    count: 3,
    partials: [{}, { email: 'SECOND-USER@G.COM' }]
});

// Result:
[
    {
        id: 1,
        role: 'admin',
        email: 'admin-1@test.domain',
        profile: { avatar: 'http://const-avatar-url-for-all-user' }
    },
    {
        id: 2,
        role: 'watcher',
        email: 'SECOND-USER@G.COM',
        profile: { avatar: 'http://const-avatar-url-for-all-user' }
    },
    {
        id: 3,
        role: 'admin',
        email: 'admin-3@test.domain',
        profile: { avatar: 'http://const-avatar-url-for-all-user' }
    },
]
```

See [API documentation](./src/factory-t.examples.test.ts.md)
or [unit test](./src/factory-t.test.ts) for details

## Status
I use this library in all current projects (mostly for unit tests)

In my opinion it has simple implementation
so if you like its API, you can try use it too


## Similar projects

### [rosie](https://github.com/rosiejs/rosie) - nice library, good intuitive API.

if you write on JavaScript, it should solve all your needs.

The main drawback is typings. This library has `@types/rosie` but it uses "builder" pattern which not allows to strong type checking between factory and target interface


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

For more details see [development guide](DEVELOPMENT.md)


## License
[MIT](https://choosealicense.com/licenses/mit/)

