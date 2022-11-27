import {EndpointMap, HttpMethod} from './endpoint';

describe('EndpointMap', () => {
    let service: EndpointMap;

    beforeEach(() => {
        service = new EndpointMap();
    });

    describe('contains', () => {
        beforeEach(() => {
            service.add({method: HttpMethod.GET, url: 'firstGET'});
            service.add({method: HttpMethod.GET, url: 'secondGET'});
            service.add({method: HttpMethod.POST, url: 'firstPOST'});
            service.add({method: HttpMethod.PATCH, url: 'firstPATCH'});
            service.add({method: HttpMethod.PUT, url: '.*URL_MIDFIX.*'});
        });

        it('When endpoint is in map Then returns true', () => {
            const actual = service.contains({method: HttpMethod.GET, url: 'firstGET'});

            expect(actual).toBeTrue();
        });

        it('When endpoint regex is in map Then returns true', () => {
            const actual = service.contains({method: HttpMethod.PUT, url: 'URL_MIDFIX'});

            expect(actual).toBeTrue();
        });

        it('When endpoint with url is in map but with other method Then returns false', () => {
            const actual = service.contains({method: HttpMethod.DELETE, url: 'firstGET'});

            expect(actual).toBeFalse();
        });

        it('When endpoint with method is in map but with other url Then returns false', () => {
            const actual = service.contains({method: HttpMethod.PATCH, url: 'unknown'});

            expect(actual).toBeFalse();
        });

        it('When url and method is in map but not together Then returns false', () => {
            const actual = service.contains({method: HttpMethod.PATCH, url: 'firstGET'});

            expect(actual).toBeFalse();
        });

        it('When endpoint is null Then returns false', () => {
            const actual = service.contains(null);

            expect(actual).toBeFalse();
        });
    });
});
