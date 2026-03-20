import {describe, expect, it} from 'vitest';
import {optionalArrayToArray} from './optional-array-to-array';
import {randomNumber} from './test-util';

describe('optionalArrayToArray', () => {
    it('When array is empty Then returned empty array', () => {
        const element = [];
        const expected = [];
        expect(optionalArrayToArray(element)).toEqual(expected);
    });

    it('When array given Then returned same array', () => {
        const elements = [randomNumber(), randomNumber(), randomNumber()];
        expect(optionalArrayToArray(elements)).toEqual(elements);
    });

    it('When value given Then returned an array contains the element', () => {
        const element = randomNumber();
        const expected = [element];
        expect(optionalArrayToArray(element)).toEqual(expected);
    });

    it('When null given Then returned an array contains null', () => {
        const expected = [null];
        expect(optionalArrayToArray(null)).toEqual(expected);
    });
});
