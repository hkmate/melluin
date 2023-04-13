import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '@shared/person/person';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {PersonCreation} from '@shared/person/person-creation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNil} from '@shared/util/util';

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

    private createDataForSubmit(): PersonRewrite | PersonCreation {
        const data = this.createEmptySubmitObject();

        data.firstName = this.form.controls.firstName.value;
        data.lastName = this.form.controls.lastName.value;
        data.nickName = this.form.controls.nickName.value;
        data.email = this.form.controls.email.value;
        data.phone = this.form.controls.phone.value;
        // TODO preferences...
        return data;
    }

    private createEmptySubmitObject(): PersonRewrite | PersonCreation {
        if (isNil(this.personToEdit)) {
            return new PersonRewrite();
        }
        return new PersonCreation();
    }

}
