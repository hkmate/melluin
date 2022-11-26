import {
    capitalizeFirstLetter,
    flatten,
    isEmpty,
    isNotEmpty,
    isNotNil,
    isNil,
    isNilOrEmpty,
    optionalArrayToArray
} from './util';
import {randomInt, randomNumber} from './test-util.spec';

describe('Utils', () => {

    describe('isNullOrUndefined', () => {

        it('When value is null Then returned true', () => {
            expect(isNil(null)).toBeTrue();
        });

        it('When value is undefined Then returned true', () => {
            expect(isNil(undefined)).toBeTrue();
        });

        it('When value is empty object Then returned false', () => {
            expect(isNil({})).toBeFalse();
        });

        it('When value is an object Then returned false', () => {
            expect(isNil({asd: 2})).toBeFalse();
        });

        it('When value is empty array Then returned false', () => {
            expect(isNil([])).toBeFalse();
        });

        it('When value is an array Then returned false', () => {
            expect(isNil([1, 2])).toBeFalse();
        });

        it('When value is false literal Then returned false', () => {
            expect(isNil(false)).toBeFalse();
        });

        it('When value is number 0 Then returned false', () => {
            expect(isNil(0)).toBeFalse();
        });

        it('When value is random number Then returned false', () => {
            expect(isNil(randomInt(10))).toBeFalse();
        });
    });

    describe('isNotNullOrUndefined', () => {

        it('When value is null Then returned false', () => {
            expect(isNotNil(null)).toBeFalse();
        });

        it('When value is undefined Then returned false', () => {
            expect(isNotNil(undefined)).toBeFalse();
        });

        it('When value is empty object Then returned true', () => {
            expect(isNotNil({})).toBeTrue();
        });

        it('When value is an object Then returned true', () => {
            expect(isNotNil({asd: 2})).toBeTrue();
        });

        it('When value is empty array Then returned true', () => {
            expect(isNotNil([])).toBeTrue();
        });

        it('When value is an array Then returned true', () => {
            expect(isNotNil([1, 2])).toBeTrue();
        });

        it('When value is false literal Then returned true', () => {
            expect(isNotNil(false)).toBeTrue();
        });

        it('When value is number 0 Then returned true', () => {
            expect(isNotNil(0)).toBeTrue();
        });

        it('When value is random number Then returned true', () => {
            expect(isNotNil(randomInt(10))).toBeTrue();
        });
    });

    describe('isEmpty', () => {

        it('When value is null Then error thrown', () => {
            expect(() => isEmpty(null)).toThrow();
        });

        it('When value is undefined Then error thrown', () => {
            expect(() => isEmpty(undefined)).toThrow();
        });

        it('When array is empty Then returned true', () => {
            expect(isEmpty([])).toBeTrue();
        });

        it('When array is not empty Then returned false', () => {
            expect(isEmpty([1])).toBeFalse();
        });

        it('When string is empty Then returned true', () => {
            expect(isEmpty('')).toBeTrue();
        });

        it('When string is not empty Then returned false', () => {
            expect(isEmpty('0')).toBeFalse();
        });
    });

    describe('isNotEmpty', () => {

        it('When value is null Then error thrown', () => {
            expect(() => isNotEmpty(null)).toThrow();
        });

        it('When value is undefined Then error thrown', () => {
            expect(() => isNotEmpty(undefined)).toThrow();
        });

        it('When array is empty Then returned false', () => {
            expect(isNotEmpty([])).toBeFalse();
        });

        it('When array is not empty Then returned true', () => {
            expect(isNotEmpty([1])).toBeTrue();
        });

        it('When string is empty Then returned true', () => {
            expect(isNotEmpty('')).toBeFalse();
        });

        it('When string is not empty Then returned false', () => {
            expect(isNotEmpty('0')).toBeTrue();
        });
    });

    describe('isNullOrUndefinedOrEmpty', () => {

        it('When value is null Then returned true', () => {
            expect(isNilOrEmpty(null)).toBeTrue();
        });

        it('When value is undefined Then returned true', () => {
            expect(isNilOrEmpty(undefined)).toBeTrue();
        });

        it('When array is empty Then returned true', () => {
            expect(isNilOrEmpty([])).toBeTrue();
        });

        it('When array is not empty Then returned false', () => {
            expect(isNilOrEmpty([1])).toBeFalse();
        });

        it('When string is empty Then returned true', () => {
            expect(isNilOrEmpty('')).toBeTrue();
        });

        it('When string is not empty Then returned false', () => {
            expect(isNilOrEmpty('0')).toBeFalse();
        });
    });

    describe('capitalizeFirstLetter', () => {

        it('When value is null Then returned null', () => {
            expect(capitalizeFirstLetter(null)).toEqual(null);
        });

        it('When string is empty Then returned empty string', () => {
            expect(capitalizeFirstLetter('')).toEqual('');
        });

        it('When string is valid Then returned the string with capitalized first letter', () => {
            expect(capitalizeFirstLetter('asd')).toEqual('Asd');
        });

        it('When string is capitalized Then returned the an equal string', () => {
            expect(capitalizeFirstLetter('ASD')).toEqual('ASD');
        });
    });

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

    describe('flatten', () => {

        it('When array is empty Then returned empty array', () => {
            const array = [];
            const expected = [];
            expect(flatten(array)).toEqual(expected);
        });

        it('When array is flat Then returned same array', () => {
            const array = [1, 2, 3, 4, 5];
            const expected = [1, 2, 3, 4, 5];
            expect(flatten(array)).toEqual(expected);
        });

        it('When array has one other array in it Then returned flat array', () => {
            const array = [1, 2, [3, 4], 5];
            const expected = [1, 2, 3, 4, 5];
            expect(flatten(array)).toEqual(expected);
        });

        it('When array has more other array in it Then returned flat array', () => {
            const array = [[1, 2], [3, 4], 5];
            const expected = [1, 2, 3, 4, 5];
            expect(flatten(array)).toEqual(expected);
        });

        it('When array has one deeper array in it Then returned flat array', () => {
            const array = [[1, 2, [3, 4]], 5];
            const expected = [1, 2, 3, 4, 5];
            expect(flatten(array)).toEqual(expected);
        });
    });
});
