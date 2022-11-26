import {LevenshteinCalculator} from './levenshtein-calculator';

describe('LevenshteinCalculator', () => {

    describe('getLevenshteinDistance', () => {

        it('"book" vs "back" -> 2', () => {
            expect(LevenshteinCalculator.getLevenshteinDistance('book', 'back')).toBe(2);
        });

        it('"book" vs "" -> 4', () => {
            expect(LevenshteinCalculator.getLevenshteinDistance('book', '')).toBe(4);
        });

        it('"" vs "programming" -> 11', () => {
            expect(LevenshteinCalculator.getLevenshteinDistance('', 'programming')).toBe(11);
        });

        it('"book" vs "book" -> 0', () => {
            expect(LevenshteinCalculator.getLevenshteinDistance('book', 'book')).toBe(0);
        });

        it('"book" vs "angular" -> 7', () => {
            expect(LevenshteinCalculator.getLevenshteinDistance('book', 'angular')).toBe(7);
        });
    });
});
