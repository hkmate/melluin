import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@fe/app/auth/service/authentication.service';
import {User} from '@shared/user/user';
import {includeAny, isNil, isNilOrEmpty} from '@shared/util/util';
import {Permission} from '@shared/user/permission.enum';
import {Platform} from '@angular/cdk/platform';
import {AutoUnSubscriberComponent} from '@fe/app/util/auto-unsubscriber.component';
import {Store} from '@ngrx/store';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Actions, ofType} from '@ngrx/effects';
import {AppActions} from '@fe/app/state/app-actions';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AutoUnSubscriberComponent implements OnInit {

    protected canUserSee?: Record<string, boolean>;

    protected menuMode: 'side' | 'over' = 'side';
    protected menuOpened = false;
    protected currentUser?: User;

    constructor(private readonly store: Store,
                private readonly actions$: Actions,
                private readonly platform: Platform,
                private readonly authService: AuthenticationService) {
        super();
    }

    public ngOnInit(): void {
        this.menuMode = (this.platform.IOS || this.platform.ANDROID) ? 'over' : 'side';
        this.addSubscription(this.store.pipe(selectCurrentUser), cu => {
            this.currentUser = cu;
            this.menuOpened = !(this.platform.IOS || this.platform.ANDROID);
            this.initializeVisibilityOfMenuItems();
        });
        this.addSubscription(this.actions$.pipe(ofType(AppActions.userLogout)), () => {
            this.currentUser = undefined;
            this.initializeVisibilityOfMenuItems();
        });
    }

    protected toggleMenu(): void {
        this.menuOpened = !this.menuOpened;
    }

    protected logout(): void {
        this.authService.logout();
    }

    private initializeVisibilityOfMenuItems(): void {
        if (isNil(this.currentUser) || isNilOrEmpty(this.currentUser.permissions)) {
            this.canUserSee = {};
            return;
        }

        const permissions: Array<Permission> = this.currentUser.permissions;
        this.canUserSee = {
            'people': includeAny(permissions, Permission.canSearchPerson),
            'events': includeAny(permissions, Permission.canReadVisit),
            'departments': true,
        }
    }

}
