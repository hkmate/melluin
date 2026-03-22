import {Component, computed, effect, inject, input, model, output, signal} from '@angular/core';
import {
    Department,
    isNil,
    isNotNil,
    Nullable,
    Pageable,
    parseTime,
    parseTimeWithDate,
    Permission,
    UUID,
    Visit,
    VisitCreate,
    VisitRewrite,
    VisitStatus,
    VisitStatuses
} from '@melluin/common';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {SelectOption} from '@fe/app/util/visit-status-option';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {PersonSelectComponent2} from '@fe/app/util/person-select/person-select.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {round} from 'lodash-es';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {
    getStatusesCoordinatorChangeToFrom,
    getStatusesVolunteerChangeToFrom
} from '@fe/app/hospital/visit/visit-details/visit-form/status-options';
import {disabled, form, FormField, max, min, required, submit, validate} from '@angular/forms/signals';
import {t} from '@fe/app/util/translate/translate';
import {firstValueFrom} from 'rxjs';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {VisitFormSaveService} from '@fe/app/hospital/visit/visit-details/visit-form/visit-form-save.service';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';

const MS_ON_HOUR = 3600000; // 1000 * 60 * 60
const MIN_ON_HOUR = 60;
const MAX_COUNTED_HOURS = 24;
const DECIMALS_IN_COUNTED_HOURS = 2;
const DEFAULT_TIME_FROM = '16:00';
const DEFAULT_TIME_TO = '18:00';

