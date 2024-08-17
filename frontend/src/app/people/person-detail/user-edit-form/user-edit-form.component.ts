import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {UserRewrite} from '@shared/user/user-rewrite';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '@shared/user/role.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {passwordMinLength, passwordPattern} from '@shared/constants';
import {Permission} from '@shared/user/permission.enum';

@Component({
    selector: 'app-user-edit-form',
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.scss']
})
export class UserEditFormComponent {

    protected readonly passwordMinLength = passwordMinLength;
    protected readonly roles: Array<Role> = Object.values(Role);
    protected readonly permissions: Array<Permission> = Object.values(Permission);

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
            password: [undefined, [Validators.pattern(passwordPattern)]],
            isActive: [this.userToEdit?.isActive],
            roles: [this.userToEdit?.roles],
            customPermissions: [this.userToEdit?.customPermissions],
            userName: [this.userToEdit?.userName]
        });
        if (!this.permission.has(Permission.canManagePermissions)) {
            this.form.controls.customPermissions.disable();
        }
    }

    private createUserUpdate(): UserRewrite {
        const data = new UserRewrite();
        if (isNotNil(this.form.controls.password.value)) {
            data.password = this.form.controls.password.value
        }
        data.isActive = this.form.controls.isActive.value;
        data.userName = this.form.controls.userName.value;
        data.roles = this.form.controls.roles.value;
        data.customPermissions = this.form.controls.customPermissions.value;
        return data;
    }

}
