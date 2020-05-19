import { DataShape } from './common';
import { FactoryTBuilder } from './factory-builder';

export { FactoryT } from './factory';
export { indexField, nullableField, sequenceField, optionalField } from './fields';
export { FactoryTBuilder };

export const factoryTBuilder = <D extends object, O = unknown>(dataShape: DataShape<D, O>) => {
    return new FactoryTBuilder(dataShape);
};

export const factoryT = <D extends object, O = unknown>(dataShape: DataShape<D, O>) => {
    return factoryTBuilder(dataShape).factory();
};
