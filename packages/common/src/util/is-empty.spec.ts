import {describe, expect, it} from 'vitest';
import {isEmpty} from './is-empty';

describe('isEmpty', () => {
    it('When value is null Then error thrown', () => {
        expect(() => isEmpty(null as unknown as string)).toThrow();
    });

    it('When value is undefined Then error thrown', () => {
        expect(() => isEmpty(undefined as unknown as string)).toThrow();
    });

    it('When array is empty Then returned true', () => {
        expect(isEmpty([])).toBe(true);
    });

    it('When array is not empty Then returned false', () => {
        expect(isEmpty([1])).toBe(false);
    });

    it('When string is empty Then returned true', () => {
        expect(isEmpty('')).toBe(true);
    });

    it('When string is not empty Then returned false', () => {
        expect(isEmpty('0')).toBe(false);
    });
});
