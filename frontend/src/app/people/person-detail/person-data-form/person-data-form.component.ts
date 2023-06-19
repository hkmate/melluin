import {Component, EventEmitter, Input, Output} from '@angular/core';
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

    @Output()
    public submitted = new EventEmitter<PersonRewrite | PersonCreation>;

    @Output()
    public canceled = new EventEmitter<void>;

    protected selfEdit: boolean;
    protected form: FormGroup;

    private personToEdit?: Person;

    constructor(private readonly fb: FormBuilder,
                private readonly permissionService: PermissionService) {
    }

    @Input()
    public set person(person: Person | undefined) {
        this.personToEdit = person;
        this.selfEdit = (person?.id === this.permissionService.personId);
        this.initForm();
    }

    public get person(): Person | undefined {
        return this.personToEdit;
    }

    protected onSubmit(): void {
        this.submitted.emit(this.createDataForSubmit());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): void {
        this.form = this.fb.group({
            firstName: [this.personToEdit?.firstName, [Validators.required]],
            lastName: [this.personToEdit?.lastName, [Validators.required]],
            nickName: [this.personToEdit?.nickName],
            email: [this.personToEdit?.email],
            phone: [this.personToEdit?.phone],
            canVolunteerSeeMyEmail: [this.personToEdit?.preferences?.canVolunteerSeeMyEmail ?? false],
            canVolunteerSeeMyPhone: [this.personToEdit?.preferences?.canVolunteerSeeMyPhone ?? false],
        });
        if (!this.selfEdit) {
            this.form.controls.canVolunteerSeeMyEmail.disable();
            this.form.controls.canVolunteerSeeMyPhone.disable();
        }
    }

    private createDataForSubmit(): PersonRewrite | PersonCreation {
        const data = this.createEmptySubmitObject();

        data.firstName = this.form.controls.firstName.value;
        data.lastName = this.form.controls.lastName.value;
        data.nickName = emptyToUndef(this.form.controls.nickName.value);
        data.email = emptyToUndef(this.form.controls.email.value);
        data.phone = emptyToUndef(this.form.controls.phone.value);
        data.preferences = {
            ...this.personToEdit?.preferences,
            canVolunteerSeeMyEmail: this.form.controls.canVolunteerSeeMyEmail.value,
            canVolunteerSeeMyPhone: this.form.controls.canVolunteerSeeMyPhone.value,
        };
        return data;
    }


    private createEmptySubmitObject(): PersonRewrite | PersonCreation {
        if (isNotNil(this.personToEdit)) {
            return new PersonRewrite();
        }
        return new PersonCreation();
    }

}
