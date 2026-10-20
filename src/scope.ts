import { DataShape } from './common';
import { FactoryT } from './factory';
import { FactoryTBuilder } from './factory-builder';
import { JsonObject } from './type-utils';

export class FactoryScope {
    private readonly factories = new Set<Pick<FactoryT<object>, 'resetCount'>>();

    public factoryTBuilder<D extends JsonObject>(dataShape: DataShape<D, void>): FactoryTBuilder<D>;
    public factoryTBuilder<D extends JsonObject, O>(
        dataShape: DataShape<D, O>,
        defaultOptions: O,
    ): FactoryTBuilder<D, O>;
    public factoryTBuilder<D extends JsonObject, O = unknown>(
        dataShape: DataShape<D, O>,
        defaultOptions?: O,
    ): FactoryTBuilder<D, O> {
        return new FactoryTBuilder(dataShape, defaultOptions, this);
    }

    public factoryT<D extends JsonObject>(dataShape: DataShape<D, void>): FactoryT<D>;
    public factoryT<D extends JsonObject, O>(
        dataShape: DataShape<D, O>,
        defaultOptions: O,
    ): FactoryT<D, O>;
    public factoryT<D extends JsonObject, O>(
        dataShape: DataShape<D, O>,
        defaultOptions?: O,
    ): FactoryT<D, O> {
        return this.factoryTBuilder(dataShape, defaultOptions as O).factory();
    }

    /**
     * Resets item counters of all factories created in this scope
     */
    public resetCounts(): void {
        this.factories.forEach((factory) => factory.resetCount());
    }

    /**
     * @internal called by builders created in this scope
     */
    public register(factory: Pick<FactoryT<object>, 'resetCount'>): void {
        this.factories.add(factory);
    }
}
