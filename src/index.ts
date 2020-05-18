import { DataShape } from './common';
import { FactoryTBuilder } from './factory-t-builder';

export { FactoryT } from './factory-t';
export { indexField, nullableField } from './fields';
export { FactoryTBuilder };

export const factoryTBuilder = <D extends object, O = unknown>(dataShape: DataShape<D, O>) => {
    return new FactoryTBuilder(dataShape);
};

export const factoryT = <D extends object, O = unknown>(dataShape: DataShape<D, O>) => {
    return factoryTBuilder(dataShape).factory();
};
