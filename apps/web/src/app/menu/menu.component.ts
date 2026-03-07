import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import {AuthenticationService} from '@fe/app/auth/service/authentication.service';
import {isNil, isNilOrEmpty, Permission} from '@melluin/common';
import {Platform} from '@angular/cdk/platform';
import {environment} from '@fe/environment';
import {NgTemplateOutlet} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatDivider, MatListItem, MatNavList} from '@angular/material/list';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    imports: [
        MatIcon,
        MatSidenavContainer,
        MatSidenav,
        MatNavList,
        TranslatePipe,
        MatDivider,
        MatSidenavContent,
        MatListItem,
        RouterLink,
        NgTemplateOutlet
    ],
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

    private readonly platform = inject(Platform);
    private readonly currentUserService = inject(CurrentUserService);
    private readonly permissions = inject(PermissionService);
    private readonly authService = inject(AuthenticationService);

    private readonly mobileScreen = this.platform.IOS || this.platform.ANDROID;
    protected readonly menuMode: 'side' | 'over' = this.mobileScreen ? 'over' : 'side';

    protected readonly menuOpened = signal(false);
    protected readonly currentUser = this.currentUserService.currentUser;
    protected readonly canUserSee = computed(() => this.initializeVisibilityOfMenuItems());

    constructor() {
        effect(() => {
            // On login (current user get valid not null value) the menu should open when device is not mobile
            if (isNil(this.currentUser())) {
                return;
            }
            this.menuOpened.set(!this.mobileScreen);
        });
    }

    protected openMenu(): void {
        this.menuOpened.set(true);
    }

    protected closeMenu(): void {
        this.menuOpened.set(false);
    }

    protected navigateHappen(): void {
        if (this.menuMode === 'over') {
            this.menuOpened.set(false);
        }
    }

    protected logout(): void {
        this.authService.logout();
    }

    protected isThereQuestionnaire(): boolean {
        return !isNilOrEmpty(environment.questionnaireForChild)
            || !isNilOrEmpty(environment.questionnaireForParent);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private initializeVisibilityOfMenuItems() {
        if (isNil(this.currentUser())) {
            return {};
        }
        return {
            'people': this.permissions.has(Permission.canSearchPerson),
            'events': this.permissions.has(Permission.canReadVisit),
            'departments': true,
            'statistics': this.permissions.has(Permission.canReadStatistics),
            'admin': this.permissions.has(Permission.canManagePermissions),
        }
    }

}
