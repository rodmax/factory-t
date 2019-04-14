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
export declare function makeSequence<T, K extends keyof T>(arrayOfValues: Array<T[K]>): MakePropFn<T, K>;
/**
 * @returns MakePropFn that generates enum values sequence
 * @param obj enum instance
 */
export declare function makeSequenceFromEnum<T, K extends keyof T>(obj: object): MakePropFn<T, K>;
/**
 * Class that implements factory function specified by config object
 */
export declare class FactoryT<T extends object> {
    private config;
    private propMakers;
    private itemsCount;
    constructor(config: FactoryTConfig<T>);
    build(partial?: Partial<T>): T;
    buildList(inParams: (Pick<PossibleBuildListParams<T>, 'count'> | Pick<PossibleBuildListParams<T>, 'partials'> | Pick<PossibleBuildListParams<T>, 'count' | 'partials'>) & Pick<PossibleBuildListParams<T>, 'partial'>): T[];
    extends<D>(config: FactoryTConfig<D>): FactoryT<T & D>;
    resetCount(): void;
}
interface PossibleBuildListParams<T> {
    count: number;
    partials: Array<Partial<T>>;
    partial?: Partial<T>;
}
declare type FactoryTConfig<T> = {
    [K in keyof T]: ValueGetter<T, K> | {
        deps?: Array<keyof T>;
        value: T[K];
    } | {
        deps?: Array<keyof T>;
        make?: MakePropFn<T, K>;
    };
};
declare type MakePropFn<T, K extends keyof T> = (context: {
    partial: Readonly<Partial<T>>;
    index: number;
}) => T[K];
declare type ValueGetter<T, K extends keyof T> = MakePropFn<T, K> | T[K] | null;
export {};
