import {isNotNil} from '@shared/util/util';
import {randomInt, randomNumber, randomString} from '@shared/util/test-util';

describe('TestUtils', () => {
    describe('randomString', () => {
        it('When call it without param Then result\'s length is 10 and no repeated', () => {
            const result1: string = randomString();
            const result2: string = randomString();

            expect(isNotNil(result1)).toBe(true);
            expect(isNotNil(result2)).toBe(true);
            expect(result1.length).toBe(10);
            expect(result2.length).toBe(10);
            expect(result1).not.toEqual(result2);
        });

        it('When call it with param Then length of results are the provided and no repeated', () => {
            const length1 = 4;
            const length2 = 14;

            const result1: string = randomString(length1);
            const result2: string = randomString(length2);

            expect(isNotNil(result1)).toBe(true);
            expect(isNotNil(result2)).toBe(true);
            expect(result1.length).toBe(length1);
            expect(result2.length).toBe(length2);
            expect(result1).not.toEqual(result2);
        });
    });

    describe('randomNumber', () => {
        it('When call it Then result is not nil or NaN', () => {
            const result1: number = randomNumber();
            const result2: number = randomNumber();

            expect(isNotNil(result1)).toBe(true);
            expect(isNotNil(result2)).toBe(true);
            expect(isNaN(result1)).toBe(false);
            expect(isNaN(result2)).toBe(false);
            expect(result1).not.toEqual(result2);
        });
    });

    describe('randomInt', () => {
        it('When call it Then results are not nil, not NaN, and <= limit', () => {
            const limit1 = 20;
            const limit2 = 200;

            const result1: number = randomInt(limit1);
            const result2: number = randomInt(limit2);

            expect(isNotNil(result1)).toBe(true);
            expect(isNotNil(result2)).toBe(true);
            expect(isNaN(result1)).toBe(false);
            expect(isNaN(result2)).toBe(false);
            expect(result1).not.toEqual(result2);
            expect(result1).toBeLessThanOrEqual(limit1);
            expect(result2).toBeLessThanOrEqual(limit2);
        });
    });
});
