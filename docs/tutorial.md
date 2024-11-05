# Tutorial

<!-- toc -->

-   [Create factory](#create-factory)
    -   [Using config](#using-config)
        -   [Specify field](#specify-field)
            -   [By value](#by-value)
            -   [By function](#by-function)
            -   [By build-in `fields` helpers](#by-build-in-fields-helpers)
    -   [Factory builder](#factory-builder)
-   [Generate data objects](#generate-data-objects)
    -   [Single item](#single-item)
    -   [List](#list)
-   [FAQ](#faq)
    -   [is it possible to somehow reset the index value](#is-it-possible-to-somehow-reset-the-index-value)
    -   [Is it possible to extend factory](#is-it-possible-to-extend-factory)

<!-- tocstop -->

## Create factory

Before we start generating objects, we need to create the factory itself

### Using config

In most cases, a factory can be created using the `factoryT(config)` function

> `config` is an object that specifies both the type and logic of fields generating for future objects

<!-- embedme ../src/tests/tutorial-snippets.test.ts#L7-L18-->

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

#### Specify field

##### By value

Here we just pass value which will be passed to generated object directly

```ts
factoryT({
    string: 'string',
    number: 12,
    enum: SomeEnum.Value
    const: 'const-str' as const
    numberArray: [1, 2, 3]
})
```

##### By function

```ts
factoryT({
    string: (ctx) => `here we have access to ${ctx.index} and ${ctx.options}`,
});
```

##### By build-in `fields` helpers

```ts
import { factoryT, fields } from 'factory-t';
factoryT({
    nullableStringNullByDefault: fields.nullable<string>(null),
    nullableStringSomeValueByDefault: fields.nullable('some-value'),
    optionalNumber: fields.optional(12),
    numberGeneratedBySequence: fields.sequence([1, 2, 3]),
    indexField: fields.index(),
});
```

### Factory builder

In some advanced cases a factory is constructed using a builder, such as:

-   one field depends from another(s)

```ts
// ../src/tests/tutorial-snippets.test.ts#L22-L40

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
    .setFieldFactory('name', (ctx) => `name-${ctx.inject('id')}`)
    .setFieldFactory('email', (ctx) => `${ctx.inject('name')}@g.com`)
    .factory();

expect(userFactory.item({ id: 777 })).toStrictEqual({
    id: 777,
    name: 'name-777',
    email: 'name-777@g.com',
});
```

## Generate data objects

### Single item

```ts
factory.item();
```

### List

```ts
// ../src/tests/tutorial-snippets.test.ts#L46-L69

interface User {
    id: number;
    name: string;
}
const userFactory = factoryT<User>({
    id: fields.index(),
    name: (ctx) => `name-${ctx.index}`,
});

expect(userFactory.list({ count: 2 })).toStrictEqual([
    { id: 1, name: 'name-1' },
    { id: 2, name: 'name-2' },
]);

expect(userFactory.list({ partials: [{ id: 700 }, {}, { id: 900 }] })).toStrictEqual([
    { id: 700, name: 'name-3' },
    { id: 4, name: 'name-4' },
    { id: 900, name: 'name-5' },
]);

expect(userFactory.list({ count: 2, partial: { name: 'custom-name' } })).toStrictEqual([
    { id: 6, name: 'custom-name' },
    { id: 7, name: 'custom-name' },
]);
```

## FAQ

### is it possible to somehow reset the index value

```ts
// ../src/tests/tutorial-snippets.test.ts#L124-L127

const factory = factoryT({ id: fields.index() });
expect(factory.list({ count: 2 })).toStrictEqual([{ id: 1 }, { id: 2 }]);
factory.resetCount();
expect(factory.list({ count: 2 })).toStrictEqual([{ id: 1 }, { id: 2 }]);
```

### Is it possible to extend factory

```ts
// ../src/tests/tutorial-snippets.test.ts#L75-L121

interface BaseTask {
    id: number;
    priority: 'low' | 'middle' | 'high';
}

interface BugTask extends BaseTask {
    type: 'BUG';
    affectedVersion: string;
}

interface EpicTask extends BaseTask {
    type: 'EPIC';
    taskIds: Array<BaseTask['id']>;
}

const baseTaskFactoryBuilder = factoryTBuilder<BaseTask>({
    id: fields.index(),
    priority: 'high',
});

const butTaskFactory = baseTaskFactoryBuilder
    .inheritedBuilder<BugTask>({
        type: 'BUG',
        affectedVersion: '0.0.1',
    })
    .factory();

const epicTaskFactory = baseTaskFactoryBuilder
    .inheritedBuilder<EpicTask>({
        type: 'EPIC',
        taskIds: [100, 500],
    })
    .factory();

expect(butTaskFactory.item()).toStrictEqual({
    id: 1,
    type: 'BUG',
    priority: 'high',
    affectedVersion: '0.0.1',
});

expect(epicTaskFactory.item()).toStrictEqual({
    id: 1,
    type: 'EPIC',
    priority: 'high',
    taskIds: [100, 500],
});
```
