import { DataShape } from './common';
import { FactoryT } from './factory';
import { FactoryTBuilder } from './factory-builder';
import { FactoryScope } from './scope';
import { JsonObject } from './type-utils';

export { FactoryT } from './factory';
export { fields } from './fields';
export { FactoryTBuilder };
export { FactoryScope };

/**
 * Creates a scope that groups factories so their item counters can be reset together
 */
export function factoryScope(): FactoryScope {
    return new FactoryScope();
}

export function factoryTBuilder<D extends JsonObject>(
    dataShape: DataShape<D, void>,
): FactoryTBuilder<D>;
export function factoryTBuilder<D extends JsonObject, O>(
    dataShape: DataShape<D, O>,
    defaultOptions: O,
): FactoryTBuilder<D, O>;
export function factoryTBuilder<D extends JsonObject, O = unknown>(
    dataShape: DataShape<D, O>,
    defaultOptions?: O,
): FactoryTBuilder<D, O> {
    return new FactoryTBuilder(dataShape, defaultOptions);
}

export function factoryT<D extends JsonObject>(dataShape: DataShape<D, void>): FactoryT<D>;
export function factoryT<D extends JsonObject, O>(
    dataShape: DataShape<D, O>,
    defaultOptions: O,
): FactoryT<D, O>;
export function factoryT<D extends JsonObject, O>(
    dataShape: DataShape<D, O>,
    defaultOptions?: O,
): FactoryT<D, O> {
    return factoryTBuilder(dataShape, defaultOptions as O).factory();
}
