import { JsonObject } from './type-utils';

export interface FieldFactoryContext<D extends JsonObject, O = unknown>
    extends FieldSimpleFactoryContext<O> {
    inject<K extends keyof D>(k: K): D[K];
}

export type FieldFactory<D extends JsonObject, K extends keyof D, O = unknown> = (
    ctx: FieldFactoryContext<D, O>,
) => D[K];

export type FieldFactoryByKey<D extends JsonObject, O = unknown> = {
    [K in keyof D]: FieldFactory<D, K, O>;
};

interface FieldSimpleFactoryContext<O> {
    index: number;
    options: O;
}

export type FieldSimpleFactory<T, O = unknown> = (ctx: FieldSimpleFactoryContext<O>) => T;

export type DataShape<D, O = unknown> = {
    [K in keyof D]: D[K] | FieldSimpleFactory<D[K], O>;
};
