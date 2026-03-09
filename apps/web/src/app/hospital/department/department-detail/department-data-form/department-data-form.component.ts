import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {
    DEFAULT_TO_DATE,
    Department,
    DepartmentCreation,
    isNil,
    isNotNil,
    Nullable,
    OperationCity,
    orElse
} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {TrimmedTextInputComponent2} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCard} from '@angular/material/card';
import {disabled, form, FormField, min, required, submit} from '@angular/forms/signals';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {firstValueFrom} from 'rxjs';
import {NgxsmkDatepickerComponent} from 'ngxsmk-datepicker';
import {t} from '@fe/app/util/translate/translate';

@Component({
    imports: [
        TranslatePipe,
        TrimmedTextInputComponent2,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatInput,
        MatCard,
        MatCheckbox,
        MatButton,
        FormField,
        MatError,
        MelluinMatErrorComponent,
        AppSubmit,
        NgxsmkDatepickerComponent
    ],
    selector: 'app-department-data-form',
    templateUrl: './department-data-form.component.html',
    styleUrls: ['./department-data-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentDataFormComponent {

    protected readonly cityOptions = Object.keys(OperationCity) as Array<OperationCity>;
    private readonly departmentService = inject(DepartmentService);

    public readonly department = input<Department>();

    public readonly submitted = output<Department>();
    public readonly canceled = output<void>();

    private readonly formModel = signal(this.getDefaultFormModel());
    protected readonly form = form(this.formModel, schema => {
        required(schema.name,     {message: t('Form.Required')});
        required(schema.address,    {message: t('Form.Required')});
        required(schema.city,       {message: t('Form.Required')});
        required(schema.validFrom,    {message: t('Form.Required')});
        required(schema.limitOfVisits, {message: t('Form.Required')});
        min(schema.limitOfVisits, 1, {message: t('Form.Min', {min: 1})});

        disabled(schema.validFrom, () => isNotNil(this.department()));
    });

    protected readonly minDate = computed(() => orElse(this.formModel().validFrom, new Date()));
    protected readonly maxDate = computed(() => orElse(this.formModel().validTo, DEFAULT_TO_DATE));

    constructor() {
        effect(() => this.setupFormInput());
    }

    protected submitForm(): void {
        submit(this.form, async () => {
            const saved = await this.saveDepartment();
            this.submitted.emit(saved);
        });
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getDefaultFormModel() {
        return {
            name: '',
            address: '',
            city: OperationCity.PECS,
            validFrom: null as Nullable<Date>,
            validTo: null as Nullable<Date>,
            diseasesInfo: '',
            note: '',
            limitOfVisits: 1,
            vicariousMomIncludedInLimit: false
        };
    }

    private setupFormInput(): void {
        const department = this.department();
        if (isNil(department)) {
            this.formModel.set(this.getDefaultFormModel());
            return;
        }
        const {id, ...values} = department;
        this.formModel.set({
            ...values,
            validFrom: new Date(values.validFrom),
            validTo: isNil(values.validTo) ? null : new Date(values.validTo),
            diseasesInfo: values.diseasesInfo ?? '',
            note: values.note ?? '',
        });
    }

    private saveDepartment(): Promise<Department> {
        return firstValueFrom(this.departmentService.saveDepartment(this.generateDto()))
    }

    private generateDto(): DepartmentCreation | Department {
        const existingDepartment = this.department();
        const formValue = this.form().value();
        const obj = {
            ...formValue,
            validFrom: formValue.validFrom!.toISOString(),
            validTo: formValue.validTo?.toISOString()
        } satisfies DepartmentCreation

        if (isNil(existingDepartment)) {
            return obj;
        }
        return {...obj, id: existingDepartment.id};
    }

}
