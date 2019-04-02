# Examples

<!-- toc -->

- [Getting started](#getting-started)
- [Configuration](#configuration)
  * [Constant value of property](#constant-value-of-property)
    + [Primitive property type: string, number, boolean, ...](#primitive-property-type-string-number-boolean-)
    + [Nested object/array in property](#nested-objectarray-in-property)
  * [Built-in factory functions](#built-in-factory-functions)
    + [`INDEX_KEY`](#index_key)
    + [`makeSequence(choices)`](#makesequencechoices)
    + [`makeSequenceFromEnum(EnumType)`](#makesequencefromenumenumtype)
  * [Custom factory functions](#custom-factory-functions)
    + [Simple factory function](#simple-factory-function)
    + [Use `ctx.index` of generating object](#use-ctxindex-of-generating-object)
    + [One key depends from another](#one-key-depends-from-another)
- [Build data](#build-data)
  * [factory.build(partial)](#factorybuildpartial)
  * [factory.buildList(params)](#factorybuildlistparams)
    + [`count` objects](#count-objects)
    + [`count` objects based on `partial`](#count-objects-based-on-partial)
    + [objects from array of `partials`](#objects-from-array-of-partials)
    + [`count` objects from array of `partials` or `partial`(when `partials` will end)](#count-objects-from-array-of-partials-or-partialwhen-partials-will-end)

<!-- tocstop -->

This file describes some typical cases of usage `factory-t` library
```ts
import { FactoryT, INDEX_KEY, makeSequence, makeSequenceFromEnum } from './factory-t';




```
## Getting started

To create `FactoryT<D>` class instance we need to pass
- generic type `D` of objects we would to generate
- config to specify how to generate each key of object
```ts
const factory = new FactoryT<{ str: string, num: number }>({
    str: 'value',  // just pass any valid value for corresponded property
    num: () => 7788, // factory function
});

```
Build single object
```ts
expect(factory.build()).toEqual({ str: 'value', num: 7788 });

```
Build array of objects
```ts
expect(factory.buildList({ count: 2 })).toEqual([
    { str: 'value', num: 7788 },
    { str: 'value', num: 7788 },

]);



```
## Configuration

To specify how to generate properties you need to provide
- constant value of property
- factory function which will returns property value

### Constant value of property

#### Primitive property type: string, number, boolean, ...
Just put constant value

```ts
const factory = new FactoryT<{ id: number }>({
    id: 7,
});
expect(factory.buildList({ count: 2 })).toEqual([{ id: 7 }, { id: 7 }]);


```
#### Nested object/array in property
To put object in property use `propName: {value: propObjectValue }`

```ts
interface Data {
    obj: { nested: string };
    array: string[];

}

const factory = new FactoryT<Data>({
    obj: {
        value: { nested: 'nested-value' },
    },
    array: {
        value: ['one', 'two'],
    },
});
expect(factory.build()).toEqual({
    obj: { nested: 'nested-value' },
    array: ['one', 'two'],
});


```
### Built-in factory functions


#### `INDEX_KEY`

```ts
const factory = new FactoryT<{ id: number }>({
    id: INDEX_KEY,
});
expect(factory.buildList({ count: 3 })).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);


```
#### `makeSequence(choices)`

```ts
const factory = new FactoryT<{ role: 'ADMIN' | 'OPERATOR' | 'WATCHER'}>({
    role: makeSequence(['ADMIN', 'OPERATOR']),
});
expect(factory.buildList({ count: 3 })).toEqual([
    { role: 'ADMIN' },
    { role: 'OPERATOR' },
    { role: 'ADMIN' },
]);


```
#### `makeSequenceFromEnum(EnumType)`
```ts
enum Role {
    Admin = 'ADMIN',
    Operator = 'OPERATOR',
    Watcher = 'WATCHER',
}

const factory = new FactoryT<{ role: Role}>({
    role: makeSequenceFromEnum(Role),
});

expect(factory.buildList({ count: 3 })).toEqual([
    { role: 'ADMIN' },
    { role: 'OPERATOR' },
    { role: 'WATCHER' },
]);



```
### Custom factory functions

#### Simple factory function

```ts
let count = 10;

const factory = new FactoryT<{ key: string }>({
    key: () => `value: ${count++}`,
});
expect(factory.buildList({ count: 2 })).toEqual([{ key: 'value: 10' }, { key: 'value: 11' }]);



```
#### Use `ctx.index` of generating object

```ts
const factory = new FactoryT<{ index: string }>({
    index: ctx => `index: ${ctx.index}`,
});
expect(factory.buildList({ count: 2 })).toEqual([{ index: 'index: 1' }, { index: 'index: 2' }]);



```
#### One key depends from another

```ts
const factory = new FactoryT<{ one: string, two: string }>({
    one: {
        deps: ['two'],
        make: ctx => `"two" prop value is "${ctx.partial.two}"`,
    },
    two: ctx => `${ctx.index}`,
});
expect(factory.buildList({ count: 2 })).toEqual([
    { two: '1', one: '"two" prop value is "1"' },
    { two: '2', one: '"two" prop value is "2"' },
]);



```
## Build data

### factory.build(partial)

```ts
const factory = new FactoryT<{ name: string }>({
    name: 'name-from-factory',
});

expect(factory.build()).toEqual({ name: 'name-from-factory' });
```
Override factory value by passed
```ts
expect(factory.build({ name: 'override' })).toEqual({ name: 'override' });


```
### factory.buildList(params)


```ts
const factory = new FactoryT<{ id: number, name: string }>({
    id: INDEX_KEY,
    name: 'from-factory',
});

```
#### `count` objects
```ts
expect(factory.buildList({ count: 2 })).toEqual([
    { id: 1, name: 'from-factory' },
    { id: 2, name: 'from-factory' },
]);

```
#### `count` objects based on `partial`
```ts
expect(factory.buildList({ count: 2, partial: { name: 'override' } })).toEqual([
    { id: 1, name: 'override' },
    { id: 2, name: 'override' },
]);

```
####  objects from array of `partials`
```ts
expect(factory.buildList({
    partials: [
        { id: 500 },
        { name: 'override' },
    ],
})).toEqual([
    { id: 500, name: 'from-factory' },
    { id: 2, name: 'override' },
]);

```
####  `count` objects from array of `partials` or `partial`(when `partials` will end)
You can combine all three params: `count`, `partials` and `partial`
```ts
expect(factory.buildList({
    partials: [
        { id: 500 },
        { name: 'from-partials' },
    ],
    partial: { name: 'from-partial' },
    count: 3,
})).toEqual([
    { id: 500, name: 'from-factory' },
    { id: 2, name: 'from-partials' },
    { id: 3, name: 'from-partial' },
]);


```
------------------------
Generated _Tue Apr 02 2019 10:10:40 GMT+0300 (Moscow Standard Time)_ from [&#x24C8; factory-t.examples.test.ts](factory-t.examples.test.ts "View in source")

