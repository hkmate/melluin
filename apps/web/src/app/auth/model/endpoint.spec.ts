import {beforeEach, describe, expect, it} from 'vitest';
import {EndpointMap, HttpMethods} from './endpoint';

describe('EndpointMap', () => {
    let service: EndpointMap;

    beforeEach(() => {
        service = new EndpointMap();
    });

    describe('contains', () => {
        beforeEach(() => {
            service.add({method: HttpMethods.GET, url: 'firstGET'});
            service.add({method: HttpMethods.GET, url: 'secondGET'});
            service.add({method: HttpMethods.POST, url: 'firstPOST'});
            service.add({method: HttpMethods.PATCH, url: 'firstPATCH'});
            service.add({method: HttpMethods.PUT, url: '.*URL_MIDFIX.*'});
        });

        it('When endpoint is in map Then returns true', () => {
            const actual = service.contains({method: HttpMethods.GET, url: 'firstGET'});

            expect(actual).toBe(true);
        });

        it('When endpoint regex is in map Then returns true', () => {
            const actual = service.contains({method: HttpMethods.PUT, url: 'URL_MIDFIX'});

            expect(actual).toBe(true);
        });

        it('When endpoint with url is in map but with other method Then returns false', () => {
            const actual = service.contains({method: HttpMethods.DELETE, url: 'firstGET'});

            expect(actual).toBe(false);
        });

        it('When endpoint with method is in map but with other url Then returns false', () => {
            const actual = service.contains({method: HttpMethods.PATCH, url: 'unknown'});

            expect(actual).toBe(false);
        });

        it('When url and method is in map but not together Then returns false', () => {
            const actual = service.contains({method: HttpMethods.PATCH, url: 'firstGET'});

            expect(actual).toBe(false);
        });

        it('When endpoint is null Then returns false', () => {
            const actual = service.contains(undefined);

            expect(actual).toBe(false);
        });
    });
});
