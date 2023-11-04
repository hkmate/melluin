import {inject, Injectable} from '@angular/core';
import {Route, Router, UrlSegment} from '@angular/router';
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

export const AuthGuardFn = (route: Route, segments: Array<UrlSegment>): boolean =>
    inject(AuthGuard).canMatch(route.data as RouteData, segments);

@Injectable()
export class AuthGuard {

    private currentUser?: User = undefined;

    constructor(private readonly router: Router,
                private readonly store: Store,
                private readonly actions$: Actions,
                private readonly authenticationService: AuthenticationService) {
        this.store.pipe(selectCurrentUser).subscribe(cu => {
            this.currentUser = cu;
        });
        this.actions$.pipe(ofType(AppActions.userLogout)).subscribe(() => {
            this.currentUser = undefined;
        })
    }

    public canMatch(data: RouteData = {}, segments: Array<UrlSegment> = []): boolean {
        const permissions = data.permissions;
        const returnUrl = segments.map(s => s.path).join('/');

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
