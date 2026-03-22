import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {isNil, isNotNil, Permission, User, UUID} from '@melluin/common';
import {UserService} from '@fe/app/people/user.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {UserDataPresenterComponent} from '@fe/app/people/person-detail/user-data-presenter/user-data-presenter.component';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {UserEditFormComponent} from '@fe/app/people/person-detail/user-edit-form/user-edit-form.component';

@Component({
    imports: [
        UserDataPresenterComponent,
        MatButton,
        TranslatePipe,
        UserEditFormComponent
    ],
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent {

    protected readonly permissions = inject(PermissionService);
    private readonly userService = inject(UserService);

    public readonly personId = input.required<UUID>();
    public readonly editEnabled = input.required<boolean>();
    public readonly userId = input<UUID>();

    protected readonly isEdit = signal(false);
    protected readonly user = signal<User | undefined>(undefined);
    protected readonly needDataPresenter = computed(() => isNotNil(this.user()) && !this.isEdit());
    protected readonly needNewUserButton = computed(() => this.computeNeedNewUserBtn());

    constructor() {
        effect(() => this.loadUser());
    }

    protected switchToEdit(): void {
        this.isEdit.set(true);
    }

    protected setSavedUser(data: User): void {
        this.user.set(data);
        this.cancelEditing();
    }

    protected cancelEditing(): void {
        this.isEdit.set(false);
    }

    private computeNeedNewUserBtn(): boolean {
        return isNil(this.user()) && !this.isEdit() && this.permissions.has(Permission.canCreateUser);
    }

    private loadUser(): void {
        const userIdValue = this.userId();
        if (isNil(userIdValue)) {
            return;
        }
        this.userService.get(userIdValue).subscribe(user => {
            this.user.set(user);
        });
    }

}
