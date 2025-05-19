import { factoryTBuilder, factoryT, FactoryT, fields, FactoryTBuilder } from 'factory-t';
import { describe, it, expect } from '@jest/globals';

describe(`${FactoryT.name}`, () => {
    describe('item()', () => {
        it('makes each new instance with incremented index', () => {
            const factory = factoryT<{ strWithId: string; id: number }>({
                id: fields.index(),
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
                id: fields.nullable<number>(null),
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

        it('handle optional property value when field factory not provided', () => {
            interface WithOptional {
                name: string;
                optional?: string;
            }
            const factory = factoryT<WithOptional>({
                name: 'hello',
            });

            expect(factory.item()).toStrictEqual({
                name: 'hello',
            });
            expect(factory.item({ optional: 'optional-value' })).toStrictEqual({
                name: 'hello',
                optional: 'optional-value',
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
                .setFieldFactory('C', (ctx) => `C(${ctx.inject('A')},${ctx.inject('B')})`)
                .setFieldFactory('B', (ctx) => `B(${ctx.inject('A')})`)
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
                .setFieldFactory('nested', (ctx) =>
                    nestedFactory.item({
                        name: `nested-object-of-${ctx.inject('id')}`,
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
                .setFieldFactory('a', (ctx) => ctx.inject('b'))
                .setFieldFactory('b', (ctx) => ctx.inject('a'))
                .factory();

            expect(() => factory.item()).toThrow('circular');
        });
    });

    describe('list(...)', () => {
        it('creates array of instances of size provided by "count" input property', () => {
            const factory = factoryT<{ id: number }>({
                id: fields.index(),
            });
            expect(factory.list({ count: 3 })).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        });

        it('creates array of instances using array of "partials"', () => {
            const factory = factoryT<{ id: number; name: string }>({
                id: fields.index(),
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
                id: fields.index(),
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
                id: fields.index(),
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
                    id: fields.index(),
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
                id: fields.index(),
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
                // eslint-disable-next-line jest/no-conditional-in-test
                union: (ctx) => (ctx.index % 2 ? 'one' : 'two'),
            });

            const dataFactory = partialFactoryBuilder
                .inheritedBuilder<Data>({
                    lastName: 'as string',
                    mayBeNull: fields.nullable(12),
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
            variant: 'google' | 'yahoo' | 'default';
        }

        function factoryWithOptions(): FactoryT<Data, Options> {
            return factoryT<Data, Options>(
                {
                    email: (ctx) => `e@${ctx.options.variant}.com`,
                },
                { variant: 'default' },
            );
        }

        it('item({...}, options) reflected to passed options', () => {
            const dataFactory = factoryWithOptions();
            expect(dataFactory.item({}, { variant: 'google' })).toStrictEqual({
                email: 'e@google.com',
            });
            expect(
                dataFactory.item({ email: '123@custom.com' }, { variant: 'google' }),
            ).toStrictEqual({
                email: '123@custom.com',
            });
        });

        it('list({...}, options) reflected to passed options', () => {
            const dataFactory = factoryWithOptions();
            expect(
                dataFactory.list({ partials: [{ email: 'custom' }, {}] }, { variant: 'google' }),
            ).toStrictEqual([{ email: 'custom' }, { email: 'e@google.com' }]);
        });

        it('item() and list() should use default options', () => {
            const dataFactory = factoryWithOptions();
            expect(dataFactory.item()).toStrictEqual({
                email: 'e@default.com',
            });
            expect(dataFactory.list({ count: 2 })).toStrictEqual([
                { email: 'e@default.com' },
                { email: 'e@default.com' },
            ]);
        });
    });
});

describe(`${FactoryTBuilder.name}`, () => {
    it('instantiate FactoryTBuilder directly', () => {
        const builder = new FactoryTBuilder<{ foo: string }>({ foo: 'bar' });
        expect(builder.factory().item()).toStrictEqual({ foo: 'bar' });
    });
    it('instantiate FactoryTBuilder directly with defaultOptions', () => {
        const builder = new FactoryTBuilder<{ foo: string }, { opt: number }>(
            { foo: 'bar' },
            { opt: 42 },
        );
        expect(builder.factory().item()).toStrictEqual({ foo: 'bar' });
    });
});
