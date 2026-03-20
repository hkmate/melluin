import {describe, expect, it} from 'vitest';
import {isNilOrEmpty} from './is-nil-or-empty';

describe('isNilOrEmpty', () => {
    it('When value is null Then returned true', () => {
        expect(isNilOrEmpty(null)).toBe(true);
    });

    it('When value is undefined Then returned true', () => {
        expect(isNilOrEmpty(undefined as unknown as null)).toBe(true);
    });

    it('When array is empty Then returned true', () => {
        expect(isNilOrEmpty([])).toBe(true);
    });

    it('When array is not empty Then returned false', () => {
        expect(isNilOrEmpty([1])).toBe(false);
    });

    it('When string is empty Then returned true', () => {
        expect(isNilOrEmpty('')).toBe(true);
    });

    it('When string is not empty Then returned false', () => {
        expect(isNilOrEmpty('0')).toBe(false);
    });
});
