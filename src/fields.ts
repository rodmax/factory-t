import { FieldSimpleFactory } from './common';

export const fields = {
    index: (): FieldSimpleFactory<number> => (ctx) => ctx.index,
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
