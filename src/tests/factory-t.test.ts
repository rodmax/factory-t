import { factoryTBuilder, factoryT, nullableField, indexField, FactoryT } from '../index';

describe(`${FactoryT.name}`, () => {
    describe('item()', () => {
        it('makes each new instance with incremented index', () => {
            const factory = factoryT<{ strWithId: string; id: number }>({
                id: indexField(),
                strWithId: ({ index }) => `id=${index}`,
            });

            expect(factory.item()).toStrictEqual({
                id: 1,
                strWithId: 'id=1',
            });
            expect(factory.item()).toStrictEqual({
                id: 2,
                strWithId: 'id=2',
            });
        });

        it('recognize null as property value', () => {
            const factory = factoryT<{ id: number | null }>({
                id: nullableField<number>(null),
            });
            expect(factory.item()).toStrictEqual({
                id: null,
            });
        });

        it('recognize empty array as property value', () => {
            const factory = factoryT<{ ids: number[] }>({
                ids: [],
            });
            expect(factory.item()).toStrictEqual({
                ids: [],
            });
        });

        it('resolve props dependencies', () => {
            const factory = factoryTBuilder<{
                C: string;
                A: string;
                B: string;
            }>({
                C: 'C:will be rewrite)',
                A: 'A',
                B: 'B:will be rewrite)',
            })
                .useFieldFactory('C', (ctx) => `C(${ctx.get('A')},${ctx.get('B')})`)
                .useFieldFactory('B', (ctx) => `B(${ctx.get('A')})`)
                .factory();

            expect(factory.item()).toStrictEqual({
                A: 'A',
                B: 'B(A)',
                C: 'C(A,B(A))',
            });
        });

        it('override prop values from passed object', () => {
            const factory = factoryT<{ a: string; b: string }>({
                a: 'a',
                b: 'b',
            });
            expect(factory.item({ b: 'override b' })).toStrictEqual({
                a: 'a',
                b: 'override b',
            });
        });

        it('works with nested objects/arrays passed directly', () => {
            const factory = factoryT<{
                nestedObj: { child: string };
                nestedArray: number[];
            }>({
                nestedObj: { child: 'nested.child' },
                nestedArray: [1, 2],
            });
            expect(factory.item()).toStrictEqual({
                nestedObj: {
                    child: 'nested.child',
                },
                nestedArray: [1, 2],
            });
        });

        it('works with nested objects using { value: nestedObj } config', () => {
            const factory = factoryT<{ nested: { child: string } }>({
                nested: { child: 'nested.child' },
            });
            expect(factory.item()).toStrictEqual({
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
            const nestedFactory = factoryT<DataWithNestedObj['nested']>({
                name: ({ index }) => 'nested-' + index,
            });

            const factory = factoryTBuilder<DataWithNestedObj>({
                id: ({ index }) => 'parent-' + index,
                nested: nestedFactory.item(),
            })
                .useFieldFactory('nested', (ctx) =>
                    nestedFactory.item({
                        name: `nested-object-of-${ctx.get('id')}`,
                    }),
                )
                .factory();

            expect(factory.item()).toStrictEqual({
                id: 'parent-1',
                nested: {
                    name: 'nested-object-of-parent-1',
                },
            });
        });

        it('throw error with clear message when circular dependency between fields detected', () => {
            const factory = factoryTBuilder({
                a: 'a',
                b: 'b',
            })
                .useFieldFactory('a', (ctx) => ctx.get('b'))
                .useFieldFactory('b', (ctx) => ctx.get('a'))
                .factory();

            expect(() => factory.item()).toThrow('circular');
        });
    });

    describe('list(...)', () => {
        it('creates array of instances of size provided by "count" input property', () => {
            const factory = factoryT<{ id: number }>({
                id: indexField(),
            });
            expect(factory.list({ count: 3 })).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        });

        it('creates array of instances using array of "partials"', () => {
            const factory = factoryT<{ id: number; name: string }>({
                id: indexField(),
                name: 'default-name',
            });
            expect(
                factory.list({ partials: [{ name: 'first' }, {}, { name: 'third' }] }),
            ).toStrictEqual([
                { id: 1, name: 'first' },
                { id: 2, name: 'default-name' },
                { id: 3, name: 'third' },
            ]);
        });

        it('throw error if "count" < "partials.length"', () => {
            const factory = factoryT<{ id: number }>({
                id: indexField(),
            });
            expect(() =>
                factory.list({
                    partials: [{ id: 3 }, { id: 2 }, { id: 1 }],
                    count: 2,
                }),
            ).toThrow('assertion error');
        });

        it('throw error if "partials.length" === 0', () => {
            const factory = factoryT<{ id: number }>({
                id: indexField(),
            });
            expect(() =>
                factory.list({
                    partials: [],
                }),
            ).toThrow('assertion error');
        });

        it(
            'creates array of instances of size "count" using' +
                ' data from "partials" for first "partials.length" items',
            () => {
                const factory = factoryT<{ id: number }>({
                    id: indexField(),
                });

                expect(
                    factory.list({
                        count: 3,
                        partials: [{ id: 100 }, { id: 200 }],
                    }),
                ).toStrictEqual([{ id: 100 }, { id: 200 }, { id: 3 }]);
            },
        );

        it('creates empty array when "count=0"', () => {
            const factory = factoryT<{ id: number }>({
                id: indexField(),
            });
            expect(factory.list({ count: 0 })).toStrictEqual([]);
        });
    });

    describe('factoryBuilder.extends(...)', () => {
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
            const partialFactoryBuilder = factoryTBuilder({
                firstName: (ctx) => `hello-${ctx.index}`,
                enum: DataType.One,
                union: (ctx) => (ctx.index % 2 ? 'one' : 'two'),
            });

            const dataFactory: FactoryT<Data> = partialFactoryBuilder
                .extends({
                    lastName: 'as string',
                    mayBeNull: nullableField(12),
                })
                .factory();
            expect(dataFactory.item({ mayBeNull: null })).toStrictEqual({
                firstName: 'hello-1',
                enum: DataType.One,
                union: 'one',
                lastName: 'as string',
                mayBeNull: null,
            });
        });
    });

    describe('use options to more flexible data generate', () => {
        interface Data {
            email: string;
        }

        interface Options {
            variant: 'google' | 'yahoo';
        }

        function factoryWithOptions(): FactoryT<Data, Options> {
            return factoryT<Data, Options>({
                email: (ctx) => {
                    const mailVendor = ctx.options ? ctx.options.variant : 'unknown';
                    return `e@${mailVendor}`;
                },
            });
        }

        it('item({...}, options) reflected to passed options', () => {
            const dataFactory = factoryWithOptions();
            expect(dataFactory.item({}, { variant: 'google' })).toStrictEqual({
                email: 'e@google',
            });
            expect(dataFactory.item({ email: '123@custom' }, { variant: 'google' })).toStrictEqual({
                email: '123@custom',
            });
        });

        it('list({...}, options) reflected to passed options', () => {
            const dataFactory = factoryWithOptions();
            expect(
                dataFactory.list({ partials: [{ email: 'custom' }, {}] }, { variant: 'google' }),
            ).toStrictEqual([{ email: 'custom' }, { email: 'e@google' }]);
        });
    });
});
