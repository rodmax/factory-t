// # Examples
// <!-- toc -->
// <!-- tocstop -->

// This file describes some typical cases of usage `factory-t` library
import { FactoryT, INDEX_FIELD_FACTORY } from './factory-t';

describe('Examples generated from test', () => { // jdi-disable-line
    test('should pass', () => { // jdi-disable-line

// tslint:disable: no-console // jdi-disable-line
// tslint:disable: ter-indent // jdi-disable-line


// ## Getting started
(() => { // jdi-disable-line

//  To create `FactoryT<D>` class instance we need to pass
// - generic type `D` of objects we would to generate
// - config to specify how to generate each key of object
const factory = new FactoryT<{ str: string, num: number }>({
    str: 'value',  // just pass any valid value for corresponded property
    num: () => 7788, // factory function
});

// Build single object
expect(factory.build()).toEqual({ str: 'value', num: 7788 });

// Build array of objects
expect(factory.buildList({ count: 2 })).toEqual([
    { str: 'value', num: 7788 },
    { str: 'value', num: 7788 },

]);

})(); // jdi-disable-line


// ## Configuration

// To specify how to generate properties you need to provide
// - constant value of property
// - factory function which will returns property value

// ### Constant value of property

// #### Primitive property type: string, number, boolean, ...
// Just put constant value
(() => { // jdi-disable-line

const factory = new FactoryT<{ id: number }>({
    id: 7,
});
expect(factory.buildList({ count: 2 })).toEqual([{ id: 7 }, { id: 7 }]);

})(); // jdi-disable-line

// #### Nested object/array in property
// To put object in property use `propName: {value: propObjectValue }`
(() => { // jdi-disable-line

interface Data {
    obj: { nested: string };
    array: string[];

}

const factory = new FactoryT<Data>({
    obj: { nested: 'nested-value' },
    array: ['one', 'two'],
});
expect(factory.build()).toEqual({
    obj: { nested: 'nested-value' },
    array: ['one', 'two'],
});

})(); // jdi-disable-line

// ### Built-in factory functions

// #### `INDEX_FIELD_FACTORY`
(() => { // jdi-disable-line

const factory = new FactoryT<{ id: number }>({
    id: INDEX_FIELD_FACTORY,
});
expect(factory.buildList({ count: 3 })).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);

})(); // jdi-disable-line

// #### .useSequence(key, seqArray) method
(() => { // jdi-disable-line

type RoleId = 'ADMIN' | 'OPERATOR' | 'WATCHER';
const factory = new FactoryT<{ role: RoleId}>({
    role: 'ADMIN' as RoleId,
});
factory.useSequence('role', ['ADMIN', 'OPERATOR']);
expect(factory.buildList({ count: 3 })).toEqual([
    { role: 'ADMIN' },
    { role: 'OPERATOR' },
    { role: 'ADMIN' },
]);

})(); // jdi-disable-line

// ### Custom factory functions

// #### Simple factory function
(() => { // jdi-disable-line

let count = 10;

const factory = new FactoryT<{ key: string }>({
    key: () => `value: ${count++}`,
});
expect(factory.buildList({ count: 2 })).toEqual([{ key: 'value: 10' }, { key: 'value: 11' }]);

})(); // jdi-disable-line


// #### Use `ctx.index` of generating object
(() => { // jdi-disable-line

const factory = new FactoryT<{ index: string }>({
    index: ctx => `index: ${ctx.index}`,
});
expect(factory.buildList({ count: 2 })).toEqual([{ index: 'index: 1' }, { index: 'index: 2' }]);

})(); // jdi-disable-line


// #### One key depends from another
(() => { // jdi-disable-line

const factory = new FactoryT<{ one: string, two: string }>({
    one: 'default',
    two: ctx => `${ctx.index}`,
});
factory.useFieldFactory('one', ctx => `"two" prop value is "${ctx.get('two')}"`);
expect(factory.buildList({ count: 2 })).toEqual([
    { two: '1', one: '"two" prop value is "1"' },
    { two: '2', one: '"two" prop value is "2"' },
]);

})(); // jdi-disable-line


// ## Build data

// ### factory.build(partial)
(() => { // jdi-disable-line

const factory = new FactoryT<{ name: string }>({
    name: 'name-from-factory',
});

expect(factory.build()).toEqual({ name: 'name-from-factory' });
// Override factory value by passed
expect(factory.build({ name: 'override' })).toEqual({ name: 'override' });

})(); // jdi-disable-line

// ### factory.buildList(params)

(() => { // jdi-disable-line

const factory = new FactoryT<{ id: number, name: string }>({
    id: INDEX_FIELD_FACTORY,
    name: 'from-factory',
});

// #### `count` objects
expect(factory.buildList({ count: 2 })).toEqual([
    { id: 1, name: 'from-factory' },
    { id: 2, name: 'from-factory' },
]);
factory.resetCount(); // jdi-disable-line

// #### `count` objects based on `partial`
expect(factory.buildList({ count: 2, partial: { name: 'override' } })).toEqual([
    { id: 1, name: 'override' },
    { id: 2, name: 'override' },
]);
factory.resetCount(); // jdi-disable-line

// ####  objects from array of `partials`
expect(factory.buildList({
    partials: [
        { id: 500 },
        { name: 'override' },
    ],
})).toEqual([
    { id: 500, name: 'from-factory' },
    { id: 2, name: 'override' },
]);
factory.resetCount(); // jdi-disable-line

// ####  `count` objects from array of `partials` or `partial`(when `partials` will end)
// You can combine all three params: `count`, `partials` and `partial`
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

})(); // jdi-disable-line

// ------------------------------------ // jdi-disable-line
    }); // jdi-disable-line
}); // jdi-disable-line