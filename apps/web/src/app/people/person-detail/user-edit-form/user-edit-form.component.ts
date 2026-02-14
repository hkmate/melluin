import {Component, computed, inject, input, output} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {UserRewrite} from '@shared/user/user-rewrite';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {passwordMinLength, passwordPattern} from '@shared/constants';
import {Permission} from '@shared/user/permission.enum';
import {RoleBrief} from '@shared/user/role';
import {GetRolesService} from '@fe/app/util/get-roles.service';

@Component({
    selector: 'app-user-edit-form',
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.scss']
})
export class UserEditFormComponent {

    private readonly fb = inject(FormBuilder);
    private readonly roleService = inject(GetRolesService);
    private readonly permission = inject(PermissionService);

    protected readonly passwordMinLength = passwordMinLength;
    protected readonly permissions: Array<Permission> = Object.values(Permission);

    public readonly user = input<User>();

    public readonly submitted = output<UserRewrite>();
    public readonly canceled = output<void>();

    protected roleOptions: Array<RoleBrief>;
    protected roles: Array<RoleBrief>;
    protected readonly form = computed(() => this.initForm());

    constructor() {
        this.roleService.getAll().subscribe(roles => {
            this.roles = roles;
            const manageableRoleTypes = this.permission.getRolesTypesCanBeManaged();
            this.roleOptions = roles.filter(role => manageableRoleTypes.includes(role.type));
        });
    }

    protected isUserSetToActive(): boolean {
        return this.form().controls.isActive.value;
    }

    protected onSubmit(): void {
        this.submitted.emit(this.createUserUpdate());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): FormGroup {
        const userToEdit = this.user();
        const form = this.fb.group({
            password: [undefined, [Validators.pattern(passwordPattern)]],
            isActive: [userToEdit?.isActive],
            roles: [userToEdit?.roles.map(r => r.name)],
            customPermissions: [userToEdit?.customPermissions],
            userName: [userToEdit?.userName]
        });
        if (!this.permission.has(Permission.canManagePermissions)) {
            form.controls.customPermissions.disable();
        }
        return form;
    }

    private createUserUpdate(): UserRewrite {
        const data = {} as UserRewrite;
        if (isNotNil(this.form().controls.password.value)) {
            data.password = this.form().controls.password.value
        }
        data.isActive = this.form().controls.isActive.value;
        data.userName = this.form().controls.userName.value;
        data.roleNames = this.form().controls.roles.value;
        data.customPermissions = this.form().controls.customPermissions.value;
        return data;
    }

}
