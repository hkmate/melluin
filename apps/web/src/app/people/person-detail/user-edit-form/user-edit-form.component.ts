import {Component, computed, inject, input, output} from '@angular/core';
import {isNotNil, passwordMinLength, passwordPattern, Permission, RoleBrief, User, UserRewrite} from '@melluin/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {GetRolesService} from '@fe/app/util/get-roles.service';
import {TranslatePipe} from '@ngx-translate/core';
import {TrimmedTextInputComponent} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatFormField, MatHint, MatInput, MatLabel} from '@angular/material/input';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-user-edit-form',
    templateUrl: './user-edit-form.component.html',
    imports: [
        TranslatePipe,
        ReactiveFormsModule,
        TrimmedTextInputComponent,
        MatFormField,
        MatLabel,
        MatInput,
        MatHint,
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardContent,
        MatSlideToggle,
        MatSelect,
        MatOption,
        MatButton
    ],
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
