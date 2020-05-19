import { FieldSimpleFactory } from './common';

export const indexField = (): FieldSimpleFactory<number> => (ctx) => ctx.index;

export const nullableField = <T>(initialValue: T | null): T | null => {
    return initialValue;
};

export const optionalField = <T>(initialValue: T | undefined): T | undefined => {
    return initialValue;
};

export const sequenceField = <T>(items: T[]): FieldSimpleFactory<T> => {
    const total = items.length;
    return (ctx) => items[(ctx.index - 1) % total];
};
