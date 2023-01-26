import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {UserUpdate} from '@shared/user/user-update';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-edit-form',
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.scss']
})
export class UserEditFormComponent {

    @Output()
    public submitted = new EventEmitter<UserUpdate>;

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
            roles: [[]],
        });
    }

    private createUserUpdate(): UserUpdate {
        const data = new UserUpdate();
        if (isNotNil(this.form.controls.password.value)) {
            data.password = this.form.controls.password.value
        }
        if (this.userToEdit?.isActive !== this.form.controls.isActive.value) {
            data.isActive = this.form.controls.isActive.value
        }
        return data;
    }

}
