# factory-t (WIP)

[![Build Status](https://travis-ci.org/rodmax/factory-t.svg?branch=master)](https://travis-ci.org/rodmax/factory-t) [![Greenkeeper badge](https://badges.greenkeeper.io/rodmax/factory-t.svg)](https://greenkeeper.io/)

> pronounced like `ˈfakt(ə)rē tē`

Library for building JavaScript/TypeScript objects... with strong typing in mind


## Usage

```ts
import { FactoryT, INDEX_KEY, makeSequenceFromEnum } from './factory-t';
interface User {
    id: number;
    role: Role;
    email: string;
    profile: { avatar: string }
}

type Role {
    Admin: 'admin',
    Watcher: 'watcher',
}

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
console.log(userFactory.build());
/* {
    id: 1,
    role: 'admin',
    email: 'admin-1@test.domain',
    profile: {
        avatar: 'http://const-avatar-url-for-all-user',
        }
    }
*/
```

See [more examples](./src/factory-t.examples.test.ts.md)

## Development

### Run tests

```bash
npm run test

# watch mode
npm run test:watch
```

### Git workflow
We use [commitizen](https://github.com/commitizen/cz-cli) tool and approach to write commit messages

so if you decide to do something useful please install it

```bash
npm i -g commitizen
```
