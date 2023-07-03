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

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

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

    public canLoad(route: Route, segments: Array<UrlSegment> = []): boolean {
        return this.canOpen(route.data as RouteData, segments.map(s => s.path).join('/'));
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canOpen(route.data as RouteData, state.url);
    }

    // eslint-disable-next-line max-lines-per-function
    private canOpen(data: RouteData = {}, returnUrl: string): boolean {
        const permissions: Array<Permission> = data.permissions!;

        if (!this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate([PATHS.login.main], {queryParams: {returnUrl}})
                .then(NOOP).catch(NOOP);
            return false;
        }
        if (isNilOrEmpty(permissions)) {
            return true;
        }
        return this.checkUserHasAtLeastOneOfNeededPermissions(permissions);
    }

    private checkUserHasAtLeastOneOfNeededPermissions(roles: Array<Permission>): boolean {
        return roles.some((neededPerm: Permission) => this.currentUser!.permissions.includes(neededPerm));
    }

}
