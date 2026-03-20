import { describe, expect, it } from 'vitest';
import {isNil} from './is-nil';
import {randomInt} from './test-util';

describe('isNil', () => {
    it('When value is null Then returned true', () => {
        expect(isNil(null)).toBe(true);
    });

    it('When value is undefined Then returned true', () => {
        expect(isNil(undefined)).toBe(true);
    });

    it('When value is empty object Then returned false', () => {
        expect(isNil({})).toBe(false);
    });

    it('When value is an object Then returned false', () => {
        expect(isNil({asd: 2})).toBe(false);
    });

    it('When value is empty array Then returned false', () => {
        expect(isNil([])).toBe(false);
    });

    it('When value is an array Then returned false', () => {
        expect(isNil([1, 2])).toBe(false);
    });

    it('When value is false literal Then returned false', () => {
        expect(isNil(false)).toBe(false);
    });

    it('When value is number 0 Then returned false', () => {
        expect(isNil(0)).toBe(false);
    });

    it('When value is random number Then returned false', () => {
        expect(isNil(randomInt(10))).toBe(false);
    });
});
