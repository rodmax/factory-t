import { describe, expect, it } from '@jest/globals';
import { fields } from '../fields';

describe('fields', () => {
    describe('index', () => {
        it('returns incremented index value', () => {
            const factory = fields.index();
            expect(factory({ index: 1, options: undefined })).toBe(1);
            expect(factory({ index: 2, options: undefined })).toBe(2);
        });
    });

    describe('nullable', () => {
        it('returns null if initialValue is null', () => {
            expect(fields.nullable<string>(null)).toBeNull();
        });
        it('returns initialValue if not null', () => {
            expect(fields.nullable('abc')).toBe('abc');
            expect(fields.nullable(123)).toBe(123);
        });
    });

    describe('optional', () => {
        it('returns undefined if initialValue is undefined', () => {
            expect(fields.optional<string>(undefined)).toBeUndefined();
        });
        it('returns initialValue if not undefined', () => {
            expect(fields.optional('abc')).toBe('abc');
            expect(fields.optional(123)).toBe(123);
        });
    });

    describe('string', () => {
        it('returns string with index', () => {
            const factory = fields.string();
            expect(factory({ index: 1, options: undefined })).toBe('string-field-value-1');
            expect(factory({ index: 42, options: undefined })).toBe('string-field-value-42');
        });
    });

    describe('sequence', () => {
        it('returns items in sequence based on index', () => {
            const factory = fields.sequence(['a', 'b', 'c']);
            expect(factory({ index: 1, options: undefined })).toBe('a');
            expect(factory({ index: 2, options: undefined })).toBe('b');
            expect(factory({ index: 3, options: undefined })).toBe('c');
            expect(factory({ index: 4, options: undefined })).toBe('a');
            expect(factory({ index: 5, options: undefined })).toBe('b');
        });
        it('works with numbers', () => {
            const factory = fields.sequence([10, 20]);
            expect(factory({ index: 1, options: undefined })).toBe(10);
            expect(factory({ index: 2, options: undefined })).toBe(20);
            expect(factory({ index: 3, options: undefined })).toBe(10);
        });
    });
});
