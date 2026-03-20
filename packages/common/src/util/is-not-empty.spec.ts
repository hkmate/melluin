import {describe, expect, it} from 'vitest';
import {isNotEmpty} from './is-not-empty';

describe('isNotEmpty', () => {
    it('When value is null Then error thrown', () => {
        expect(() => isNotEmpty(null as unknown as string)).toThrow();
    });

    it('When value is undefined Then error thrown', () => {
        expect(() => isNotEmpty(undefined as unknown as string)).toThrow();
    });

    it('When array is empty Then returned false', () => {
        expect(isNotEmpty([])).toBe(false);
    });

    it('When array is not empty Then returned true', () => {
        expect(isNotEmpty([1])).toBe(true);
    });

    it('When string is empty Then returned true', () => {
        expect(isNotEmpty('')).toBe(false);
    });

    it('When string is not empty Then returned false', () => {
        expect(isNotEmpty('0')).toBe(true);
    });
});
