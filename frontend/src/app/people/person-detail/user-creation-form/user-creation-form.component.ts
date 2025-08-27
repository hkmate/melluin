import {Component, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserCreation} from '@shared/user/user-creation';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {RoleBrief} from '@shared/user/role';
import {GetRolesService} from '@fe/app/util/get-roles.service';

@Component({
    selector: 'app-user-creation-form',
    templateUrl: './user-creation-form.component.html',
    styleUrls: ['./user-creation-form.component.scss']
})
export class UserCreationFormComponent {

    private readonly fb = inject(FormBuilder);
    private readonly roleService = inject(GetRolesService);
    private readonly permission = inject(PermissionService);

    protected readonly permissions: Array<Permission> = Object.values(Permission);

    public readonly personId = input.required<string>();

    public readonly submitted = output<UserCreation>();
    public readonly canceled = output<void>();

    protected form: FormGroup;
    protected roleOptions: Array<string>;
    protected roles: Array<RoleBrief>;

    constructor() {
        this.roleService.getAll().subscribe(roles => {
            this.roles = roles;
        });
        this.initForm();
    }

    protected onSubmit(): void {
        this.submitted.emit(this.createUserCreation());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): void {
        this.roleOptions = this.permission.getRolesTypesCanBeManaged();
        this.form = this.fb.group({
            userName: [undefined, [Validators.required]],
            password: [undefined, [Validators.required]],
            roleNames: [[]],
            customPermissions: [[]],
        });
        if (!this.permission.has(Permission.canManagePermissions)) {
            this.form.controls.customPermissions.disable();
        }
    }

    private createUserCreation(): UserCreation {
        const data = new UserCreation();
        data.personId = this.personId();
        data.userName = this.form.controls.userName.value;
        data.password = this.form.controls.password.value;
        data.roleNames = this.form.controls.roleNames.value;
        data.customPermissions = this.form.controls.customPermissions.value;
        return data;
    }

}
