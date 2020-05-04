export class FactoryT<D extends object, O = unknown> {
    private builder: DtoBuilder<D, O>;
    private itemsCount: number = 1;

    constructor(dataShape: DataShape<D, O>) {
        this.builder = this.initialBuilder(dataShape);
    }

    public useFieldFactory<K extends keyof D>(k: K, fn: FieldFactory<D, K, O>): this {
        this.builder[k] = fn;
        return this;
    }

    public useSequence<K extends keyof D>(k: K, values: ReadonlyArray<D[K]>): this {
        const size = values.length;
        // NOTE: we use index - 1 due to factory starts index from 1
        this.builder[k] = ({ index }) => values[(index - 1) % size];
        return this;
    }

    public extends<ED extends object>(dataShape: ED): FactoryT<D & ED, O> {
        const newFactory = (new FactoryT(dataShape) as unknown) as FactoryT<D & ED, O>;
        return newFactory.useBuilder((this.builder as unknown) as Partial<DtoBuilder<D & ED, O>>);
    }

    public build(partial: Partial<D> = {}, options?: O): D {
        const builtKeys: Array<keyof D> = [];
        const keysStack: Array<keyof D> = [];
        const obj = {} as D;

        const getField = <K extends keyof D>(k: K) => {
            if (!builtKeys.includes(k)) {
                makeField(k);
            }
            return obj[k];
        };

        const makeField = <K extends keyof D>(k: K) => {
            const ctx: FieldFactoryContext<D, O> = {
                index: this.itemsCount,
                get: getField,
                options,
            };
            if (keysStack.includes(k)) {
                keysStack.push(k);
                throw new Error(
                    `circular dependency cause between fields: ${keysStack.join('->')}`,
                );
            }
            keysStack.push(k);
            obj[k] = this.builder[k](ctx);
            keysStack.pop();
        };

        for (const k of this.dataKeys()) {
            if (builtKeys.includes(k)) {
                continue;
            }
            makeField(k);
        }

        this.itemsCount++;

        return {
            ...obj,
            ...partial,
        };
    }

    public buildList(
        inParams: (
            | Pick<PossibleBuildListParams<D>, 'count'>
            | Pick<PossibleBuildListParams<D>, 'partials'>
            | Pick<PossibleBuildListParams<D>, 'count' | 'partials'>
        ) &
            Pick<PossibleBuildListParams<D>, 'partial'>,
        options?: O,
    ): D[] {
        const params = inParams as PossibleBuildListParams<D>;

        if (params.partials) {
            if (params.partials.length === 0) {
                throw new Error(`buildList() assertion error: "partials" array must be not empty`);
            }
            if (params.count && params.count < params.partials.length) {
                throw new Error(
                    `buildList() assertion error: "count" param should be greater then "partials.length"`,
                );
            }
        }

        const count = isFinite(params.count) ? params.count : params.partials.length;
        const partials = params.partials || [];
        const defaultPartial = params.partial || {};

        const items: D[] = [];

        for (let i = 0; i < count; i++) {
            const item = this.build(partials[i] || defaultPartial, options);
            items.push(item);
        }

        return items;
    }

    public resetCount(): void {
        this.itemsCount = 1;
    }

    private useBuilder(builder: Partial<DtoBuilder<D, O>>): this {
        this.builder = {
            ...this.builder,
            ...builder,
        };
        return this;
    }

    private initialBuilder(dataShape: DataShape<D, O>): DtoBuilder<D, O> {
        const config = {} as DtoBuilder<D, O>;
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

    private dataKeys(): Array<keyof D> {
        return Object.keys(this.builder) as Array<keyof D>;
    }
}

export const INDEX_FIELD_FACTORY: FieldSimpleFactory<number> = (ctx) => ctx.index;

export function nullableField<T>(initialValue: T | null): T | null {
    return initialValue;
}

function isFactory<T, O = unknown>(fn: unknown): fn is FieldSimpleFactory<T, O> {
    return typeof fn === 'function';
}

type DataShape<D, O = unknown> = {
    [K in keyof D]: D[K] | FieldSimpleFactory<D[K], O>;
};

interface FiledSimpleFactoryContext<O> {
    index: number;
    options?: O;
}

type FieldSimpleFactory<T, O = unknown> = (ctx: FiledSimpleFactoryContext<O>) => T;

interface FieldFactoryContext<D extends object, O = unknown> extends FiledSimpleFactoryContext<O> {
    get<K extends keyof D>(k: K): D[K];
}

type FieldFactory<D extends object, K extends keyof D, O = unknown> = (
    ctx: FieldFactoryContext<D, O>,
) => D[K];

type DtoBuilder<D extends object, O = unknown> = {
    [K in keyof D]: FieldFactory<D, K, O>;
};

interface PossibleBuildListParams<T> {
    count: number;
    partials: Array<Partial<T>>;
    partial?: Partial<T>;
}
