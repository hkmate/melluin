import { describe, expect, it } from 'vitest';
import {includeAny} from './include-any';

describe('includeAny', () => {
    it('When array is empty Then returned false', () => {
        const arr = []
        expect(includeAny(arr, 'asd', 'are')).toBe(false);
    });

    it('When array has more item and no values Then returned false', () => {
        const arr = ['po', 'asd', 'lakj'];
        expect(includeAny(arr)).toBe(false);
    });

    it('When array has one item and values aren\'t that Then returned false', () => {
        const arr = ['rew'];
        expect(includeAny(arr, 'asd', 'are')).toBe(false);
    });

    it('When array has one item and one of the values is that Then returned true', () => {
        const arr = ['asd'];
        expect(includeAny(arr, 'asd', 'are')).toBe(true);
    });

    it('When array has more item and one of the values is that Then returned true', () => {
        const arr = ['asd', 'lakj'];
        expect(includeAny(arr, 'oia', 'asd', 'are')).toBe(true);
    });

    it('When array has more item and one of the values is that but not the first Then returned true', () => {
        const arr = ['po', 'asd', 'lakj'];
        expect(includeAny(arr, 'oia', 'asd', 'are')).toBe(true);
    });
});
