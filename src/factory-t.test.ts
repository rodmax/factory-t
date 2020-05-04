import { FactoryT, nullableField, INDEX_FIELD_FACTORY } from './factory-t';

describe(`${FactoryT.name}`, () => {
    describe('build(...)', () => {
        it('makes each new instance with incremented index', () => {
            const factory = new FactoryT<{ strWithId: string; id: number }>({
                id: INDEX_FIELD_FACTORY,
                strWithId: ({ index }) => `id=${index}`,
            });
            expect(factory.build()).toStrictEqual({
                id: 1,
                strWithId: 'id=1',
            });
            expect(factory.build()).toStrictEqual({
                id: 2,
                strWithId: 'id=2',
            });
        });

        it('recognize null as property value', () => {
            const factory = new FactoryT<{ id: number | null }>({
                id: nullableField<number>(null),
            });
            expect(factory.build()).toStrictEqual({
                id: null,
            });
        });

        it('recognize empty array as property value', () => {
            const factory = new FactoryT<{ ids: number[] }>({
                ids: [],
            });
            expect(factory.build()).toStrictEqual({
                ids: [],
            });
        });

        it('resolve props dependencies', () => {
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

            expect(factory.build()).toStrictEqual({
                A: 'A',
                B: 'B(A)',
                C: 'C(A,B(A))',
            });
        });

        it('override prop values from passed object', () => {
            const factory = new FactoryT<{ a: string; b: string }>({
                a: 'a',
                b: 'b',
            });
            expect(factory.build({ b: 'override b' })).toStrictEqual({
                a: 'a',
                b: 'override b',
            });
        });

        it('works with nested objects/arrays passed directly', () => {
            const factory = new FactoryT<{
                nestedObj: { child: string };
                nestedArray: number[];
            }>({
                nestedObj: { child: 'nested.child' },
                nestedArray: [1, 2],
            });
            expect(factory.build()).toStrictEqual({
                nestedObj: {
                    child: 'nested.child',
                },
                nestedArray: [1, 2],
            });
        });

        it('works with nested objects using { value: nestedObj } config', () => {
            const factory = new FactoryT<{ nested: { child: string } }>({
                nested: { child: 'nested.child' },
            });
            expect(factory.build()).toStrictEqual({
                nested: {
                    child: 'nested.child',
                },
            });
        });

        it('(example) use another FactoryT for nested object', () => {
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

            expect(factory.build()).toStrictEqual({
                id: 'parent-1',
                nested: {
                    name: 'nested-object-of-parent-1',
                },
            });
        });

        it('throw error with clear message when circular dependency between fields detected', () => {
            const factory = new FactoryT({
                a: 'a',
                b: 'b',
            });
            factory.useFieldFactory('a', (ctx) => ctx.get('b'));
            factory.useFieldFactory('b', (ctx) => ctx.get('a'));

            expect(() => factory.build()).toThrow('circular');
        });
    });

    describe('buildList(...)', () => {
        it('creates array of instances of size provided by "count" input property', () => {
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(factory.buildList({ count: 3 })).toStrictEqual([
                { id: 1 },
                { id: 2 },
                { id: 3 },
            ]);
        });

        it('creates array of instances using array of "partials"', () => {
            const factory = new FactoryT<{ id: number; name: string }>({
                id: INDEX_FIELD_FACTORY,
                name: 'default-name',
            });
            expect(
                factory.buildList({ partials: [{ name: 'first' }, {}, { name: 'third' }] }),
            ).toStrictEqual([
                { id: 1, name: 'first' },
                { id: 2, name: 'default-name' },
                { id: 3, name: 'third' },
            ]);
        });

        it('throw error if "count" < "partials.length"', () => {
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(() =>
                factory.buildList({
                    partials: [{ id: 3 }, { id: 2 }, { id: 1 }],
                    count: 2,
                }),
            ).toThrow('assertion error');
        });

        it('throw error if "partials.length" === 0', () => {
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(() =>
                factory.buildList({
                    partials: [],
                }),
            ).toThrow('assertion error');
        });

        it(
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
                ).toStrictEqual([{ id: 100 }, { id: 200 }, { id: 3 }]);
            },
        );

        it('creates empty array when "count=0"', () => {
            const factory = new FactoryT<{ id: number }>({
                id: INDEX_FIELD_FACTORY,
            });
            expect(factory.buildList({ count: 0 })).toStrictEqual([]);
        });
    });

    describe('extends(...)', () => {
        it('creates new factory that extends base factory', () => {
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
            expect(dataFactory.build({ mayBeNull: null })).toStrictEqual({
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

        function factoryWithOptions(): FactoryT<Data, Options> {
            return new FactoryT<Data, Options>({
                email: (ctx) => {
                    const mailVendor = ctx.options ? ctx.options.variant : 'unknown';
                    return `e@${mailVendor}`;
                },
            });
        }

        it('build({...}, options) reflected to passed options', () => {
            const dataFactory = factoryWithOptions();
            expect(dataFactory.build({}, { variant: 'google' })).toStrictEqual({
                email: 'e@google',
            });
            expect(dataFactory.build({ email: '123@custom' }, { variant: 'google' })).toStrictEqual(
                {
                    email: '123@custom',
                },
            );
        });

        it('buildList({...}, options) reflected to passed options', () => {
            const dataFactory = factoryWithOptions();
            expect(
                dataFactory.buildList(
                    { partials: [{ email: 'custom' }, {}] },
                    { variant: 'google' },
                ),
            ).toStrictEqual([{ email: 'custom' }, { email: 'e@google' }]);
        });
    });
});
