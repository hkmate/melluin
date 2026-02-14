import {inject, Injectable} from '@angular/core';
import {Route, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {PATHS} from '../../app-paths';
import {User} from '@shared/user/user';
import {isNilOrEmpty, NOOP} from '@shared/util/util';
import {Permission} from '@shared/user/permission.enum';
import {Store} from '@ngrx/store';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Actions, ofType} from '@ngrx/effects';
import {AppActions} from '@fe/app/state/app-actions';

interface RouteData {
    permissions?: Array<Permission>;
}

export const AuthGuardFn = (route: Route): boolean =>
    inject(AuthGuard).canMatch(route.data as RouteData);

@Injectable()
export class AuthGuard {

    private readonly router = inject(Router);
    private readonly store = inject(Store);
    private readonly actions$ = inject(Actions);
    private readonly authenticationService = inject(AuthenticationService);

    private currentUser?: User = undefined;

    constructor() {
        this.store.pipe(selectCurrentUser).subscribe(cu => {
            this.currentUser = cu;
        });
        this.actions$.pipe(ofType(AppActions.userLogout)).subscribe(() => {
            this.currentUser = undefined;
        })
    }

    public canMatch(data: RouteData = {}): boolean {
        const permissions = data.permissions;
        const returnUrl = window.location.pathname + window.location.search;

        if (!this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate([PATHS.login.main], {queryParams: {returnUrl}})
                .then(NOOP).catch(NOOP);
            return false;
        }
        if (isNilOrEmpty(permissions)) {
            return true;
        }
        return this.checkUserHasAtLeastOneOfNeededPermissions(permissions!);
    }

    private checkUserHasAtLeastOneOfNeededPermissions(permissions: Array<Permission>): boolean {
        return permissions.some((neededPerm: Permission) => this.currentUser!.permissions.includes(neededPerm));
    }

}
