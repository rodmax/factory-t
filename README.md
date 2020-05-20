# factory-t

![build/tests](https://github.com/rodmax/factory-t/workflows/build/tests/badge.svg)
[![Greenkeeper badge](https://badges.greenkeeper.io/rodmax/factory-t.svg)](https://greenkeeper.io/)

> pronounced like `ˈfakt(ə)rē tē`

TypeScript library for building data objects
Useful for unit tests and mocking data during development

With strong typing in mind

## Goals

-   Provide factory for building data objects based on predefined config
-   Factory instance should **strongly depends** from target TypeScript interface, so if interface will changed factory should not be built until syncing with interface changes
-   All kind of API "sugar" appreciated but with typings in mind

## Install

```bash
npm install factory-t
```

## Usage

To start you need

-   Design your data type
<!-- embedme ./src/tests/readme-snippets.test.ts#L5-L14-->

```ts
interface UserDto {
    id: number;
    email: string;
    phone: string | null;
    profile: {
        avatarUrl: string;
        language: 'EN' | 'RU';
        statusString?: string;
    };
}
```

-   Import right tools
<!-- embedme ./src/tests/readme-snippets.test.ts#L1-L1-->

```ts
import { factoryT, indexField, sequenceField, nullableField, optionalField } from 'factory-t';
```

-   create factory (or bunch of factories)
<!-- embedme ./src/tests/readme-snippets.test.ts#L16-L27-->

```ts
const profileFactory = factoryT<UserDto['profile']>({
    avatarUrl: 'my.site/avatar',
    language: sequenceField(['EN', 'RU']),
    statusString: optionalField('sleeping'),
});

const userFactory = factoryT<UserDto>({
    id: indexField(),
    email: (ctx) => `user-${ctx.index}@g.com`,
    phone: nullableField('+127788'),
    profile: (ctx) => profileFactory.item({ avatarUrl: `/avatars/${ctx.index}` }),
});
```

-   and use it to build objects

<!-- embedme ./src/tests/readme-snippets.test.ts#L29-L38-->

```ts
expect(userFactory.item({ phone: null })).toStrictEqual({
    id: 1,
    email: 'user-1@g.com',
    phone: null, // override by passed partial to item(...)
    profile: {
        avatarUrl: '/avatars/1', // override by userFactory using its index
        language: 'EN',
        statusString: 'sleeping',
    },
});
```

See [unit test](./src/tests/factory-t.test.ts) for details

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
