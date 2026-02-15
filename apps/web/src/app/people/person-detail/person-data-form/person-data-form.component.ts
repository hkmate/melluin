import {Component, computed, inject, input, output} from '@angular/core';
import {emptyToUndef, OperationCity, Permission, Person, PersonCreation, PersonRewrite} from '@melluin/common';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-person-data-form',
    templateUrl: './person-data-form.component.html',
    styleUrls: ['./person-data-form.component.scss']
})
export class PersonDataFormComponent {

    protected readonly cityOptions = Object.keys(OperationCity);

    private readonly fb = inject(FormBuilder);
    private readonly permissionService = inject(PermissionService);

    public readonly person = input<Person>();

    public readonly submitted = output<PersonRewrite | PersonCreation>();
    public readonly canceled = output<void>();

    protected readonly form = computed(() => this.initForm());

    protected onSubmit(): void {
        if (this.form().invalid) {
            return;
        }
        this.submitted.emit(this.createDataForSubmit());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): FormGroup {
        const personToEdit = this.person();
        return this.fb.group({
            firstName: [personToEdit?.firstName, [Validators.required]],
            lastName: [personToEdit?.lastName, [Validators.required]],
            cities: new FormControl({
                value: personToEdit?.cities,
                disabled: !this.permissionService.has(Permission.canModifyPersonCity)
            }, [Validators.required, Validators.minLength(1)]),
            email: [personToEdit?.email],
            phone: [personToEdit?.phone]
        });
    }

    private createDataForSubmit(): PersonRewrite | PersonCreation {
        const data = {} as PersonRewrite | PersonCreation;
        data.firstName = this.form().controls.firstName.value;
        data.lastName = this.form().controls.lastName.value;
        data.cities = this.form().controls.cities.value;
        data.email = emptyToUndef(this.form().controls.email.value);
        data.phone = emptyToUndef(this.form().controls.phone.value);
        data.preferences = this.person()?.preferences;
        return data;
    }

}
