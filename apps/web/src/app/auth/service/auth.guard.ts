import {inject, Injectable} from '@angular/core';
import {Route, Router} from '@angular/router';
import {PATHS} from '../../app-paths';
import {isNil, isNilOrEmpty, NOOP, PermissionT} from '@melluin/common';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';

interface RouteData {
    permissions?: Array<PermissionT>;
}

export const AuthGuardFn = (route: Route): boolean =>
    inject(AuthGuard).canMatch(route.data as RouteData);

@Injectable({providedIn: 'root'})
export class AuthGuard {

    private readonly router = inject(Router);
    private readonly permission = inject(PermissionService);

    private readonly currentUser = inject(CurrentUserService).currentUser;

    public canMatch(data: RouteData = {}): boolean {
        const permissions = data.permissions;
        const returnUrl = window.location.pathname + window.location.search;

        if (isNil(this.currentUser())) {
            this.router.navigate([PATHS.login.main], {queryParams: {returnUrl}})
                .then(NOOP).catch(NOOP);
            return false;
        }
        if (isNilOrEmpty(permissions)) {
            return true;
        }
        return this.checkUserHasAtLeastOneOfNeededPermissions(permissions!);
    }

    private checkUserHasAtLeastOneOfNeededPermissions(permissions: Array<PermissionT>): boolean {
        return permissions.some((neededPerm: PermissionT) => this.permission.has(neededPerm));
    }

}
