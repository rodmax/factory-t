import { FactoryT, INDEX_KEY, makeSequence, makeSequenceFromEnum } from './factory-t';

describe(FactoryT.name, () => {

    describe(FactoryT.prototype.build.name + '(...)', () => {

        test('makes each new instance with incremented index', () => {
            const factory = new FactoryT<{strWithId: string, id: number}>({
                id: INDEX_KEY,
                strWithId: ({ index }) => `id=${index}`,
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

        test('recognize null as property value', () => {
            const factory = new FactoryT<{id: number}>({
                id: null,
            });
            expect(factory.build()).toEqual({
                id: null,
            });
        });

        test('recognize empty array as property value', () => {
            const factory = new FactoryT<{ids: number[]}>({
                ids: [],
            });
            expect(factory.build()).toEqual({
                ids: [],
            });
        });

        test('resolve props dependencies', () => {
            const factory = new FactoryT<{
                C: string;
                A: string;
                B: string;
            }>({
                C: {
                    deps: ['A', 'B'],
                    make: ({ partial }) => `C(${partial.A},${partial.B})`,
                },
                A: 'A',
                B: {
                    deps: ['A'],
                    make: ({ partial }) => `B(${partial.A})`,
                },
            });

            expect(factory.build()).toEqual({
                A: 'A',
                B: 'B(A)',
                C: 'C(A,B(A))',
            });
        });

        test('override prop values from passed object', () => {
            const factory = new FactoryT<{a: string, b: string}>({
                a: 'a',
                b: 'b',
            });
            expect(factory.build({ b: 'override b' })).toEqual({
                a: 'a',
                b: 'override b',
            });

        });

        test('works with nested objects/arrays passed directly', () => {
            const factory = new FactoryT<{
                nestedObj: {child: string};
                nestedArray: number[];
            }>({
                nestedObj: { child: 'nested.child' },
                nestedArray: [1, 2],
            });
            expect(factory.build()).toEqual({
                nestedObj: {
                    child: 'nested.child',
                },
                nestedArray: [1, 2],

            });
        });

        test('works with nested objects using { value: nestedObj } config', () => {
            const factory = new FactoryT<{nested: {child: string}}>({
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

        test('(example) use another FactoryT for nested object', () => {
            interface DataWithNestedObj {
                id: string;
                nested: {
                    name: string;
                };
            }
            const nestedFactory = new FactoryT<DataWithNestedObj['nested']>({
                name: ({ index }) => 'nested-' + index,
            });

            const factory = new FactoryT<DataWithNestedObj>({
                id: ({ index }) => 'parent-' + index,
                nested: {
                    deps: ['id'],
                    make: ({ partial }) => nestedFactory.build({ name: `nested-object-of-${partial.id}` }),
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

    describe(FactoryT.prototype.buildList.name + '(...)', () => {

        test('creates array of instances of size provided by "count" input property', () => {
            const factory = new FactoryT<{id: number}>({
                id: INDEX_KEY,
            });
            expect(factory.buildList({ count: 3 })).toEqual([
                { id: 1 },
                { id: 2 },
                { id: 3 },
            ]);
        });

        test('creates array of instances using array of "partials"', () => {
            const factory = new FactoryT<{id: number, name: string}>({
                id: INDEX_KEY,
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

        test('throw error if "count" < "partials.length"', () => {
            const factory = new FactoryT<{id: number}>({
                id: INDEX_KEY,
            });
            expect(() => factory.buildList({
                partials: [{ id: 3 }, { id: 2 }, { id: 1 }],
                count: 2,
            })).toThrow();
        });

        test('throw error if "partials.length" === 0', () => {
            const factory = new FactoryT<{id: number}>({
                id: INDEX_KEY,
            });
            expect(() => factory.buildList({
                partials: [],
            })).toThrow();
        });

        test(
            'creates array of instances of size "count" using' +
            ' data from "partials" for first "partials.length" items',
            () => {
                const factory = new FactoryT<{ id: number }>({
                    id: INDEX_KEY,
                });

                expect(factory.buildList({
                    count: 3,
                    partials: [
                        { id: 100 },
                        { id: 200 },
                    ],
                })
                ).toEqual([
                    { id: 100 },
                    { id: 200 },
                    { id: 3 },
                ]);
            }
        );
    });

    describe(FactoryT.prototype.extends.name + '(...)', () => {

        test('creates new factory that extends base factory', () => {
            // extends the same type
            interface Data {
                name: string;
                type: string;
            }

            const baseFactory = new FactoryT<Data>({
                name: 'base-name',
                type: 'BASE',
            });

            const extendedFactory = baseFactory.extends({
                type: 'EXTENDED',
            });

            expect(extendedFactory.build()).toEqual({ name: 'base-name', type: 'EXTENDED' });


            // merge new type to base type
            const extendedFactory2 = baseFactory.extends({
                newKey: 10,
            });
            expect(extendedFactory2.build()).toEqual({ name: 'base-name', type: 'BASE', newKey: 10 });
        });
    });

    describe('function ' + makeSequence.name + '(...)', () => {
        it('returns "make" function which generates values from passed array', () => {
            interface Data {
                name: string;
            }

            const dataFactory = new FactoryT<Data>({
                name: makeSequence(['one', 'two']),
            });
            expect(dataFactory.buildList({ count: 3 })).toEqual([
                { name: 'one' },
                { name: 'two' },
                { name: 'one' },
            ]);
        });
    });

    describe('function ' + makeSequenceFromEnum.name + '(...)', () => {
        it('returns "make" function which generates values from passed enum', () => {
            interface Data {
                type: DataType;
            }
            enum DataType {
                ONE = 'ONE',
                TWO = 'TWO',
            }

            const dataFactory = new FactoryT<Data>({
                type: makeSequenceFromEnum(DataType),
            });
            expect(dataFactory.buildList({ count: 3 })).toEqual([
                { type: DataType.ONE },
                { type: DataType.TWO },
                { type: DataType.ONE },
            ]);
        });
    });

});