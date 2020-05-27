import { FieldSimpleFactory, FieldFactoryByKey, DataShape, FieldFactory } from './common';
import { FactoryT } from './factory';

export class FactoryTBuilder<D extends object, O = unknown> {
    private fieldFactoryByKey: FieldFactoryByKey<D, O>;

    constructor(dataShape: DataShape<D, O>) {
        this.fieldFactoryByKey = this.fieldFactoryByKeyFor(dataShape);
    }

    public useFieldFactory<K extends keyof D>(k: K, fn: FieldFactory<D, K, O>): this {
        this.fieldFactoryByKey[k] = fn;
        return this;
    }

    public extends<ED extends object>(dataShape: ED): FactoryTBuilder<D & ED, O> {
        const newBuilder = (new FactoryTBuilder(dataShape) as unknown) as FactoryTBuilder<
            D & ED,
            O
        >;
        return newBuilder.useFieldFactoryByKey(
            (this.fieldFactoryByKey as unknown) as Partial<FieldFactoryByKey<D & ED, O>>,
        );
    }

    public factory(): FactoryT<D, O> {
        return new FactoryT(this.fieldFactoryByKey);
    }

    private useFieldFactoryByKey(fieldFactoryByKey: Partial<FieldFactoryByKey<D, O>>): this {
        this.fieldFactoryByKey = {
            ...this.fieldFactoryByKey,
            ...fieldFactoryByKey,
        };
        return this;
    }

    private fieldFactoryByKeyFor(dataShape: DataShape<D, O>): FieldFactoryByKey<D, O> {
        const config = {} as FieldFactoryByKey<D, O>;
        ((Object.keys(dataShape) as unknown) as Array<keyof D>).forEach(
            <K extends keyof D>(key: K) => {
                const valueOrFactory = dataShape[key];
                config[key] = isFactory<D[K], O>(valueOrFactory)
                    ? valueOrFactory
                    : () => valueOrFactory as D[K];
            },
        );
        return config;
    }
}

function isFactory<T, O = unknown>(fn: unknown): fn is FieldSimpleFactory<T, O> {
    return typeof fn === 'function';
}
