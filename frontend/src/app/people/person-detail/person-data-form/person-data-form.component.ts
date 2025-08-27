import {Component, computed, effect, inject, input, output} from '@angular/core';
import {Person} from '@shared/person/person';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {PersonCreation} from '@shared/person/person-creation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emptyToUndef, isNotNil} from '@shared/util/util';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-person-data-form',
    templateUrl: './person-data-form.component.html',
    styleUrls: ['./person-data-form.component.scss']
})

export class PersonDataFormComponent {

    private readonly fb = inject(FormBuilder);
    private readonly permissionService = inject(PermissionService);

    public readonly person = input<Person>();

    public readonly submitted = output<PersonRewrite | PersonCreation>();
    public readonly canceled = output<void>();

    protected readonly selfEdit = computed(() => this.person()?.id === this.permissionService.personId);
    protected form: FormGroup;

    constructor() {
        effect(() => this.initForm());
    }

    protected onSubmit(): void {
        this.submitted.emit(this.createDataForSubmit());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): void {
        const personToEdit = this.person();
        this.form = this.fb.group({
            firstName: [personToEdit?.firstName, [Validators.required]],
            lastName: [personToEdit?.lastName, [Validators.required]],
            email: [personToEdit?.email],
            phone: [personToEdit?.phone],
            canVolunteerSeeMyEmail: [personToEdit?.preferences?.canVolunteerSeeMyEmail ?? false],
            canVolunteerSeeMyPhone: [personToEdit?.preferences?.canVolunteerSeeMyPhone ?? false],
        });
        if (!this.selfEdit()) {
            this.form.controls.canVolunteerSeeMyEmail.disable();
            this.form.controls.canVolunteerSeeMyPhone.disable();
        }
    }

    private createDataForSubmit(): PersonRewrite | PersonCreation {
        const data = this.createEmptySubmitObject();

        data.firstName = this.form.controls.firstName.value;
        data.lastName = this.form.controls.lastName.value;
        data.email = emptyToUndef(this.form.controls.email.value);
        data.phone = emptyToUndef(this.form.controls.phone.value);
        data.preferences = {
            ...this.person()?.preferences,
            canVolunteerSeeMyEmail: this.form.controls.canVolunteerSeeMyEmail.value,
            canVolunteerSeeMyPhone: this.form.controls.canVolunteerSeeMyPhone.value,
        };
        return data;
    }


    private createEmptySubmitObject(): PersonRewrite | PersonCreation {
        if (isNotNil(this.person())) {
            return new PersonRewrite();
        }
        return new PersonCreation();
    }

}
