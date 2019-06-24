/**
 *  Set of  "MakePropFn" helpers
 */
export const INDEX_KEY = (context: {index: number}) => context.index;

/**
 * @returns MakePropFn that generates values sequence from arrayOfValues
 * @param arrayOfValues array of values
 */
export function makeSequence<T, K extends keyof T>(arrayOfValues: ReadonlyArray<T[K]>): MakePropFn<T, K> {
    const size = arrayOfValues.length;
    // NOTE: we use index - 1 due to factory starts index from 1 but array starts from 0
    return ({ index }) => arrayOfValues[(index - 1) % size];
}

/**
 * @returns MakePropFn that generates enum values sequence
 * @param obj enum instance
 */
export function makeSequenceFromEnum<T, K extends keyof T>(obj: object): MakePropFn<T, K> {
    const o = obj as {[key: string]: T[K]}; // HACK for type casting
    const arr = Object.keys(o).map(k => o[k] as T[K]);
    return makeSequence(arr);

}


/**
 * Class that implements factory function specified by config object
 */
export class FactoryT<T extends object> {

    private propMakers: Array<PropMaker<T, keyof T>>;
    private itemsCount: number = 1;

    constructor(private config: FactoryTConfig<T>) {
        this.propMakers = createPropMakers(config);
    }

    public build(partial: Partial<T> = {}): T {

        const builtObj = this.propMakers.reduce((obj, propMaker) => {
            const key = propMaker.key;

            if (partial.hasOwnProperty(key)) {
                obj[key] = (partial as T)[key];
            } else {
                obj[key] = propMaker.make({ partial: obj, index: this.itemsCount });
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
        ) & Pick<PossibleBuildListParams<T>, 'partial'>
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

        const count = params.count || params.partials.length;
        const partials = params.partials || [];
        const defaultPartial = params.partial || {};

        const items: T[] = [];

        for (let i = 0; i < count; i++) {
            const item = this.build(partials[i] || defaultPartial);
            items.push(item);
        }

        return items;
    }

    public extends<D>(config: FactoryTConfig<D>): FactoryT<T & D> {
        return new FactoryT({
            ...this.config as object,
            ...config as object,
        } as FactoryTConfig<T & D>);
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


function createPropMakers<T>(
    inputConfig: FactoryTConfig<T>
): Array<PropMaker<T, keyof T>> {

    const conf = normalizeConfig(inputConfig);
    const sortedByDeps = getKeysSortedByDeps<T>(conf);


    return sortedByDeps.map(key => {
        return {
            key,
            make: conf[key].make,
        };
    });
}

function normalizeConfig<T, K extends keyof T>(config: FactoryTConfig<T>): FactoryTConfigNormalized<T> {
    const keys = Object.keys(config) as K[];
    return keys.reduce((normalized, key: K) => {

        const configItem = config[key];
        let make: MakePropFn<T, K>;
        let deps: Array<keyof T>;

        if (isItValueGetterConfig<T, K>(configItem)) {
            deps = configItem.deps ? [...configItem.deps] : [];
            make = (configItem as ValueGetterConfigWithMake<T, K>).make ||
                (() => (configItem as ValueGetterConfigWithValue<T, K>).value);
        } else {
            deps = [];
            make = typeof configItem === 'function' ?
                configItem as MakePropFn<T, K> :
                () => configItem as T[K];
        }

        normalized[key] = {
            deps,
            make,
        };
        return normalized;
    }, {} as FactoryTConfigNormalized<T>);
}

function isItValueGetterConfig<T, K extends keyof T>(
    conf: ValueGetterConfig<T, K>
): conf is ValueGetterConfigWithValue<T, K> | ValueGetterConfigWithMake<T, K> {

    if (!isObject(conf)) {
        return false;
    }
    if (typeof (conf as ValueGetterConfigWithMake<T, K>).make === 'function') {
        return true;
    }
    if (conf.hasOwnProperty('value')) {
        return true;
    }
    return false;
}

// NOTE it is weak attempt to detect object dut should work for normal usage of library
function isObject<T>(mayBeObj: null | object | T): mayBeObj is Record<string, unknown> {
    return mayBeObj !== null && (typeof mayBeObj === 'object') && mayBeObj.constructor !== Array;
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

type FactoryTConfig<T> = {
    [K in keyof T]: ValueGetterConfig<T, K>;
};

type ValueGetterConfig<T, K extends keyof T> =
    ValueGetter<T, K> | ValueGetterConfigWithValue<T, K> | ValueGetterConfigWithMake<T, K>;

interface ValueGetterConfigWithValue<T, K extends keyof T> {
    deps?: Array<keyof T>;
    value: T[K];
}

interface ValueGetterConfigWithMake<T, K extends keyof T> {
    deps?: Array<keyof T>;
    make: MakePropFn<T, K>;
}

type FactoryTConfigNormalized<T> = {
    [K in keyof T]: {
        deps: Array<keyof T>;
        make: MakePropFn<T, K>;
    };
};

type MakePropFn<T, K extends keyof T> = (context: {partial: Readonly<Partial<T>>, index: number}) => T[K];

type ValueGetter<T, K extends keyof T> = MakePropFn<T, K> | T[K] | null;

interface PropMaker<T, K extends keyof T> {
    key: K;
    make: MakePropFn<T, K>;
}
