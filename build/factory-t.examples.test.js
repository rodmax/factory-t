"use strict";
// # Examples
// <!-- toc -->
// <!-- tocstop -->
Object.defineProperty(exports, "__esModule", { value: true });
// This file describes some typical cases of usage `factory-t` library
var factory_t_1 = require("./factory-t");
describe('Examples generated from test', function () {
    test('should pass', function () {
        // tslint:disable: no-console // jdi-disable-line
        // tslint:disable: ter-indent // jdi-disable-line
        // ## Getting started
        (function () {
            //  To create `FactoryT<D>` class instance we need to pass
            // - generic type `D` of objects we would to generate
            // - config to specify how to generate each key of object
            var factory = new factory_t_1.FactoryT({
                str: 'value',
                num: function () { return 7788; },
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
        (function () {
            var factory = new factory_t_1.FactoryT({
                id: 7,
            });
            expect(factory.buildList({ count: 2 })).toEqual([{ id: 7 }, { id: 7 }]);
        })(); // jdi-disable-line
        // #### Nested object/array in property
        // To put object in property use `propName: {value: propObjectValue }`
        (function () {
            var factory = new factory_t_1.FactoryT({
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
        })(); // jdi-disable-line
        // ### Built-in factory functions
        // #### `INDEX_KEY`
        (function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
            });
            expect(factory.buildList({ count: 3 })).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        })(); // jdi-disable-line
        // #### `makeSequence(choices)`
        (function () {
            var factory = new factory_t_1.FactoryT({
                role: factory_t_1.makeSequence(['ADMIN', 'OPERATOR']),
            });
            expect(factory.buildList({ count: 3 })).toEqual([
                { role: 'ADMIN' },
                { role: 'OPERATOR' },
                { role: 'ADMIN' },
            ]);
        })(); // jdi-disable-line
        // #### `makeSequenceFromEnum(EnumType)`
        (function () {
            var Role;
            (function (Role) {
                Role["Admin"] = "ADMIN";
                Role["Operator"] = "OPERATOR";
                Role["Watcher"] = "WATCHER";
            })(Role || (Role = {}));
            var factory = new factory_t_1.FactoryT({
                role: factory_t_1.makeSequenceFromEnum(Role),
            });
            expect(factory.buildList({ count: 3 })).toEqual([
                { role: 'ADMIN' },
                { role: 'OPERATOR' },
                { role: 'WATCHER' },
            ]);
        })(); // jdi-disable-line
        // ### Custom factory functions
        // #### Simple factory function
        (function () {
            var count = 10;
            var factory = new factory_t_1.FactoryT({
                key: function () { return "value: " + count++; },
            });
            expect(factory.buildList({ count: 2 })).toEqual([{ key: 'value: 10' }, { key: 'value: 11' }]);
        })(); // jdi-disable-line
        // #### Use `ctx.index` of generating object
        (function () {
            var factory = new factory_t_1.FactoryT({
                index: function (ctx) { return "index: " + ctx.index; },
            });
            expect(factory.buildList({ count: 2 })).toEqual([{ index: 'index: 1' }, { index: 'index: 2' }]);
        })(); // jdi-disable-line
        // #### One key depends from another
        (function () {
            var factory = new factory_t_1.FactoryT({
                one: {
                    deps: ['two'],
                    make: function (ctx) { return "\"two\" prop value is \"" + ctx.partial.two + "\""; },
                },
                two: function (ctx) { return "" + ctx.index; },
            });
            expect(factory.buildList({ count: 2 })).toEqual([
                { two: '1', one: '"two" prop value is "1"' },
                { two: '2', one: '"two" prop value is "2"' },
            ]);
        })(); // jdi-disable-line
        // ## Build data
        // ### factory.build(partial)
        (function () {
            var factory = new factory_t_1.FactoryT({
                name: 'name-from-factory',
            });
            expect(factory.build()).toEqual({ name: 'name-from-factory' });
            // Override factory value by passed
            expect(factory.build({ name: 'override' })).toEqual({ name: 'override' });
        })(); // jdi-disable-line
        // ### factory.buildList(params)
        (function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
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
