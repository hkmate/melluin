import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@fe/app/auth/service/authentication.service';
import {Subscription} from 'rxjs';
import {User} from '@shared/user/user';
import {includeAny, isNil, isNotNil, Nullable} from '@shared/util/util';
import {foundationEmployeeRoles, Role} from '@shared/user/role.enum';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

    protected canUserSee?: Record<string, boolean>;

    protected menuOpened = false;
    protected currentUser?: Nullable<User>;

    private currentUserSubscription!: Subscription;

    constructor(private readonly authService: AuthenticationService) {
    }

    public ngOnInit(): void {
        this.currentUserSubscription = this.authService.currentUser.subscribe(
            (currentUser: Nullable<User>) => {
                this.currentUser = currentUser;
                this.initializeVisibilityOfMenuItems();
            });
        setTimeout(() => {
            this.menuOpened = true;
        })
    }

    public ngOnDestroy(): void {
        if (isNotNil(this.currentUserSubscription)) {
            this.currentUserSubscription.unsubscribe();
        }
    }

    protected toggleMenu(): void {
        this.menuOpened = !this.menuOpened;
    }

    protected logout(): void {
        this.authService.logout();
    }

    private initializeVisibilityOfMenuItems(): void {
        if (isNil(this.currentUser) || isNil(this.currentUser.roles)) {
            this.canUserSee = {};
            return;
        }

        const roles: Array<Role> = this.currentUser.roles;
        this.canUserSee = {
            'people': includeAny(roles, ...foundationEmployeeRoles),
            'events': includeAny(roles, ...foundationEmployeeRoles),
            'reports': includeAny(roles, ...foundationEmployeeRoles),
            'notifications': includeAny(roles, ...foundationEmployeeRoles),
            'departments': includeAny(roles, Role.SYSADMIN, Role.ADMINISTRATOR, Role.HOSPITAL_VISIT_COORDINATOR),
        }
    }

}
