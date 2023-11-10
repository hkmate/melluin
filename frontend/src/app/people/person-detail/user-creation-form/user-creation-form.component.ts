import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserCreation} from '@shared/user/user-creation';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Role} from '@shared/user/role.enum';
import {Permission} from '@shared/user/permission.enum';

@Component({
    selector: 'app-user-creation-form',
    templateUrl: './user-creation-form.component.html',
    styleUrls: ['./user-creation-form.component.scss']
})
export class UserCreationFormComponent implements OnInit {

    protected readonly roles: Array<Role> = Object.values(Role);
    protected readonly permissions: Array<Permission> = Object.values(Permission);

    @Input()
    public personId: string;

    @Output()
    public submitted = new EventEmitter<UserCreation>;

    @Output()
    public canceled = new EventEmitter<void>;

    protected form: FormGroup;
    protected roleOptions: Array<string>;

    constructor(private fb: FormBuilder,
                private permission: PermissionService) {
    }

    public ngOnInit(): void {
        this.initForm();
    }

    protected onSubmit(): void {
        this.submitted.emit(this.createUserCreation());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): void {
        this.roleOptions = this.permission.getRolesCanBeManaged();
        this.form = this.fb.group({
            userName: [undefined, [Validators.required]],
            password: [undefined, [Validators.required]],
            roles: [[]],
            customPermissions: [[]],
        });
        if (!this.permission.has(Permission.canManagePermissions)) {
            this.form.controls.customPermissions.disable();
        }
    }

    private createUserCreation(): UserCreation {
        const data = new UserCreation();
        data.personId = this.personId;
        data.userName = this.form.controls.userName.value;
        data.password = this.form.controls.password.value;
        data.roles = this.form.controls.roles.value;
        data.customPermissions = this.form.controls.customPermissions.value;
        return data;
    }

}
