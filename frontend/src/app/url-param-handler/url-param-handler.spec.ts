import {QueryParams, UrlParamHandler} from './url-param-handler';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, Params, Router} from '@angular/router';
import {randomString} from '../util/test-util.spec';
import createSpyObj = jasmine.createSpyObj;
import Spy = jasmine.Spy;
import {of} from 'rxjs';

describe('UrlParamHandler', () => {
    let mockRouter: Router;
    let mockActivatedRoute: ActivatedRoute;
    let handler: UrlParamHandler;

    beforeEach(() => {
        mockRouter = createSpyObj(['navigate']) as Router;
        (mockRouter.navigate as Spy).and.returnValue(of({}).toPromise());
        mockActivatedRoute = {} as ActivatedRoute;

        handler = new UrlParamHandler(mockActivatedRoute, mockRouter);
    });

    describe('hasParam', () => {
        it('When the param is there Then returned true', () => {
            const paramName = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {[paramName]: randomString()} as Params
            } as ActivatedRouteSnapshot;

            expect(handler.hasParam(paramName)).toBeTrue();
        });

        it('When the param is not there Then returned false', () => {
            const paramName = randomString();
            const otherParamName = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {[otherParamName]: randomString()} as Params
            } as ActivatedRouteSnapshot;

            expect(handler.hasParam(paramName)).toBeFalse();
        });
    });

    describe('getParam', () => {
        it('When the param is there Then returned the param', () => {
            const paramName = randomString();
            const paramValue = randomString();
            const otherParamName = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {[paramName]: paramValue, [otherParamName]: randomString()} as Params
            } as ActivatedRouteSnapshot;

            const actual = handler.getParam(paramName);

            expect(actual).toEqual(paramValue);
        });

        it('When there is no param there Then returned undefined', () => {
            const paramName = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {} as Params
            } as ActivatedRouteSnapshot;

            const actual = handler.getParam(paramName);

            expect(actual).toBeUndefined();
        });

        it('When this param is not presented in queryParams there Then returned undefined', () => {
            const paramName = randomString();
            const otherParamName = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {[otherParamName]: randomString()} as Params
            } as ActivatedRouteSnapshot;

            const actual = handler.getParam(paramName);

            expect(actual).toBeUndefined();
        });
    });

    describe('setParam', () => {
        it('When there is no query param Then navigate called with right parameters', () => {
            const paramName = randomString();
            const paramValue = randomString();
            mockActivatedRoute.snapshot = {queryParams: {} as Params} as ActivatedRouteSnapshot;

            handler.setParam(paramName, paramValue);

            expect(mockRouter.navigate)
                .toHaveBeenCalledWith([], createNavigateExpectedFromQueryParams({[paramName]: paramValue}));
        });

        it('When there are query params but not what we want set Then navigate called with right parameters', () => {
            const paramName = randomString();
            const paramValue = randomString();
            const otherParamName1 = randomString();
            const otherParamValue1 = randomString();
            const otherParamName2 = randomString();
            const otherParamValue2 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [otherParamName1]: otherParamValue1,
                    [otherParamName2]: otherParamValue2,
                } as Params
            } as ActivatedRouteSnapshot;

            handler.setParam(paramName, paramValue);

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({
                    [otherParamName1]: otherParamValue1,
                    [otherParamName2]: otherParamValue2,
                    [paramName]: paramValue
                }));
        });

        it('When there are query params and it includes what we want set Then navigate called with right parameters', () => {
            const paramName = randomString();
            const paramValue = randomString();
            const otherParamName1 = randomString();
            const otherParamValue1 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [otherParamName1]: otherParamValue1,
                    [paramName]: randomString()
                } as Params
            } as ActivatedRouteSnapshot;


            handler.setParam(paramName, paramValue);

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({[otherParamName1]: otherParamValue1, [paramName]: paramValue}));
        });
    });
    describe('setParams', () => {
        it('When there is no query param and want set one param Then navigate called with right parameters', () => {
            const paramName = randomString();
            const paramValue = randomString();
            mockActivatedRoute.snapshot = {queryParams: {} as Params} as ActivatedRouteSnapshot;

            handler.setParams({[paramName]: paramValue});

            expect(mockRouter.navigate).toHaveBeenCalledWith([], createNavigateExpectedFromQueryParams({[paramName]: paramValue}));
        });

        it('When there is no query param and want set more param Then navigate called with right parameters', () => {
            const paramName = randomString();
            const paramValue = randomString();
            const paramName1 = randomString();
            const paramValue1 = randomString();
            mockActivatedRoute.snapshot = {queryParams: {} as Params} as ActivatedRouteSnapshot;

            handler.setParams({[paramName]: paramValue, [paramName1]: paramValue1});

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({[paramName]: paramValue, [paramName1]: paramValue1}));
        });

        it('When there are query params but not what we want set Then navigate called with right parameters', () => {
            const paramName = randomString();
            const paramValue = randomString();
            const otherParamName1 = randomString();
            const otherParamValue1 = randomString();
            const otherParamName2 = randomString();
            const otherParamValue2 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [otherParamName1]: otherParamValue1,
                    [otherParamName2]: otherParamValue2,
                } as Params
            } as ActivatedRouteSnapshot;

            handler.setParams({[paramName]: paramValue});

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({
                    [otherParamName1]: otherParamValue1,
                    [otherParamName2]: otherParamValue2,
                    [paramName]: paramValue
                }));
        });

        it('When there are query params and it includes what we want set Then navigate called with right parameters', () => {
            const paramName = randomString();
            const paramValue = randomString();
            const otherParamName1 = randomString();
            const otherParamValue1 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [otherParamName1]: otherParamValue1,
                    [paramName]: randomString()
                } as Params
            } as ActivatedRouteSnapshot;

            handler.setParams({[paramName]: paramValue});

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({[otherParamName1]: otherParamValue1, [paramName]: paramValue}));
        });
    });
    describe('removeParam', () => {
        it('When there is no query param Then nothing happened', () => {
            const paramName = randomString();
            mockActivatedRoute.snapshot = {queryParams: {} as Params} as ActivatedRouteSnapshot;

            handler.removeParam(paramName);

            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it('When there are query params but not what we want remove Then nothing happened', () => {
            const paramName = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [randomString()]: randomString(),
                    [randomString()]: randomString()
                } as Params
            } as ActivatedRouteSnapshot;

            handler.removeParam(paramName);

            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it('When there are query params and it includes what we want to remove Then navigate called with right parameters', () => {
            const paramNameToRemove = randomString();
            const otherParamName1 = randomString();
            const otherParamValue1 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [otherParamName1]: otherParamValue1,
                    [paramNameToRemove]: randomString()
                } as Params
            } as ActivatedRouteSnapshot;

            handler.removeParam(paramNameToRemove);

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({[otherParamName1]: otherParamValue1}));
        });
    });
    describe('removeParams', () => {
        it('When there is no query param Then nothing happened', () => {
            const paramName = randomString();
            const paramName1 = randomString();
            mockActivatedRoute.snapshot = {queryParams: {} as Params} as ActivatedRouteSnapshot;

            handler.removeParams([paramName, paramName1]);

            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it('When there are query params but not what we want remove Then nothing happened', () => {
            const paramName = randomString();
            const paramName1 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [randomString()]: randomString(),
                    [randomString()]: randomString()
                } as Params
            } as ActivatedRouteSnapshot;

            handler.removeParams([paramName, paramName1]);

            expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        it('When there are query params and it includes what we want to remove Then navigate called with right parameters', () => {
            const paramNameToRemove = randomString();
            const paramNameToRemove1 = randomString();
            const otherParamName1 = randomString();
            const otherParamValue1 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [otherParamName1]: otherParamValue1,
                    [paramNameToRemove]: randomString(),
                    [paramNameToRemove1]: randomString()
                } as Params
            } as ActivatedRouteSnapshot;

            handler.removeParams([paramNameToRemove, paramNameToRemove1]);

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({[otherParamName1]: otherParamValue1}));
        });

        it('When there are query params and it includes one of what we want to remove Then navigate called with right parameters', () => {
            const paramNameToRemove = randomString();
            const paramNameToRemove1 = randomString();
            const otherParamName1 = randomString();
            const otherParamValue1 = randomString();
            mockActivatedRoute.snapshot = {
                queryParams: {
                    [otherParamName1]: otherParamValue1,
                    [paramNameToRemove]: randomString(),
                } as Params
            } as ActivatedRouteSnapshot;

            handler.removeParams([paramNameToRemove, paramNameToRemove1]);

            expect(mockRouter.navigate).toHaveBeenCalledWith([],
                createNavigateExpectedFromQueryParams({[otherParamName1]: otherParamValue1}));
        });
    });

    function createNavigateExpectedFromQueryParams(qp: QueryParams): NavigationExtras {
        return {
            relativeTo: mockActivatedRoute,
            queryParams: qp,
            queryParamsHandling: null
        };
    }
});
