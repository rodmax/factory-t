/**
 *  Set of  "MakePropFn" helpers
 */
export const INDEX_KEY = (context: {index: number}) => context.index;

/**
 * @returns MakePropFn that generates values sequence from arrayOfValues
 * @param arrayOfValues array of values
 */
export function makeSequence<T, K extends keyof T, O>(arrayOfValues: ReadonlyArray<T[K]>): MakePropFn<T, K, O> {
    const size = arrayOfValues.length;
    // NOTE: we use index - 1 due to factory starts index from 1 but array starts from 0
    return ({ index }) => arrayOfValues[(index - 1) % size];
}

/**
 * @returns MakePropFn that generates enum values sequence
 * @param obj enum instance
 */
export function makeSequenceFromEnum<T, K extends keyof T, O>(obj: object): MakePropFn<T, K, O> {
    const o = obj as {[key: string]: T[K]}; // HACK for type casting
    const arr = Object.keys(o).map(k => o[k] as T[K]);
    return makeSequence(arr);

}


/**
 * Class that implements factory function specified by config object
 */
export class FactoryT<T extends object, O = unknown> {

    private propMakers: Array<PropMaker<T, keyof T, O>>;
    private itemsCount: number = 1;

    constructor(private config: FactoryTConfig<T, O>) {
        this.propMakers = createPropMakers(config);
    }

    public build(partial: Partial<T> = {}, options?: O): T {

        const builtObj = this.propMakers.reduce((obj, propMaker) => {
            const key = propMaker.key;

            if (partial.hasOwnProperty(key)) {
                obj[key] = (partial as T)[key];
            } else {
                obj[key] = propMaker.make({ partial: obj, index: this.itemsCount, options });
            }
            return obj;
        }, {} as T);

        this.itemsCount++;

        return builtObj;
    }

    public buildList(
        inParams: (
            Pick<PossibleBuildListParams<T>, 'count'> |
            Pick<PossibleBuildListParams<T>, 'partials'> |
            Pick<PossibleBuildListParams<T>, 'count' | 'partials'>
        ) & Pick<PossibleBuildListParams<T>, 'partial'>,
        options?: O,
    ): T[] {
        const params = inParams as PossibleBuildListParams<T>;

        if (params.partials) {
            if (params.partials.length === 0) {
                throw new Error(
                    `buildList() assertion error: "partials" array must be not empty`
                );
            }
            if (params.count && params.count < params.partials.length) {
                throw new Error(
                    `buildList() assertion error: "count" param should be greater then "partials.length"`
                );
            }
        }

        const count = isFinite(params.count) ? params.count : params.partials.length;
        const partials = params.partials || [];
        const defaultPartial = params.partial || {};

        const items: T[] = [];

        for (let i = 0; i < count; i++) {
            const item = this.build(partials[i] || defaultPartial, options);
            items.push(item);
        }

        return items;
    }

    public extends<D>(config: FactoryTConfig<D, O>): FactoryT<T & D, O> {
        return new FactoryT({
            ...this.config as object,
            ...config as object,
        } as FactoryTConfig<T & D, O>);
    }

    public resetCount(): void {
        this.itemsCount = 1;
    }
}

interface PossibleBuildListParams<T> {
    count: number;
    partials: Array<Partial<T>>;
    partial?: Partial<T>;
}


function createPropMakers<T, O>(
    inputConfig: FactoryTConfig<T, O>
): Array<PropMaker<T, keyof T, O>> {

    const conf = normalizeConfig(inputConfig);
    const sortedByDeps = getKeysSortedByDeps<T>(conf);


    return sortedByDeps.map(key => {
        return {
            key,
            make: conf[key].make,
        };
    });
}

