import {Component, effect, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {allNil, isNil, isNotNil} from '@shared/util/util';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {Department} from '@shared/department/department';

@Component({
    selector: 'app-department-data-form',
    templateUrl: './department-data-form.component.html',
    styleUrls: ['./department-data-form.component.scss']
})
export class DepartmentDataFormComponent {

    private readonly fb = inject(FormBuilder);

    public readonly department = input<Department>();

    public readonly submitted = output<DepartmentCreation | DepartmentUpdateChangeSet>();
    public readonly canceled = output<void>();

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
        const dep = this.department();
        this.form = this.fb.group({
            name: [dep?.name, [Validators.required]],
            address: [dep?.address, [Validators.required]],
            validFrom: [
                {value: dep?.validFrom, disabled: isNotNil(this.department)},
                [Validators.required]
            ],
            validTo: [dep?.validTo, []],
            diseasesInfo: [dep?.diseasesInfo, []],
            note: [dep?.note, []],
        });
    }

    private createDataForSubmit(): DepartmentCreation | DepartmentUpdateChangeSet {
        if (isNil(this.department())) {
            return this.createDepartmentCreation();
        }
        return this.createDepartmentUpdate();
    }

    private createDepartmentCreation(): DepartmentCreation {
        const data = new DepartmentCreation();
        data.name = this.form.controls.name.value;
        data.address = this.form.controls.address.value;
        data.validFrom = this.form.controls.validFrom.value;
        data.validTo = this.form.controls.validTo.value;
        data.diseasesInfo = this.form.controls.diseasesInfo.value;
        data.note = this.form.controls.note.value;
        return data;
    }

    private createDepartmentUpdate(): DepartmentUpdateChangeSet {
        const data = new DepartmentUpdateChangeSet();
        this.addFieldIfDifferentThenStored(data, 'name');
        this.addFieldIfDifferentThenStored(data, 'address');
        this.addFieldIfDifferentThenStored(data, 'validTo');
        this.addFieldIfDifferentThenStored(data, 'diseasesInfo');
        this.addFieldIfDifferentThenStored(data, 'note');
        return data;
    }

    private addFieldIfDifferentThenStored(data: DepartmentUpdateChangeSet, field: keyof DepartmentUpdateChangeSet): void {
        const newField = this.form.controls[field].value;
        const storedField = this.department()?.[field];
        if (allNil(newField, storedField)) {
            return;
        }
        if (newField === storedField) {
            return;
        }
        data[field] = newField;
    }

}
