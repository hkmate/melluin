import {Component, computed, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Permission, RoleBrief, UserCreation, UUID} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {GetRolesService} from '@fe/app/util/get-roles.service';
import {TranslatePipe} from '@ngx-translate/core';
import {TrimmedTextInputComponent} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-user-creation-form',
    templateUrl: './user-creation-form.component.html',
    imports: [
        TranslatePipe,
        ReactiveFormsModule,
        TrimmedTextInputComponent,
        MatLabel,
        MatFormField,
        MatSelect,
        MatOption,
        MatButton
    ],
    styleUrls: ['./user-creation-form.component.scss']
})
export class UserCreationFormComponent {

    private readonly fb = inject(FormBuilder);
    private readonly roleService = inject(GetRolesService);
    private readonly permission = inject(PermissionService);

    protected readonly permissions: Array<Permission> = Object.values(Permission);

    public readonly personId = input.required<UUID>();

    public readonly submitted = output<UserCreation>();
    public readonly canceled = output<void>();

    protected readonly form = computed(() => this.initForm());
    protected roleOptions: Array<string>;
    protected roles: Array<RoleBrief>;

    constructor() {
        this.roleService.getAll().subscribe(roles => {
            this.roles = roles;
        });
    }

    protected onSubmit(): void {
        this.submitted.emit(this.createUserCreation());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): FormGroup {
        this.roleOptions = this.permission.getRolesTypesCanBeManaged();
        const form = this.fb.group({
            userName: [undefined, [Validators.required]],
            password: [undefined, [Validators.required]],
            roleNames: [[]],
            customPermissions: [[]],
        });
        if (!this.permission.has(Permission.canManagePermissions)) {
            form.controls.customPermissions.disable();
        }
        return form;
    }

    private createUserCreation(): UserCreation {
        const data = {} as UserCreation;
        data.personId = this.personId();
        data.userName = this.form().controls.userName.value;
        data.password = this.form().controls.password.value;
        data.roleNames = this.form().controls.roleNames.value;
        data.customPermissions = this.form().controls.customPermissions.value;
        return data;
    }

}
