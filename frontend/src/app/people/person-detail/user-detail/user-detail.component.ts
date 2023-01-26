import {Component, Input} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {UserCreation} from '@shared/user/user-creation';
import {UserService} from '@fe/app/people/user.service';
import {UserUpdate} from '@shared/user/user-update';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {

    @Input()
    public personId: string;

    protected editModeOn = false;
    protected createModeOn = false;
    protected userToShow?: User;

    constructor(private readonly userService: UserService) {
    }

    @Input()
    public set user(user: User | undefined) {
        this.userToShow = user;
    }

    public get user(): User | undefined {
        return this.userToShow;
    }

    protected needDataPresenter(): boolean {
        return isNotNil(this.userToShow) && !this.editModeOn && !this.createModeOn;
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
        this.userService.updateUser(this.userToShow!.id, userUpdate).subscribe(user => {
            this.user = user;
            this.cancelEditing();
        })
    }

    protected cancelEditing(): void {
        this.editModeOn = false;
        this.createModeOn = false;
    }

}
