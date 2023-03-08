import {Component, Input} from '@angular/core';
import {User} from '@shared/user/user';
import {isNil, isNotNil} from '@shared/util/util';
import {UserCreation} from '@shared/user/user-creation';
import {UserService} from '@fe/app/people/user.service';
import {UserUpdate} from '@shared/user/user-update';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {

    Permission = Permission;

    @Input()
    public personId: string;

    @Input()
    public editEnabled: boolean;

    protected editModeOn = false;
    protected createModeOn = false;
    protected user?: User;

    constructor(protected readonly permissions: PermissionService,
                private readonly userService: UserService) {
    }

    @Input()
    public set userId(userId: string | undefined) {
        if (isNil(userId)) {
            return;
        }
        this.userService.get(userId).subscribe(user => {
            this.user = user;
        });
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
            this.cancelEditing();
        })
    }

    protected updateUser(userUpdate: UserUpdate): void {
        this.userService.updateUser(this.user!.id, userUpdate).subscribe(user => {
            this.user = user;
            this.cancelEditing();
        })
    }

    protected cancelEditing(): void {
        this.editModeOn = false;
        this.createModeOn = false;
    }

}
