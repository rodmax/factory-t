# Tutorial

## Create factory

### Using `factoryT<T>(config)`

<!-- embedme ../src/tests/tutorial-snippets.test.ts#L6-L17-->

```ts
interface User {
    id: number;
    name: string;
}
const userFactory = factoryT<User>({
    id: fields.index(),
    name: 'Paul',
});
expect(userFactory.item()).toStrictEqual({
    id: 1,
    name: 'Paul',
});
```

### Using `factoryTBuilder(config).*().*().factory()`

<!-- embedme ../src/tests/tutorial-snippets.test.ts#L21-L39-->

```ts
interface User {
    id: number;
    email: string;
    name: string;
}
const userFactory = factoryTBuilder<User>({
    id: fields.index(),
    email: fields.string(),
    name: fields.string(),
})
    .useFieldFactory('name', (ctx) => `name-${ctx.get('id')}`)
    .useFieldFactory('email', (ctx) => `${ctx.get('name')}@g.com`)
    .factory();

expect(userFactory.item({ id: 777 })).toStrictEqual({
    id: 777,
    name: 'name-777',
    email: 'name-777@g.com',
});
```

### Field helpers

WIP: `fields.index(), fields...` and etc. Right now you can study it from tests

## Generate data objects

## FAQ

### Create factory if object field contains nested object

Example will be added soon

### Is it possible to extend factory to create new one for generating extended data objects
