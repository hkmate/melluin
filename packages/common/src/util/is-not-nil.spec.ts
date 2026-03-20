import {describe, expect, it} from 'vitest';
import { isNotNil } from './is-not-nil';
import {randomInt} from './test-util';

describe('isNotNil', () => {
    it('When value is null Then returned false', () => {
        expect(isNotNil(null)).toBe(false);
    });

    it('When value is undefined Then returned false', () => {
        expect(isNotNil(undefined)).toBe(false);
    });

    it('When value is empty object Then returned true', () => {
        expect(isNotNil({})).toBe(true);
    });

    it('When value is an object Then returned true', () => {
        expect(isNotNil({asd: 2})).toBe(true);
    });

    it('When value is empty array Then returned true', () => {
        expect(isNotNil([])).toBe(true);
    });

    it('When value is an array Then returned true', () => {
        expect(isNotNil([1, 2])).toBe(true);
    });

    it('When value is false literal Then returned true', () => {
        expect(isNotNil(false)).toBe(true);
    });

    it('When value is number 0 Then returned true', () => {
        expect(isNotNil(0)).toBe(true);
    });

    it('When value is random number Then returned true', () => {
        expect(isNotNil(randomInt(10))).toBe(true);
    });
});
