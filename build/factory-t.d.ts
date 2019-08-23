/**
 *  Set of  "MakePropFn" helpers
 */
export declare const INDEX_KEY: (context: {
    index: number;
}) => number;
/**
 * @returns MakePropFn that generates values sequence from arrayOfValues
 * @param arrayOfValues array of values
 */
export declare function makeSequence<T, K extends keyof T, O>(arrayOfValues: ReadonlyArray<T[K]>): MakePropFn<T, K, O>;
/**
 * @returns MakePropFn that generates enum values sequence
 * @param obj enum instance
 */
export declare function makeSequenceFromEnum<T, K extends keyof T, O>(obj: object): MakePropFn<T, K, O>;
/**
 * Class that implements factory function specified by config object
 */
export declare class FactoryT<T extends object, O = unknown> {
    private config;
    private propMakers;
    private itemsCount;
    constructor(config: FactoryTConfig<T, O>);
    build(partial?: Partial<T>, options?: O): T;
    buildList(inParams: (Pick<PossibleBuildListParams<T>, 'count'> | Pick<PossibleBuildListParams<T>, 'partials'> | Pick<PossibleBuildListParams<T>, 'count' | 'partials'>) & Pick<PossibleBuildListParams<T>, 'partial'>, options?: O): T[];
    extends<D>(config: FactoryTConfig<D, O>): FactoryT<T & D, O>;
    resetCount(): void;
}
interface PossibleBuildListParams<T> {
    count: number;
    partials: Array<Partial<T>>;
    partial?: Partial<T>;
}
declare type FactoryTConfig<T, O> = {
    [K in keyof T]: ValueGetterConfig<T, K, O>;
};
declare type ValueGetterConfig<T, K extends keyof T, O> = ValueGetter<T, K, O> | ValueGetterConfigWithValue<T, K> | ValueGetterConfigWithMake<T, K, O>;
interface ValueGetterConfigWithValue<T, K extends keyof T> {
    deps?: Array<keyof T>;
    value: T[K];
}
interface ValueGetterConfigWithMake<T, K extends keyof T, O> {
    deps?: Array<keyof T>;
    make: MakePropFn<T, K, O>;
}
interface MakeFnContext<T, O = unknown> {
    partial: Readonly<Partial<T>>;
    index: number;
    options?: O;
}
declare type MakePropFn<T, K extends keyof T, O> = (context: MakeFnContext<T, O>) => T[K];
declare type ValueGetter<T, K extends keyof T, O> = MakePropFn<T, K, O> | T[K] | null;
export {};
