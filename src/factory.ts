import { FieldFactoryByKey, FieldFactoryContext } from './common';

export class FactoryT<D extends object, O = unknown> {
    private itemsCount: number = 1;

    constructor(private fieldFactoryByKey: FieldFactoryByKey<D, O>) {}

    public item(partial: Partial<D> = {}, options?: O): D {
        const builtKeys: Array<keyof D> = [];
        const keysStack: Array<keyof D> = [];
        const obj = {} as D;

        const inject = <K extends keyof D>(k: K) => {
            if (!builtKeys.includes(k)) {
                makeField(k);
            }
            return obj[k];
        };
        const ctx: FieldFactoryContext<D, O> = {
            index: this.itemsCount,
            inject,
            options,
        };

        const makeField = <K extends keyof D>(k: K) => {
            if (builtKeys.includes(k)) {
                return;
            }
            if (keysStack.includes(k)) {
                keysStack.push(k);
                throw new Error(
                    `circular dependency cause between fields: ${keysStack.join('->')}`,
                );
            }
            keysStack.push(k);
            obj[k] = (partial as object).hasOwnProperty(k)
                ? (partial[k] as D[K])
                : this.fieldFactoryByKey[k](ctx);
            keysStack.pop();
            builtKeys.push(k);
        };

        for (const k of this.dataKeys()) {
            makeField(k);
        }

        this.itemsCount++;

        return obj;
    }

    public list(
        inParams: (
            | Pick<PossibleListParams<D>, 'count'>
            | Pick<PossibleListParams<D>, 'partials'>
            | Pick<PossibleListParams<D>, 'count' | 'partials'>
        ) &
            Pick<PossibleListParams<D>, 'partial'>,
        options?: O,
    ): D[] {
        const params = inParams as PossibleListParams<D>;

        if (params.partials) {
            if (params.partials.length === 0) {
                throw new Error(
                    `${this.list.name}() assertion error: "partials" array must be not empty`,
                );
            }
            if (params.count && params.count < params.partials.length) {
                throw new Error(
                    `${this.list.name}() assertion error: "count" param should be greater then "partials.length"`,
                );
            }
        }

        const count = isFinite(params.count) ? params.count : params.partials.length;
        const partials = params.partials || [];
        const defaultPartial = params.partial ?? {};

        const items: D[] = [];

        for (let i = 0; i < count; i++) {
            const item = this.item(partials[i] || defaultPartial, options);
            items.push(item);
        }

        return items;
    }

    public resetCount(): void {
        this.itemsCount = 1;
    }

    private dataKeys(): Array<keyof D> {
        return Object.keys(this.fieldFactoryByKey) as Array<keyof D>;
    }
}

interface PossibleListParams<T> {
    count: number;
    partials: Array<Partial<T>>;
    partial?: Partial<T>;
}
