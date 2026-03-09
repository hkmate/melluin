import {Component, inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {ContinueVisitInfo} from '@fe/app/hospital/visit/model/continue-visit-info';
import {Department, Visit, Pageable, UUID} from '@melluin/common';
import dayjs from 'dayjs';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';


type ContinueVisitInfoForm = {
    [K in keyof ContinueVisitInfo]: AbstractControl<ContinueVisitInfo[K]>
}

@Component({
    selector: 'app-continue-other-visit-dialog',
    templateUrl: './continue-other-visit-dialog.component.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        TranslatePipe,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatSelect,
        MatError,
        MatOption,
        MatInput,
        MatDialogActions,
        MatButton
    ],
    styleUrl: './continue-other-visit-dialog.component.scss'
})
export class ContinueOtherVisitDialogComponent {

    private readonly departmentService = inject(DepartmentService);
    private readonly visitService = inject(VisitService);
    private readonly dialogRef = inject<MatDialogRef<ContinueOtherVisitDialogComponent>>(MatDialogRef);
    protected readonly visit = inject<Visit>(MAT_DIALOG_DATA);

    protected readonly fromControl = new FormControl<string>(this.getDefaultFromValue(), {
        nonNullable: true,
        validators: [Validators.required, this.fromTimeValidator()]
    });

    protected readonly departmentIdControl = new FormControl<UUID>('' as UUID, {
        nonNullable: true,
        validators: [Validators.required]
    });

    protected readonly form = new FormGroup<ContinueVisitInfoForm>({
        departmentId: this.departmentIdControl,
        dateTimeFrom: this.fromControl
    });

    protected departmentOptions: Array<Department> = [];

    constructor() {
        this.initDepartmentOptions();
    }

    protected submit(): void {
        if (this.form.valid) {
            const info = {
                departmentId: this.departmentIdControl.value,
                dateTimeFrom: this.parseTime(this.fromControl.value).toISOString()
            };
            this.visitService.continueVisit(this.visit.id, info)
                .subscribe(visit => this.dialogRef.close(visit));
        }
    }

    protected close(): void {
        this.dialogRef.close(null);
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({
            page: 1, size: 100,
            where: {
                id: {operator: 'neq', operand: this.visit.department.id},
                city: {operator: 'eq', operand: this.visit.department.city},
                validFrom: {operator: 'lte', operand: this.visit.dateTimeTo},
                validTo: {operator: 'gte', operand: this.visit.dateTimeFrom}
            }
        }).subscribe(
            (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        );
    }

    private getDefaultFromValue(): string {
        const now = dayjs();
        if (this.isTimeValidAsFrom(now)) {
            return `${now.hour()}:${now.minute()}`;
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const start = dayjs(this.visit.dateTimeTo).subtract(30, 'minutes');
        return `${start.hour()}:${start.minute()}`
    }

    private fromTimeValidator(): ValidatorFn {
        return (control: AbstractControl<string>) => {
            if (this.isTimeValidAsFrom(this.parseTime(control.value))) {
                return null;
            }
            return {fromIncorrect: true};
        }
    }

    private isTimeValidAsFrom(timeStr: string | dayjs.Dayjs): boolean {
        const time = dayjs(timeStr);
        return time.isAfter(this.visit.dateTimeFrom) && time.isBefore(this.visit.dateTimeTo);
    }

    private parseTime(value: string): dayjs.Dayjs {
        const [hour, min] = value.split(':');
        return dayjs(this.visit.dateTimeFrom).hour(+hour).minute(+min);
    }

}
