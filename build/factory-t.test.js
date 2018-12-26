"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factory_t_1 = require("./factory-t");
describe(factory_t_1.FactoryT.name, function () {
    describe(factory_t_1.FactoryT.prototype.build.name + '(...)', function () {
        test('makes each new instance with incremented index', function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
                strWithId: function (_a) {
                    var index = _a.index;
                    return "id=" + index;
                },
            });
            expect(factory.build()).toEqual({
                id: 1,
                strWithId: 'id=1',
            });
            expect(factory.build()).toEqual({
                id: 2,
                strWithId: 'id=2',
            });
        });
        test('recognize null as property value', function () {
            var factory = new factory_t_1.FactoryT({
                id: null,
            });
            expect(factory.build()).toEqual({
                id: null,
            });
        });
        test('resolve props dependencies', function () {
            var factory = new factory_t_1.FactoryT({
                C: {
                    deps: ['A', 'B'],
                    make: function (_a) {
                        var partial = _a.partial;
                        return "C(" + partial.A + "," + partial.B + ")";
                    },
                },
                A: 'A',
                B: {
                    deps: ['A'],
                    make: function (_a) {
                        var partial = _a.partial;
                        return "B(" + partial.A + ")";
                    },
                },
            });
            expect(factory.build()).toEqual({
                A: 'A',
                B: 'B(A)',
                C: 'C(A,B(A))',
            });
        });
        test('override prop values from passed object', function () {
            var factory = new factory_t_1.FactoryT({
                a: 'a',
                b: 'b',
            });
            expect(factory.build({ b: 'override b' })).toEqual({
                a: 'a',
                b: 'override b',
            });
        });
        test('works with nested objects using { value: nestedObj } annotation', function () {
            var factory = new factory_t_1.FactoryT({
                nested: {
                    value: { child: 'nested.child' },
                },
            });
            expect(factory.build()).toEqual({
                nested: {
                    child: 'nested.child',
                },
            });
        });
        test('(example) use FactoryT for nested object', function () {
            var nestedFactory = new factory_t_1.FactoryT({
                name: function (_a) {
                    var index = _a.index;
                    return 'nested-' + index;
                },
            });
            var factory = new factory_t_1.FactoryT({
                id: function (_a) {
                    var index = _a.index;
                    return 'parent-' + index;
                },
                nested: {
                    deps: ['id'],
                    make: function (_a) {
                        var partial = _a.partial;
                        return nestedFactory.build({ name: "nested-object-of-" + partial.id });
                    },
                },
            });
            expect(factory.build()).toEqual({
                id: 'parent-1',
                nested: {
                    name: 'nested-object-of-parent-1',
                },
            });
        });
    });
    describe(factory_t_1.FactoryT.prototype.buildList.name + '(...)', function () {
        test('creates array of instances of size provided by "count" input property', function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
            });
            expect(factory.buildList({ count: 3 })).toEqual([
                { id: 1 },
                { id: 2 },
                { id: 3 },
            ]);
        });
        test('creates array of instances using array of "partials"', function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
                name: 'default-name',
            });
            expect(factory.buildList({ partials: [
                    { name: 'first' },
                    {},
                    { name: 'third' },
                ] })).toEqual([
                { id: 1, name: 'first' },
                { id: 2, name: 'default-name' },
                { id: 3, name: 'third' },
            ]);
        });
        test('throw error if "count" < "partials.length"', function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
            });
            expect(function () { return factory.buildList({
                partials: [{ id: 3 }, { id: 2 }, { id: 1 }],
                count: 2,
            }); }).toThrow();
        });
        test('throw error if "partials.length" === 0', function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
            });
            expect(function () { return factory.buildList({
                partials: [],
            }); }).toThrow();
        });
        test('creates array of instances of size "count" using' +
            ' data from "partials" for first "partials.length" items', function () {
            var factory = new factory_t_1.FactoryT({
                id: factory_t_1.INDEX_KEY,
            });
            expect(factory.buildList({
                count: 3,
                partials: [
                    { id: 100 },
                    { id: 200 },
                ],
            })).toEqual([
                { id: 100 },
                { id: 200 },
                { id: 3 },
            ]);
        });
    });
    describe(factory_t_1.FactoryT.prototype.extends.name + '(...)', function () {
        test('creates new factory that extends base factory', function () {
            var baseFactory = new factory_t_1.FactoryT({
                name: 'base-name',
                type: 'BASE',
            });
            var extendedFactory = baseFactory.extends({
                type: 'EXTENDED',
            });
            expect(extendedFactory.build()).toEqual({ name: 'base-name', type: 'EXTENDED' });
            // merge new type to base type
            var extendedFactory2 = baseFactory.extends({
                newKey: 10,
            });
            expect(extendedFactory2.build()).toEqual({ name: 'base-name', type: 'BASE', newKey: 10 });
        });
    });
    describe('function ' + factory_t_1.makeSequense.name + '(...)', function () {
        it('returns "make" function which generates values from passed array', function () {
            var dataFactory = new factory_t_1.FactoryT({
                name: factory_t_1.makeSequense(['one', 'two']),
            });
            expect(dataFactory.buildList({ count: 3 })).toEqual([
                { name: 'one' },
                { name: 'two' },
                { name: 'one' },
            ]);
        });
    });
    describe('function ' + factory_t_1.makeSequenseFromEnum.name + '(...)', function () {
        it('returns "make" function which generates values from passed enum', function () {
            var DataType;
            (function (DataType) {
                DataType["ONE"] = "ONE";
                DataType["TWO"] = "TWO";
            })(DataType || (DataType = {}));
            var dataFactory = new factory_t_1.FactoryT({
                type: factory_t_1.makeSequenseFromEnum(DataType),
            });
            expect(dataFactory.buildList({ count: 3 })).toEqual([
                { type: DataType.ONE },
                { type: DataType.TWO },
                { type: DataType.ONE },
            ]);
        });
    });
});