@Component({
    imports: [
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        PersonSelectComponent2,
        MatInput,
        MatCardContent,
        MatCard,
        MatCheckbox,
        MatButton,
        AppSubmit,
        FormField,
        MatError,
        MelluinMatErrorComponent,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepicker
    ],
    providers: [VisitFormSaveService],
    selector: 'app-visit-form',
    templateUrl: './visit-form.component.html',
    styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent {

    private readonly permission = inject(PermissionService);
    private readonly departmentService = inject(DepartmentService);
    private readonly formSaveService = inject(VisitFormSaveService);

    public readonly createNewAfterSave = model<boolean>(false);
    public readonly visit = input<Visit>();

    public readonly submitted = output<Visit>();
    public readonly canceled = output<void>();

    protected statusOptions = signal<Array<SelectOption<VisitStatus>>>([]);
    protected departmentOptions = signal<Array<Department>>([]);
    protected isVisitFinalized = computed(() => this.computeVisitFinalized());
    private readonly hasConnections = computed(() => {
        const visit = this.visit();
        return isNotNil(visit) && visit.id !== visit.connectionGroupId;
    });

    private readonly formModel = signal(this.getDefaultFormModel());
    protected readonly form = form(this.formModel, schema => {
        required(schema.status, {message: t('Form.Required')});
        required(schema.date, {message: t('Form.Required')});
        required(schema.timeFrom, {message: t('Form.Required')});
        required(schema.timeTo, {message: t('Form.Required')});
        required(schema.departmentId, {message: t('Form.Required')});
        required(schema.countedHours, {message: t('Form.Required')});
        min(schema.countedHours, 0, {message: t('Form.Min', {min: 0})});
        max(schema.countedHours, MAX_COUNTED_HOURS, {message: t('Form.Max', {max: MAX_COUNTED_HOURS})});
        required(schema.participantIds, {message: t('Form.Required')});
        validate(schema.vicariousMomVisit, ({valueOf, value}) => (
            (value() && valueOf(schema.participantIds).length !== 1)
                ? {kind: 'VicariousMomVisitError', message: t('Visit.Form.VicariousMomVisitError')}
                : null
        ));
        validate(schema.vicariousMomVisit, ({value}) => (
            (value() && this.hasConnections())
                ? {
                    kind: 'VicariousMomVisitConnectionError',
                    message: t('Visit.Form.VicariousMomVisitConnectionError')
                }
                : null
        ));

        disabled(schema.date, () => this.isDateChangeDisabled());
        disabled(schema.timeFrom, () => this.isTimeChangeDisabled());
        disabled(schema.timeTo, () => this.isTimeChangeDisabled());
        disabled(schema.departmentId, () => this.isDepartmentChangeDisabled());
        disabled(schema.countedHours, () => this.isTimeChangeDisabled());
        disabled(schema.participantIds, () => this.isParticipantChangeDisabled());
        disabled(schema.vicariousMomVisit, () => this.isVicariousMomChangeDisabled());
    });

    constructor() {
        effect(() => this.setupFormInput());
        effect(() => this.setCountedHours());
        this.initDepartmentOptions();
    }

    protected submitForm(): void {
        submit(this.form, async () => {
            const saved = await this.saveVisit();
            this.submitted.emit(saved);
        });
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getDefaultFormModel() {
        return {
            status: VisitStatuses.SCHEDULED as VisitStatus,
            date: null as Nullable<Date>,
            timeFrom: DEFAULT_TIME_FROM,
            timeTo: DEFAULT_TIME_TO,
            departmentId: null as Nullable<UUID>,
            countedHours: 0,
            participantIds: [] as Array<UUID>,
            vicariousMomVisit: false
        };
    }

    private setupFormInput(): void {
        const visit = this.visit();
        this.initStatusOptions();
        if (isNil(visit)) {
            this.formModel.set(this.getDefaultFormModel());
            return;
        }
        this.formModel.set({
            status: visit.status,
            date: new Date(visit.dateTimeFrom),
            timeFrom: this.getTime(visit.dateTimeFrom),
            timeTo: this.getTime(visit.dateTimeTo),
            departmentId: visit.department.id,
            countedHours: visit.countedMinutes ?? 0,
            participantIds: visit.participants.map(p => p.id),
            vicariousMomVisit: visit.vicariousMomVisit
        });
    }

    private setCountedHours(): void {
        const from = parseTime(this.form.timeFrom().value());
        const to = parseTime(this.form.timeTo().value());
        const diff = to.getTime() - from.getTime();
        const hourValue = diff / MS_ON_HOUR;
        this.form.countedHours().reset(round(hourValue, DECIMALS_IN_COUNTED_HOURS));
    }

    private initStatusOptions(): void {
        const visit = this.visit();
        if (isNil(visit)) {
            this.statusOptions.set([
                {value: VisitStatuses.DRAFT, disabled: false},
                {value: VisitStatuses.SCHEDULED, disabled: false}
            ]);
        } else {
            this.statusOptions.set(this.calculateStatusOptions(visit));
        }
    }

    private calculateStatusOptions(visit: Visit): Array<SelectOption<VisitStatus>> {
        if (this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return Object.values(VisitStatuses)
                .map(status => ({value: status, disabled: false}));
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return getStatusesCoordinatorChangeToFrom(visit.status);
        }
        return getStatusesVolunteerChangeToFrom(visit.status);
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe(
            (departmentPage: Pageable<Department>) => {
                this.departmentOptions.set(departmentPage.items);
            }
        );
    }

    private isDateChangeDisabled(): boolean {
        if (this.hasConnections()) {
            return true;
        }
        const visit = this.visit();
        if (isNil(visit) || this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return false;
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return !([VisitStatuses.DRAFT, VisitStatuses.SCHEDULED] as Array<VisitStatus>).includes(visit.status);
        }
        return true;
    }

    private isTimeChangeDisabled(): boolean {
        if (this.hasConnections()) {
            return true;
        }
        const visit = this.visit();
        if (isNil(visit) || this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return false;
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return this.isVisitFinalized();
        }
        return visit.status !== VisitStatuses.SCHEDULED && visit.status !== VisitStatuses.STARTED;
    }

    private isDepartmentChangeDisabled(): boolean {
        if (this.hasConnections()) {
            return true;
        }
        const visit = this.visit();
        if (isNil(visit) || this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return false;
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return this.isVisitFinalized();
        }
        return visit.status !== VisitStatuses.SCHEDULED;
    }

    private computeVisitFinalized(): boolean {
        const visit = this.visit();
        if (isNil(visit)) {
            return false;
        }
        return !([
            VisitStatuses.DRAFT,
            VisitStatuses.SCHEDULED,
            VisitStatuses.STARTED,
            VisitStatuses.ACTIVITIES_FILLED_OUT
        ] as Array<VisitStatus>).includes(visit.status);
    }

    private isParticipantChangeDisabled(): boolean {
        return this.isDepartmentChangeDisabled(); // Same rule applies
    }

    private isVicariousMomChangeDisabled(): boolean {
        if (isNil(this.visit()) || this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return false;
        }
        if (!this.permission.has(Permission.canModifyAnyVisit)) {
            return true;
        }
        return this.isVisitFinalized();
    }

    private getTime(dateTime: string): string {
        const dateTimeObj = new Date(dateTime);
        const hours = this.formatTimePart(dateTimeObj.getHours());
        const minutes = this.formatTimePart(dateTimeObj.getMinutes());
        return `${hours}:${minutes}`;
    }

    private formatTimePart(value: number): string {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return `${value}`.padStart(2, '0');
    }

    private saveVisit(): Promise<Visit> {
        return firstValueFrom(this.formSaveService.saveVisit(this.generateDto()));
    }

    private generateDto(): VisitCreate | VisitRewrite {
        const existing = this.visit();
        const formValue = this.form().value();
        const countedMinutesFromHour = formValue.countedHours * MIN_ON_HOUR;
        const obj = {
            departmentId: formValue.departmentId!,
            status: formValue.status,
            countedMinutes: round(countedMinutesFromHour),
            vicariousMomVisit: formValue.vicariousMomVisit,
            participantIds: formValue.participantIds,
            dateTimeFrom: parseTimeWithDate(formValue.timeFrom, formValue.date!).toISOString(),
            dateTimeTo: parseTimeWithDate(formValue.timeTo, formValue.date!).toISOString(),
        } satisfies VisitCreate

        if (isNil(existing)) {
            return obj;
        }
        return {...obj, id: existing.id};
    }

}
