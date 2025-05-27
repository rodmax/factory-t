import { FieldSimpleFactory, FieldFactoryByKey, DataShape, FieldFactory } from './common';
import { FactoryT } from './factory';
import { ExtractDerived, JsonObject } from './type-utils';

export class FactoryTBuilder<D extends JsonObject, O = unknown> {
    private fieldFactoriesMap: FieldFactoryByKey<D, O>;
    private readonly defaultOptions: O | undefined;

    constructor(dataShape: DataShape<D, O>, defaultOptions?: O) {
        this.defaultOptions = defaultOptions;
        this.fieldFactoriesMap = fieldFactoriesMapFromShape(dataShape);
    }

    public setFieldFactory<K extends keyof D>(k: K, fn: FieldFactory<D, K, O>): this {
        this.fieldFactoriesMap[k] = fn;
        return this;
    }

    public inheritedBuilder<ED extends D>(
        dataShape: DataShape<ExtractDerived<ED, D>, O>,
    ): FactoryTBuilder<ED, O> {
        const newBuilder = new FactoryTBuilder({
            ...this.fieldFactoriesMap,
            ...dataShape,
        } as DataShape<ED, O>);
        return newBuilder;
    }

    public factory(): FactoryT<D, O> {
        return new FactoryT(this.fieldFactoriesMap, this.defaultOptions);
    }
}

export function fieldFactoriesMapFromShape<D extends JsonObject, O>(
    dataShape: DataShape<D, O>,
): FieldFactoryByKey<D, O> {
    const config = {} as FieldFactoryByKey<D, O>;
    (Object.keys(dataShape) as unknown as Array<keyof D>).forEach(<K extends keyof D>(key: K) => {
        const valueOrFactory = dataShape[key];
        config[key] = isFactory<D[K], O>(valueOrFactory)
            ? valueOrFactory
            : () => valueOrFactory as D[K];
    });
    return config;
}

function isFactory<T, O = unknown>(fn: unknown): fn is FieldSimpleFactory<T, O> {
    return typeof fn === 'function';
}
