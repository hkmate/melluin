import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment
} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {PATHS} from '../../app-paths';
import {Role} from '@shared/user/role.enum';
import {User} from '@shared/user/user';
import {isNil, NOOP} from '@shared/util/util';

interface RouteData {
    roles?: Array<Role>;
}

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    private currentUser: User | null = null;

    constructor(
        private readonly router: Router,
        private readonly authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(cu => {
            this.currentUser = cu
        });
    }

    public canLoad(route: Route, segments: Array<UrlSegment> = []): boolean {
        return this.canOpen(route.data as RouteData, segments.map(s => s.path).join('/'));
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canOpen(route.data as RouteData, state.url);
    }

    // eslint-disable-next-line max-lines-per-function
    private canOpen(data: RouteData = {}, returnUrl: string): boolean {
        const roles: Array<Role> = data.roles!;

        if (!this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate([PATHS.login.main], {queryParams: {returnUrl}})
                .then(NOOP).catch(NOOP);
            return false;
        }
        if (isNil(roles)) {
            return true;
        }
        if (this.checkUserHasAtLeastOneOfNeededRoles(roles)) {
            return true;
        }
        return false;
    }

    private checkUserHasAtLeastOneOfNeededRoles(roles: Array<Role>): boolean {
        return roles.some((neededRole: Role) => this.currentUser!.roles.includes(neededRole));
    }

}
