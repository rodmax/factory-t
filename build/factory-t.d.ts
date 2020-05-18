import { FieldFactoryByKey } from './common';
export declare class FactoryT<D extends object, O = unknown> {
    private fieldFactoryByKey;
    private itemsCount;
    constructor(fieldFactoryByKey: FieldFactoryByKey<D, O>);
    item(partial?: Partial<D>, options?: O): D;
    list(inParams: (Pick<PossibleListParams<D>, 'count'> | Pick<PossibleListParams<D>, 'partials'> | Pick<PossibleListParams<D>, 'count' | 'partials'>) & Pick<PossibleListParams<D>, 'partial'>, options?: O): D[];
    resetCount(): void;
    private dataKeys;
}
interface PossibleListParams<T> {
    count: number;
    partials: Array<Partial<T>>;
    partial?: Partial<T>;
}
export {};
