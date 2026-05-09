import {describe, expect, it} from 'vitest';
import {isDeepEqual} from '@be/util/is-deep-equal';
import {PersonPreferencesDto} from '@be/person/api/dto/person-preferences.dto';
import {PersonRewriteDto} from '@be/person/api/dto/person-rewrite.dto';
import {PersonRewrite} from '@melluin/common/src';

describe('isDeepEqual', () => {
    it('When primitive arrays are equals Then true returned', () => {
        expect(isDeepEqual([], [])).toBe(true);
        expect(isDeepEqual([1], [1])).toBe(true);
        expect(isDeepEqual([''], [''])).toBe(true);
    });

    it('When primitive arrays are not equals Then true returned', () => {
        expect(isDeepEqual([1], [])).toBe(false);
        expect(isDeepEqual([''], ['', 'sd'])).toBe(false);
    });

    it('When plain objects are equal Then true returned', () => {
        expect(isDeepEqual({a: 1, b: 2}, {a: 1, b: 2})).toBe(true);
    });

    it('When class objects are equal Then true returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;

        const b = new PersonPreferencesDto();
        b.canVolunteerSeeMyEmail = true;
        b.canVolunteerSeeMyPhone = true;

        expect(isDeepEqual(a, b)).toBe(true);
    });

    it('When class objects are not equal Then false returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;

        const b = new PersonPreferencesDto();
        b.canVolunteerSeeMyEmail = true;
        b.canVolunteerSeeMyPhone = false;

        expect(isDeepEqual(a, b)).toBe(false);
    });

    it('When arrays with class objects are equal Then true returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;

        const b = new PersonPreferencesDto();
        b.canVolunteerSeeMyEmail = true;
        b.canVolunteerSeeMyPhone = true;

        expect(isDeepEqual([a, b], [a, b])).toBe(true);
    });

    it('When arrays with class objects are not equal Then false returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;
        const a2 = new PersonPreferencesDto();
        a2.canVolunteerSeeMyEmail = true;
        a2.canVolunteerSeeMyPhone = false;

        const b = new PersonPreferencesDto();
        b.canVolunteerSeeMyEmail = true;
        b.canVolunteerSeeMyPhone = true;

        expect(isDeepEqual([a, b], [a2, b])).toBe(false);
    });

    it('When class object has equal properties with plain object Then true returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;

        const b = {
            canVolunteerSeeMyEmail: true,
            canVolunteerSeeMyPhone: true,
        };

        expect(isDeepEqual(a, b)).toBe(true);
    });

    it('When nested class object has equal properties with nested plain object Then true returned', () => {
        const a = new PersonRewriteDto();
        a.firstName = 'jozsi';
        a.lastName = 'kiss';
        a.cities = [];
        a.preferences = new PersonPreferencesDto();
        a.preferences.canVolunteerSeeMyEmail = true;
        a.preferences.canVolunteerSeeMyPhone = true;

        const b = {
            firstName: 'jozsi',
            lastName: 'kiss',
            cities: [],
            preferences: {
                canVolunteerSeeMyEmail: true,
                canVolunteerSeeMyPhone: true,
            }
        } satisfies PersonRewrite;

        expect(isDeepEqual(a, b)).toBe(true);
    });

    it('When arrays with class object and plain object with equal properties Then true returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;

        const b = {
            canVolunteerSeeMyEmail: true,
            canVolunteerSeeMyPhone: true,
        };
        expect(isDeepEqual([a, b], [a, b])).toBe(true);
    });

    it('When class object has not equal properties with plain object Then false returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;

        const b = {
            canVolunteerSeeMyEmail: false,
            canVolunteerSeeMyPhone: true,
        };

        expect(isDeepEqual(a, b)).toBe(false);
    });

    it('When arrays with class object and plain object with not equal properties Then false returned', () => {
        const a = new PersonPreferencesDto();
        a.canVolunteerSeeMyEmail = true;
        a.canVolunteerSeeMyPhone = true;

        const a2 = new PersonPreferencesDto();
        a2.canVolunteerSeeMyEmail = true;
        a2.canVolunteerSeeMyPhone = false;

        const b = {
            canVolunteerSeeMyEmail: true,
            canVolunteerSeeMyPhone: true,
        };

        expect(isDeepEqual([a, b], [a2, b])).toBe(false);
    });
});
