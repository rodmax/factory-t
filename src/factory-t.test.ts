// import { FactoryT, INDEX_KEY, makeSequence, makeSequenceFromEnum } from './factory-t-old';
import { FactoryT, nullableField, INDEX_FIELD_FACTORY } from './factory-t';

describe(FactoryT.name, () => {
    describe(FactoryT.prototype.build.name + '(...)', () => {
        test('makes each new instance with incremented index', () => {
            const factory = new FactoryT<{ strWithId: string; id: number }>({
                id: INDEX_FIELD_FACTORY,
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
            const factory = new FactoryT<{ id: number | null }>({
                id: nullableField<number>(null),
            });
            expect(factory.build()).toEqual({
                id: null,
            });
        });

        test('recognize empty array as property value', () => {
            const factory = new FactoryT<{ ids: number[] }>({
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
                C: 'C:will be rewrite)',
                A: 'A',
                B: 'B:will be rewrite)',
            });
            factory.useFieldFactory('C', (ctx) => `C(${ctx.get('A')},${ctx.get('B')})`);
            factory.useFieldFactory('B', (ctx) => `B(${ctx.get('A')})`);

            expect(factory.build()).toEqual({
                A: 'A',
                B: 'B(A)',
                C: 'C(A,B(A))',
            });
        });

        test('override prop values from passed object', () => {
            const factory = new FactoryT<{ a: string; b: string }>({
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
                nestedObj: { child: string };
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
            const factory = new FactoryT<{ nested: { child: string } }>({
                nested: { child: 'nested.child' },
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
                nested: nestedFactory.build(),
            });

            factory.useFieldFactory('nested', (ctx) =>
                nestedFactory.build({
                    name: `nested-object-of-${ctx.get('id')}`,
                }),
            );

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
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(factory.buildList({ count: 3 })).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        });

        test('creates array of instances using array of "partials"', () => {
            const factory = new FactoryT<{ id: number; name: string }>({
                id: INDEX_FIELD_FACTORY,
                name: 'default-name',
            });
            expect(
                factory.buildList({ partials: [{ name: 'first' }, {}, { name: 'third' }] }),
            ).toEqual([
                { id: 1, name: 'first' },
                { id: 2, name: 'default-name' },
                { id: 3, name: 'third' },
            ]);
        });

        test('throw error if "count" < "partials.length"', () => {
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(() =>
                factory.buildList({
                    partials: [{ id: 3 }, { id: 2 }, { id: 1 }],
                    count: 2,
                }),
            ).toThrow();
        });

        test('throw error if "partials.length" === 0', () => {
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(() =>
                factory.buildList({
                    partials: [],
                }),
            ).toThrow();
        });

        test(
            'creates array of instances of size "count" using' +
                ' data from "partials" for first "partials.length" items',
            () => {
                const factory = new FactoryT<{ id: number }>({
                    id: INDEX_FIELD_FACTORY,
                });

                expect(
                    factory.buildList({
                        count: 3,
                        partials: [{ id: 100 }, { id: 200 }],
                    }),
                ).toEqual([{ id: 100 }, { id: 200 }, { id: 3 }]);
            },
        );

        test('creates empty array when "count=0"', () => {
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(factory.buildList({ count: 0 })).toEqual([]);
        });
    });

    describe(FactoryT.prototype.extends.name + '(...)', () => {
        test('creates new factory that extends base factory', () => {
            enum DataType {
                One,
                Two,
            }
            interface Data {
                firstName: string;
                enum: DataType;
                union: 'one' | 'two';
                lastName: string;
                mayBeNull: number | null;
            }
            const partialFactory = new FactoryT({
                firstName: (ctx) => `hello-${ctx.index}`,
                enum: DataType.One,
                union: (ctx) => (ctx.index % 2 ? 'one' : 'two'),
            });

            const dataFactory: FactoryT<Data> = partialFactory.extends({
                lastName: 'as string',
                mayBeNull: nullableField(12),
            });
            expect(dataFactory.build({ mayBeNull: null })).toEqual({
                firstName: 'hello-1',
                enum: DataType.One,
                union: 'one',
                lastName: 'as string',
                mayBeNull: null,
            });
        });
    });

    describe('use options to more flexible generate data', () => {
        interface Data {
            email: string;
        }

        interface Options {
            variant: 'google' | 'yahoo';
        }
        let dataFactory: FactoryT<Data, Options>;

        beforeEach(() => {
            dataFactory = new FactoryT<Data, Options>({
                email: (ctx) => {
                    const mailVendor = ctx.options ? ctx.options.variant : 'unknown';
                    return `e@${mailVendor}`;
                },
            });
        });

        it('build({...}, options) reflected to passed options', () => {
            expect(dataFactory.build({}, { variant: 'google' })).toEqual({ email: 'e@google' });
            expect(dataFactory.build({ email: '123@custom' }, { variant: 'google' })).toEqual({
                email: '123@custom',
            });
        });

        it('buildList({...}, options) reflected to passed options', () => {
            expect(
                dataFactory.buildList(
                    { partials: [{ email: 'custom' }, {}] },
                    { variant: 'google' },
                ),
            ).toEqual([{ email: 'custom' }, { email: 'e@google' }]);
        });
    });
});
