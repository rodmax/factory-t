export interface FieldFactoryContext<D extends object, O = unknown>
    extends FiledSimpleFactoryContext<O> {
    get<K extends keyof D>(k: K): D[K];
}

export type FieldFactory<D extends object, K extends keyof D, O = unknown> = (
    ctx: FieldFactoryContext<D, O>,
) => D[K];

export type FieldFactoryByKey<D extends object, O = unknown> = {
    [K in keyof D]: FieldFactory<D, K, O>;
};

interface FiledSimpleFactoryContext<O> {
    index: number;
    options?: O;
}

export type DataShape<D, O = unknown> = {
    [K in keyof D]: D[K] | FieldSimpleFactory<D[K], O>;
};

export type FieldSimpleFactory<T, O = unknown> = (ctx: FiledSimpleFactoryContext<O>) => T;
