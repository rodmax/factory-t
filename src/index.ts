import { DataShape } from './common';
import { FactoryTBuilder } from './factory-builder';
import { JsonObject } from './type-utils';

export { FactoryT } from './factory';
export { fields } from './fields';
export { FactoryTBuilder };

export const factoryTBuilder = <D extends JsonObject, O = unknown>(dataShape: DataShape<D, O>) => {
    return new FactoryTBuilder(dataShape);
};

export const factoryT = <D extends JsonObject, O = unknown>(dataShape: DataShape<D, O>) => {
    return factoryTBuilder(dataShape).factory();
};
