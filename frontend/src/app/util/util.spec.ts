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
import {randomInt, randomNumber} from './test-util';

describe('Utils', () => {
    describe('isNullOrUndefined', () => {
        it('When value is null Then returned true', () => {
            expect(isNil(null)).toBe(true);
        });

        it('When value is undefined Then returned true', () => {
            // eslint-disable-next-line no-undefined
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

    describe('isNotNullOrUndefined', () => {
        it('When value is null Then returned false', () => {
            expect(isNotNil(null)).toBe(false);
        });

        it('When value is undefined Then returned false', () => {
            // eslint-disable-next-line no-undefined
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

    describe('isEmpty', () => {
        it('When value is null Then error thrown', () => {
            expect(() => isEmpty(null as unknown as string)).toThrow();
        });

        it('When value is undefined Then error thrown', () => {
            // eslint-disable-next-line no-undefined
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

    describe('isNotEmpty', () => {
        it('When value is null Then error thrown', () => {
            expect(() => isNotEmpty(null as unknown as string)).toThrow();
        });

        it('When value is undefined Then error thrown', () => {
            // eslint-disable-next-line no-undefined
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

    describe('isNullOrUndefinedOrEmpty', () => {
        it('When value is null Then returned true', () => {
            expect(isNilOrEmpty(null)).toBe(true);
        });

        it('When value is undefined Then returned true', () => {
            // eslint-disable-next-line no-undefined
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

    describe('capitalizeFirstLetter', () => {
        it('When value is null Then returned null', () => {
            expect(capitalizeFirstLetter(null as unknown as string))
                .toEqual(null as unknown as string);
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

    /* eslint-disable array-bracket-newline */
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
    /* eslint-enable */
});
