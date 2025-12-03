# factory-t

![factory-t](docs/factory-t-logo.svg)

[![build/tests](https://github.com/rodmax/factory-t/actions/workflows/ci.yaml/badge.svg)](https://github.com/rodmax/factory-t/actions/workflows/ci.yaml?query=branch%3Amain)
[![npm](https://img.shields.io/npm/v/factory-t)](https://www.npmjs.com/package/factory-t)
[![SonarQualityStatus](https://sonarcloud.io/api/project_badges/measure?project=rodmax_factory-t&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rodmax_factory-t)

> pronounced like `ˈfakt(ə)rē tē`

TypeScript library for building data objects.

Useful for unit tests and mocking data during development.

With strong typing in mind.

## Goals

-   Provide a factory for building data objects based on a predefined config
-   The factory instance should **strongly depend** on the target TypeScript
    interface, so if the interface changes, the factory should not be built
    until it is synced with the interface changes
-   All kinds of API "sugar" are appreciated, but with typings in mind

## Install

```bash
npm install factory-t
```

## Usage

To get started you need to:

-   Design your data type
<!-- embedme ./src/tests/readme-snippets.test.ts#L6-L15-->

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

-   Import the right tools
<!-- embedme ./src/tests/readme-snippets.test.ts#L1-L1-->

```ts
import { factoryT, fields } from 'factory-t';
```

-   Create a factory (or a set of factories)
<!-- embedme ./src/tests/readme-snippets.test.ts#L17-L28-->

```ts
const profileFactory = factoryT<UserDto['profile']>({
    avatarUrl: 'my.site/avatar',
    language: fields.sequence(['EN', 'RU']),
    statusString: fields.optional('sleeping'),
});

const userFactory = factoryT<UserDto>({
    id: fields.index(),
    email: (ctx) => `user-${ctx.index}@g.com`,
    phone: fields.nullable('+127788'),
    profile: (ctx) => profileFactory.item({ avatarUrl: `/avatars/${ctx.index}` }),
});
```

-   Use it to build objects

<!-- embedme ./src/tests/readme-snippets.test.ts#L30-L39-->

```ts
expect(userFactory.item({ phone: null })).toStrictEqual({
    id: 1,
    email: 'user-1@g.com',
    phone: null, // overridden by the partial passed to item(...)
    profile: {
        avatarUrl: '/avatars/1', // overridden by userFactory using its index
        language: 'EN',
        statusString: 'sleeping',
    },
});
```

See [tutorial](./docs/tutorial.md) and/or
[unit test](./src/tests/factory-t.test.ts) for details.

## Status

I use this library in all my current projects (mostly for unit tests).

In my opinion, it has a simple implementation, so if you like its API, you can
try using it too.

## Similar projects

### [rosie](https://github.com/rosiejs/rosie) - nice library, good intuitive API

If you write in JavaScript, it should solve all your needs.

The main drawback is typings. This library has `@types/rosie`, but it uses a
"builder" pattern which does not allow strong type checking between the factory
and the target interface.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update tests as appropriate.

For more details see the [development guide](DEVELOPMENT.md).

## License

[MIT](https://choosealicense.com/licenses/mit/)
