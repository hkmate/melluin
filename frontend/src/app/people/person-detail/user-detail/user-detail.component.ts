import {Component, effect, inject, input} from '@angular/core';
import {User} from '@shared/user/user';
import {isNil, isNotNil} from '@shared/util/util';
import {UserCreation} from '@shared/user/user-creation';
import {UserService} from '@fe/app/people/user.service';
import {UserRewrite} from '@shared/user/user-rewrite';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {

    protected readonly permissions = inject(PermissionService);
    private readonly msg = inject(MessageService);
    private readonly userService = inject(UserService);

    Permission = Permission;

    public readonly personId = input.required<string>();
    public readonly editEnabled = input.required<boolean>();
    public readonly userId = input<string>();

    protected editModeOn = false;
    protected createModeOn = false;
    protected user?: User;

    constructor() {
        effect(() => this.loadUser());
    }

    protected needDataPresenter(): boolean {
        return isNotNil(this.user) && !this.editModeOn && !this.createModeOn;
    }

    protected switchToEdit(): void {
        this.editModeOn = true;
    }

    protected switchToCreate(): void {
        this.createModeOn = true;
    }

    protected createUser(userCreation: UserCreation): void {
        this.userService.addUser(userCreation).subscribe(user => {
            this.user = user;
            this.msg.success('SaveSuccessful');
            this.cancelEditing();
        })
    }

    protected updateUser(userUpdate: UserRewrite): void {
        this.userService.updateUser(this.user!.id, userUpdate).subscribe(user => {
            this.user = user;
            this.msg.success('SaveSuccessful');
            this.cancelEditing();
        })
    }

    protected cancelEditing(): void {
        this.editModeOn = false;
        this.createModeOn = false;
    }

    private loadUser(): void {
        const userIdValue = this.userId();
        if (isNil(userIdValue)) {
            return;
        }
        this.userService.get(userIdValue).subscribe(user => {
            this.user = user;
        });
    }

}
