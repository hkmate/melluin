import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {form, FormField, required, submit, validate} from '@angular/forms/signals';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {Department, Nullable, UUID, Visit} from '@melluin/common';
import dayjs from 'dayjs';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {firstValueFrom, map, Observable} from 'rxjs';
import {isEqual} from 'lodash-es';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {t} from '@fe/app/util/translate/translate';

@Component({
    imports: [
        MatDialogTitle,
        MatDialogContent,
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatError,
        MatOption,
        MatInput,
        MatDialogActions,
        MatButton,
        FormField,
        MelluinMatErrorComponent
    ],
    selector: 'app-continue-other-visit-dialog',
    templateUrl: './continue-other-visit-dialog.component.html',
    styleUrl: './continue-other-visit-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContinueOtherVisitDialogComponent {

    private readonly departmentService = inject(DepartmentService);
    private readonly visitService = inject(VisitService);
    private readonly dialogRef = inject<MatDialogRef<ContinueOtherVisitDialogComponent>>(MatDialogRef);
    protected readonly visit = inject<Visit>(MAT_DIALOG_DATA);

    protected readonly departmentOptions = toSignal(this.loadDepartmentOptions(), {initialValue: []});

    private readonly filterModel = signal({
        departmentId: null as Nullable<UUID>,
        from: this.getDefaultFromValue()
    }, {equal: isEqual});

    protected readonly form = form(this.filterModel, schema => {
        required(schema.departmentId, {message: t('Form.Required')});
        required(schema.from, {message: t('Form.Required')});
        validate(schema.from, ({value}) => {
            if (this.isTimeValidAsFrom(this.parseTime(value()))) {
                return null;
            }
            return {kind: 'fromIncorrect', message: t('Visit.Continue.FromError')};
        })
    });

    protected submitForm(): void {
        submit(this.form, async () => {
            const info = {
                departmentId: this.filterModel().departmentId!,
                dateTimeFrom: this.parseTime(this.filterModel().from).toISOString()
            };
            const visit = await firstValueFrom(this.visitService.continueVisit(this.visit.id, info));
            this.dialogRef.close(visit);
        });
    }

    protected close(): void {
        this.dialogRef.close(null);
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

    private isTimeValidAsFrom(timeStr: string | dayjs.Dayjs): boolean {
        const time = dayjs(timeStr);
        return time.isAfter(this.visit.dateTimeFrom) && time.isBefore(this.visit.dateTimeTo);
    }

    private parseTime(value: string): dayjs.Dayjs {
        const [hour, min] = value.split(':');
        return dayjs(this.visit.dateTimeFrom).hour(+hour).minute(+min);
    }

    private loadDepartmentOptions(): Observable<Array<Department>> {
        return this.departmentService.findDepartments({
            page: 1, size: 100,
            where: {
                id: {operator: 'neq', operand: this.visit.department.id},
                city: {operator: 'eq', operand: this.visit.department.city},
                validFrom: {operator: 'lte', operand: this.visit.dateTimeTo},
                validTo: {operator: 'gte', operand: this.visit.dateTimeFrom}
            }
        }).pipe(map(pages => pages.items));
    }

}
