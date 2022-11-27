import {PathProvider, PathResolveService} from './path-resolve.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment} from '@angular/router';

function convertToActivatedRouteSnapshot(path: Array<string>): ActivatedRouteSnapshot {
    return {
        url: path.map(pathElement => new UrlSegment(pathElement, {}))
    } as ActivatedRouteSnapshot;
}

class MockPathProvider implements PathProvider {

    public isId(str: string): boolean {
        return str === ':id';
    }

    public allPaths(): Array<Array<string>> {
        return [
            ['dashboard'],
            ['dashboard', 'calendar'],
            ['dashboard', 'calendar', ':id'],
            ['users'],
            ['users', ':id'],
            ['users', ':id', 'edit'],
            ['users', 'add-user'],
            ['events', 'hospital', 'today'],
            ['events', 'hospital', 'week'],
            ['login']
        ];
    }

}

describe('PathResolveService', () => {
    const pathResolver = new PathResolveService(new MockPathProvider());
    const mockRouterStateSnapshot: RouterStateSnapshot = {} as RouterStateSnapshot;

    describe('resolve', () => {
        it('There is same path in PATHS as typo', () => {
            const path = ['dashboard', 'calendar'];
            expect(pathResolver.resolve(convertToActivatedRouteSnapshot(path), mockRouterStateSnapshot))
                .toBe('/dashboard/calendar');
        });

        it('Typo stands for a path that has another with the same prefix', () => {
            const path = ['events', 'hospital', 'wek'];
            expect(pathResolver.resolve(convertToActivatedRouteSnapshot(path), mockRouterStateSnapshot))
                .toBe('/events/hospital/week');
        });

        it('Typo in first segment and other is correct', () => {
            const path = ['dasboard', 'calendar'];
            expect(pathResolver.resolve(convertToActivatedRouteSnapshot(path), mockRouterStateSnapshot))
                .toBe('/dashboard/calendar');
        });

        it('There is ID in the last segment of the path', () => {
            const path = ['dashboard', 'calendar', '3c8f2321-6fec-4d7c-bcd3-ebca6dd6da69'];
            expect(pathResolver.resolve(convertToActivatedRouteSnapshot(path), mockRouterStateSnapshot))
                .toBe('/dashboard/calendar/3c8f2321-6fec-4d7c-bcd3-ebca6dd6da69');
        });

        it('There is ID in one of the middle segments of the path', () => {
            const path = ['users', '3c8f2321-6fec-4d7c-bcd3-ebca6dd6da69', 'edit'];
            expect(pathResolver.resolve(convertToActivatedRouteSnapshot(path), mockRouterStateSnapshot))
                .toBe('/users/3c8f2321-6fec-4d7c-bcd3-ebca6dd6da69/edit');
        });

        it('There is ID in last segments of the path and there is a dedicated path with same length and prefix', () => {
            const path = ['users', '3c8f2321-6fec-4d7c-bcd3-ebca6dd6da69'];
            expect(pathResolver.resolve(convertToActivatedRouteSnapshot(path), mockRouterStateSnapshot))
                .toBe('/users/3c8f2321-6fec-4d7c-bcd3-ebca6dd6da69');
        });

        it('There is no ID in the path but there is a dedicated path with ID and same length and prefix', () => {
            const path = ['users', 'adduser'];
            expect(pathResolver.resolve(convertToActivatedRouteSnapshot(path), mockRouterStateSnapshot))
                .toBe('/users/add-user');
        });
    });
});
