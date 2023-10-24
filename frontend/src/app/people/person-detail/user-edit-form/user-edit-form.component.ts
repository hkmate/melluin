import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {UserRewrite} from '@shared/user/user-rewrite';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '@shared/user/role.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-user-edit-form',
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.scss']
})
export class UserEditFormComponent {

    protected readonly ROLES: Array<string> = Object.keys(Role);

    @Output()
    public submitted = new EventEmitter<UserRewrite>;

    @Output()
    public canceled = new EventEmitter<void>;

    protected roleOptions: Array<string>;
    protected userToEdit?: User;
    protected form: FormGroup;

    constructor(private fb: FormBuilder,
                private permission: PermissionService) {
    }

    @Input()
    public set user(user: User | undefined) {
        this.userToEdit = user;
        this.initForm();
    }

    public get user(): User | undefined {
        return this.userToEdit;
    }

    protected isUserSetToActive(): boolean {
        return this.form.controls.isActive.value;
    }

    protected onSubmit(): void {
        this.submitted.emit(this.createUserUpdate());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): void {
        this.roleOptions = this.permission.getRolesCanBeManaged();
        this.form = this.fb.group({
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            password: [undefined, [Validators.minLength(8)]],
            isActive: [this.userToEdit?.isActive],
            roles: [this.userToEdit?.roles],
            userName: [this.userToEdit?.userName]
        });
    }

    private createUserUpdate(): UserRewrite {
        const data = new UserRewrite();
        if (isNotNil(this.form.controls.password.value)) {
            data.password = this.form.controls.password.value
        }
        data.isActive = this.form.controls.isActive.value;
        data.userName = this.form.controls.userName.value;
        data.roles = this.form.controls.roles.value;
        data.customInfo = this.userToEdit!.customInfo;
        return data;
    }

}
