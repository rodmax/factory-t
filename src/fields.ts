import { FieldSimpleFactory } from './common';

export const fields = {
    /**
     * @returns auto-incremented number field factory
     *
     * @remarks
     *
     * Generated value started from value 1
     * and can be reset using
     * ```ts
     * factory.resetCount();
     * ```
     */
    index: (): FieldSimpleFactory<number> => (ctx) => ctx.index,
    /**
     * Helper used **to emphasize the field nullable type**.
     * It doesn’t do anything special
     *
     * @param initialValue - if passed specify what value will be assigned to field
     *
     * @returns field factory function which returns null or `initialValue` if passed
     */
    nullable: <T>(initialValue: T | null): T | null => {
        return initialValue;
    },
    optional: <T>(initialValue: T | undefined): T | undefined => {
        return initialValue;
    },
    string: (): FieldSimpleFactory<string> => (ctx) => 'string-field-value-' + ctx.index,
    sequence: <T>(items: T[]): FieldSimpleFactory<T> => {
        const total = items.length;
        return (ctx) => items[(ctx.index - 1) % total];
    },
} as const;
