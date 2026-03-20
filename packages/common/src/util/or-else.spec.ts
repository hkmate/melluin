import {describe, expect, it } from 'vitest';
import {orElse} from './or-else';

describe('orElse', () => {
    it('When value is null Then default value returned', () => {
        expect(orElse(null, 1)).toEqual(1);
    });

    it('When value is undefined Then default value returned', () => {
        expect(orElse(undefined, 1)).toEqual(1);
    });

    it('When value is not nil Then original value returned', () => {
        expect(orElse(1, 2)).toEqual(1);
    });

    it('When value is falsy Then default value returned', () => {
        expect(orElse(0, 1)).toEqual(0);
        expect(orElse(false, true)).toEqual(false);
        expect(orElse('', 'some')).toStrictEqual('');
        expect(orElse([], [1, 2])).toStrictEqual([]);
    });
});