function normalizeConfig<T, K extends keyof T, O>(config: FactoryTConfig<T, O>): FactoryTConfigNormalized<T, O> {
    const keys = Object.keys(config) as K[];
    return keys.reduce((normalized, key: K) => {

        const configItem = config[key];
        let make: MakePropFn<T, K, O>;
        let deps: Array<keyof T>;

        if (isItValueGetterConfig<T, K, O>(configItem)) {
            deps = configItem.deps ? [...configItem.deps] : [];
            make = (configItem as ValueGetterConfigWithMake<T, K, O>).make ||
                (() => (configItem as ValueGetterConfigWithValue<T, K>).value);
        } else {
            deps = [];
            make = typeof configItem === 'function' ?
                configItem as MakePropFn<T, K, O> :
                () => configItem as T[K];
        }

        normalized[key] = {
            deps,
            make,
        };
        return normalized;
    }, {} as FactoryTConfigNormalized<T, O>);
}

function isItValueGetterConfig<T, K extends keyof T, O>(
    conf: ValueGetterConfig<T, K, O>
): conf is ValueGetterConfigWithValue<T, K> | ValueGetterConfigWithMake<T, K, O> {

    if (!isObject(conf)) {
        return false;
    }
    if (typeof (conf as ValueGetterConfigWithMake<T, K, O>).make === 'function') {
        return true;
    }
    if (conf.hasOwnProperty('value')) {
        return true;
    }
    return false;
}

// NOTE it is weak attempt to detect object but should work for normal usage of library
function isObject<T>(mayBeObj: null | object | T): mayBeObj is Record<string, unknown> {
    if (typeof mayBeObj !== 'object') {
        return false;
    }

    if (mayBeObj === null) {
        return false;
    }

    if (mayBeObj instanceof Array) {
        return false;
    }

    return true;
}


// Kahn's algorithm (1962) https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm
// used for topological sorting or "Dependency resolution"
// function returns array of keys each of them independent from next elements
// example:
// getKeysSortedByDeps({a: deps: ['c'], b: deps: ['a'], c: deps: []}) -> ['c', 'a', 'b']
function getKeysSortedByDeps<T>(conf: {[key in keyof T]: {deps: Array<keyof T>}}): Array<keyof T> {
    type K = keyof T;
    const keys = Object.keys(conf) as K[];
    const sorted: K[] = [];

    const keysWithNoDeps = keys.filter(key => {
        return conf[key].deps.length === 0;
    });

    while (keysWithNoDeps.length) {
        const keyWithNoDeps = keysWithNoDeps.pop() as keyof T;
        sorted.push(keyWithNoDeps);
        keys.forEach(key => {
            const deps = conf[key].deps;
            if (deps.length === 0) {
                return;
            }
            const index = deps.indexOf(keyWithNoDeps);
            if (index === -1) {
                return;
            }
            deps.splice(index, 1);
            if (deps.length === 0) {
                keysWithNoDeps.push(key);
            }
        });
    }
    return sorted;
}

type FactoryTConfig<T, O> = {
    [K in keyof T]: ValueGetterConfig<T, K, O>;
};

type ValueGetterConfig<T, K extends keyof T, O> =
    ValueGetter<T, K, O> | ValueGetterConfigWithValue<T, K> | ValueGetterConfigWithMake<T, K, O>;

interface ValueGetterConfigWithValue<T, K extends keyof T> {
    deps?: Array<keyof T>;
    value: T[K];
}

interface ValueGetterConfigWithMake<T, K extends keyof T, O> {
    deps?: Array<keyof T>;
    make: MakePropFn<T, K, O>;
}

type FactoryTConfigNormalized<T, O> = {
    [K in keyof T]: {
        deps: Array<keyof T>;
        make: MakePropFn<T, K, O>;
    };
};

interface MakeFnContext<T, O = unknown> {
    partial: Readonly<Partial<T>>;
    index: number;
    options?: O;
}

type MakePropFn<T, K extends keyof T, O> = (context: MakeFnContext<T, O>) => T[K];

type ValueGetter<T, K extends keyof T, O> = MakePropFn<T, K, O> | T[K] | null;

interface PropMaker<T, K extends keyof T, O> {
    key: K;
    make: MakePropFn<T, K, O>;
}
