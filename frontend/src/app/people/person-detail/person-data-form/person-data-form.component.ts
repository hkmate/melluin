import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '@shared/person/person';
import {PersonUpdate} from '@shared/person/person-update';
import {PersonCreation} from '@shared/person/person-creation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {allNil, isNil} from '@shared/util/util';

@Component({
    selector: 'app-person-data-form',
    templateUrl: './person-data-form.component.html',
    styleUrls: ['./person-data-form.component.scss']
})
export class PersonDataFormComponent {

    @Output()
    public submitted = new EventEmitter<PersonUpdate | PersonCreation>;

    @Output()
    public canceled = new EventEmitter<void>;

    protected form: FormGroup;

    private personToEdit?: Person;

    constructor(private fb: FormBuilder) {
    }

    @Input()
    public set person(person: Person | undefined) {
        this.personToEdit = person;
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
        });
    }

    private createDataForSubmit(): PersonUpdate | PersonCreation {
        if (isNil(this.personToEdit)) {
            return this.createPersonCreation();
        }
        return this.createPersonUpdate();
    }

    private createPersonCreation(): PersonCreation {
        const data = new PersonCreation();
        data.firstName = this.form.controls.firstName.value;
        data.lastName = this.form.controls.lastName.value;
        data.nickName = this.form.controls.nickName.value;
        data.email = this.form.controls.email.value;
        data.phone = this.form.controls.phone.value;
        return data;
    }

    private createPersonUpdate(): PersonUpdate {
        const data = new PersonUpdate();
        this.addFieldIfDifferentThenStored(data, 'firstName');
        this.addFieldIfDifferentThenStored(data, 'lastName');
        this.addFieldIfDifferentThenStored(data, 'nickName');
        this.addFieldIfDifferentThenStored(data, 'email');
        this.addFieldIfDifferentThenStored(data, 'phone');
        return data;
    }

    private addFieldIfDifferentThenStored(data: PersonUpdate, field: keyof PersonUpdate): void {
        const newField = this.form.controls[field].value;
        const storedField = this.personToEdit?.[field];
        if (allNil(newField, storedField)) {
            return;
        }
        if (newField === storedField) {
            return;
        }
        data[field] = newField;
    }

}
