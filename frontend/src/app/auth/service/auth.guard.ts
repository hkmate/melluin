import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {PATHS} from '../../app-paths';
import {Role} from '../model/role.enum';
import {User} from '../model/user';
import {isNil} from '../../util/util';

interface RouteData {
    roles?: Array<Role>;
}

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    private currentUser: User;

    constructor(
        private readonly router: Router,
        private readonly authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(cu => this.currentUser = cu);
    }

    canLoad(route: Route, segments: UrlSegment[] = []): boolean {
        return this.canOpen(route.data as RouteData, segments.map(s => s.path).join('/'));
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canOpen(route.data as RouteData, state.url);
    }

    private canOpen(data: RouteData = {}, returnUrl: string): boolean {
        const roles: Array<Role> = data.roles;

        if (!this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate([PATHS['login'].main], {queryParams: {returnUrl}});
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
        return roles.some((neededRole: Role) => this.currentUser.roles.includes(neededRole));
    }
}
