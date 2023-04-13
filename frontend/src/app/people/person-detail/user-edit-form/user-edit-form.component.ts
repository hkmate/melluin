import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {UserRewrite} from '@shared/user/user-rewrite';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-user-edit-form',
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.scss']
})
export class UserEditFormComponent {

    @Output()
    public submitted = new EventEmitter<UserRewrite>;

    @Output()
    public canceled = new EventEmitter<void>;

    protected userToEdit?: User;
    protected form: FormGroup;

    constructor(private fb: FormBuilder) {
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
        this.form = this.fb.group({
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            password: [null, [Validators.minLength(8)]],
            isActive: [this.userToEdit?.isActive],
            // TODO: roles, userName
        });
    }

    private createUserUpdate(): UserRewrite {
        const data = new UserRewrite();
        if (isNotNil(this.form.controls.password.value)) {
            data.password = this.form.controls.password.value
        }
        data.isActive = this.form.controls.isActive.value
        data.userName = this.userToEdit!.userName;
        data.roles = this.userToEdit!.roles;
        data.customInfo = this.userToEdit!.customInfo;
        return data;
    }

}
