import {Component, computed, effect, inject, input, linkedSignal, output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    Department,
    isNil,
    isNotNil,
    Pageable,
    parseTime,
    parseTimeWithDate,
    Permission,
    Visit,
    VisitCreate,
    VisitRewrite,
    VisitStatus,
    VisitStatuses
} from '@melluin/common';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Platform} from '@angular/cdk/platform';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {getAllStatusOptionsOnlyEnable, SelectOption} from '@fe/app/util/visit-status-option';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {PersonSelectComponent} from '@fe/app/util/person-select/person-select.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';
import {round} from 'lodash-es';


// TODO refactor: Form components should be refactored to new forms when updated Angular to 21
@Component({
    imports: [
        TranslatePipe,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        PersonSelectComponent,
        MatInput,
        MatDatepickerToggle,
        MatDatepicker,
        MatDatepickerInput,
        MatCardContent,
        MatCard,
        MatCheckbox,
        FormsModule,
        MatButton
    ],
    selector: 'app-visit-form',
    templateUrl: './visit-form.component.html',
    styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent {

    private static readonly MS_ON_HOUR = 3600000; // 1000 * 60 * 60
    private static readonly MIN_ON_HOUR = 60;
    private static readonly MAX_COUNTED_HOURS = 24;
    private static readonly DECIMALS_IN_COUNTED_HOURS = 2;
    private static readonly defaultTimeFrom = '16:00';
    private static readonly defaultTimeTo = '18:00';

    private readonly platform = inject(Platform);
    private readonly permission = inject(PermissionService);
    private readonly departmentService = inject(DepartmentService);

    public readonly createNewAfterSave = input.required<boolean>();
    public readonly visit = input<Visit>();

    public readonly createNewAfterSaveChange = output<boolean>();
    public readonly submitted = output<VisitCreate | VisitRewrite>();
    public readonly canceled = output<void>();

    protected readonly createNewAfterOneSaved = linkedSignal(() => this.createNewAfterSave());
    protected statusOptions: Array<SelectOption<VisitStatus>>;
    protected departmentOptions: Array<Department>;
    protected readonly form = computed(() => this.buildFormGroup());
    protected mobileScreen: boolean;
    private readonly hasConnections = computed(() => {
        const visit = this.visit();
        return isNotNil(visit) && visit.id !== visit.connectionGroupId;
    });

    private readonly currentUser = inject(CurrentUserService).currentUser;

    constructor() {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        effect(() => this.initFormOptions());
    }

    protected onSubmit(): void {
        if (this.form().valid
            && !this.needVicariousMomVisitParticipantWarning()
            && !this.needVicariousMomVisitConnectionWarning()) {
            this.submitted.emit(this.createDataForSubmit());
        }
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    protected setCountedHours(): void {
        const from = parseTime(this.form().controls.timeFrom.value);
        const to = parseTime(this.form().controls.timeTo.value);
        const diff = to.getTime() - from.getTime();
        const hourValue = diff / VisitFormComponent.MS_ON_HOUR;
        this.form().controls.countedHours.setValue(round(hourValue, VisitFormComponent.DECIMALS_IN_COUNTED_HOURS));
    }

    protected setCreateOther(newValue: boolean): void {
        this.createNewAfterOneSaved.set(newValue);
        this.createNewAfterSaveChange.emit(newValue);
    }

    protected needVicariousMomVisitParticipantWarning(): boolean {
        const vicariousMomVisit = this.form().controls.vicariousMomVisit.value as boolean;
        const participantCount = this.form().controls.participantIds.value?.length ?? 0;
        return vicariousMomVisit && participantCount !== 1;
    }

    protected needVicariousMomVisitConnectionWarning(): boolean {
        const vicariousMomVisit = this.form().controls.vicariousMomVisit.value as boolean;
        return vicariousMomVisit && this.hasConnections();
    }

    private initFormOptions(): void {
        this.initStatusOptions();
        this.initDepartmentOptions();
        this.initCountedHours();
    }

    // eslint-disable-next-line max-lines-per-function
    private buildFormGroup(): FormGroup {
        const visit = this.visit();
        const timeChangeDisabled = this.isTimeChangeDisabled();
        const hasConnection = this.hasConnections();
        return new FormGroup({
            status: new FormControl(visit?.status ?? VisitStatuses.SCHEDULED, [Validators.required]),
            date: new FormControl({
                value: this.getDate(visit?.dateTimeFrom),
                disabled: this.isDateChangeDisabled() || hasConnection
            }, [Validators.required]),
            timeFrom: new FormControl({
                value: this.getTime(visit?.dateTimeFrom, VisitFormComponent.defaultTimeFrom),
                disabled: timeChangeDisabled || hasConnection
            }, [Validators.required]),
            timeTo: new FormControl({
                value: this.getTime(visit?.dateTimeTo, VisitFormComponent.defaultTimeTo),
                disabled: timeChangeDisabled || hasConnection
            }, [Validators.required]),
            departmentId: new FormControl({
                value: visit?.department?.id,
                disabled: this.isDepartmentChangeDisabled() || hasConnection
            }, [Validators.required]),
            countedHours: new FormControl({
                value: 0,
                disabled: timeChangeDisabled || hasConnection
            }, [Validators.max(VisitFormComponent.MAX_COUNTED_HOURS), Validators.min(0)]),
            participantIds: new FormControl({
                value: visit?.participants.map(p => p.id),
                disabled: this.isParticipantChangeDisabled() || hasConnection
            }, [Validators.required]),
            vicariousMomVisit: new FormControl({
                value: visit?.vicariousMomVisit ?? false,
                disabled: this.isVicariousMomChangeDisabled()
            })
        });
    }

    private initStatusOptions(): void {
        const visit = this.visit();
        if (isNil(visit)) {
            this.statusOptions = [
                {value: VisitStatuses.DRAFT, disabled: false},
                {value: VisitStatuses.SCHEDULED, disabled: false}
            ];
        } else {
            this.statusOptions = this.calculateStatusOptions(visit);
        }
    }

    private calculateStatusOptions(visit: Visit): Array<SelectOption<VisitStatus>> {
        if (this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return Object.values(VisitStatuses)
                .map(status => ({value: status, disabled: false}));
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return this.getStatusesCoordinatorChangeToFrom(visit.status);
        }
        return this.getStatusesVolunteerChangeToFrom(visit.status);
    }

    // eslint-disable-next-line max-lines-per-function
    private getStatusesCoordinatorChangeToFrom(currentStatus: VisitStatus): Array<SelectOption<VisitStatus>> {
        switch (currentStatus) {
            case VisitStatuses.DRAFT:
                return getAllStatusOptionsOnlyEnable(VisitStatuses.DRAFT, VisitStatuses.SCHEDULED);
            case VisitStatuses.SCHEDULED:
                return getAllStatusOptionsOnlyEnable(
                    VisitStatuses.SCHEDULED,
                    VisitStatuses.STARTED,
                    VisitStatuses.CANCELED,
                    VisitStatuses.FAILED_FOR_OTHER_REASON,
                    VisitStatuses.FAILED_BECAUSE_NO_CHILD
                );
            case VisitStatuses.STARTED:
                return getAllStatusOptionsOnlyEnable(
                    VisitStatuses.STARTED,
                    VisitStatuses.ACTIVITIES_FILLED_OUT,
                    VisitStatuses.CANCELED,
                    VisitStatuses.FAILED_FOR_OTHER_REASON,
                    VisitStatuses.FAILED_BECAUSE_NO_CHILD
                );
            case VisitStatuses.ACTIVITIES_FILLED_OUT:
                return getAllStatusOptionsOnlyEnable(VisitStatuses.STARTED,
                    VisitStatuses.ACTIVITIES_FILLED_OUT, VisitStatuses.ALL_FILLED_OUT);
            default:
                return getAllStatusOptionsOnlyEnable(currentStatus);
        }
    }

    // eslint-disable-next-line max-lines-per-function
    private getStatusesVolunteerChangeToFrom(currentStatus: VisitStatus): Array<SelectOption<VisitStatus>> {
        switch (currentStatus) {
            case VisitStatuses.SCHEDULED:
                return getAllStatusOptionsOnlyEnable(
                    VisitStatuses.SCHEDULED,
                    VisitStatuses.STARTED,
                    VisitStatuses.CANCELED,
                    VisitStatuses.FAILED_FOR_OTHER_REASON,
                    VisitStatuses.FAILED_BECAUSE_NO_CHILD
                );
            case VisitStatuses.STARTED:
                return getAllStatusOptionsOnlyEnable(
                    VisitStatuses.STARTED,
                    VisitStatuses.ACTIVITIES_FILLED_OUT,
                    VisitStatuses.CANCELED,
                    VisitStatuses.FAILED_FOR_OTHER_REASON,
                    VisitStatuses.FAILED_BECAUSE_NO_CHILD
                );
            default:
                return getAllStatusOptionsOnlyEnable(currentStatus);
        }
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe(
            (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        );
    }

    private isDateChangeDisabled(): boolean {
        if (isNil(this.visit()) || this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return false;
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return !([VisitStatuses.DRAFT, VisitStatuses.SCHEDULED] as Array<VisitStatus>).includes(this.visit()!.status);
        }
        return true;
    }

    private isTimeChangeDisabled(): boolean {
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
        if (isNil(this.visit()) || this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return false;
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return this.isVisitFinalized();
        }
        return this.visit()!.status !== VisitStatuses.SCHEDULED;
    }

    private isVisitFinalized(): boolean {
        if (isNil(this.visit())) {
            return false;
        }
        return !([
            VisitStatuses.DRAFT,
            VisitStatuses.SCHEDULED,
            VisitStatuses.STARTED,
            VisitStatuses.ACTIVITIES_FILLED_OUT
        ] as Array<VisitStatus>).includes(this.visit()!.status);
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

    private initCountedHours(): void {
        const countedMinutes = this.visit()?.countedMinutes
        if (isNil(countedMinutes)) {
            this.setCountedHours();
            return;
        }
        const hourValue = countedMinutes / VisitFormComponent.MIN_ON_HOUR;
        this.form().controls.countedHours.setValue(round(hourValue, VisitFormComponent.DECIMALS_IN_COUNTED_HOURS));
    }

    private getDate(dateTime: string | undefined): Date | undefined {
        if (isNil(dateTime)) {
            return undefined;
        }
        return new Date(dateTime);
    }

    private getTime(dateTime: string | undefined, defaultValue: string): string {
        if (isNil(dateTime)) {
            return defaultValue;
        }
        const dateTimeObj = new Date(dateTime);
        const hours = this.formatTimePart(dateTimeObj.getHours());
        const minutes = this.formatTimePart(dateTimeObj.getMinutes());
        return `${hours}:${minutes}`;
    }

    private createDataForSubmit(): VisitCreate | VisitRewrite {
        if (isNil(this.visit())) {
            return this.createCreation();
        }
        return this.createRewrite();
    }

    private createCreation(): VisitCreate {
        const data = {} as VisitCreate;
        const countedMinutesFromHour = this.form().controls.countedHours.value * VisitFormComponent.MIN_ON_HOUR;
        data.departmentId = this.form().controls.departmentId.value;
        data.status = this.form().controls.status.value;
        data.countedMinutes = round(countedMinutesFromHour);
        data.organizerId = this.currentUser()!.personId;
        data.vicariousMomVisit = this.form().controls.vicariousMomVisit.value;
        data.participantIds = this.form().controls.participantIds.value;
        data.dateTimeFrom = parseTimeWithDate(this.form().controls.timeFrom.value, this.form().controls.date.value).toISOString();
        data.dateTimeTo = parseTimeWithDate(this.form().controls.timeTo.value, this.form().controls.date.value).toISOString();

        return data;
    }

    private createRewrite(): VisitRewrite {
        const data = {} as VisitRewrite;
        const countedMinutesFromHour = this.form().controls.countedHours.value * VisitFormComponent.MIN_ON_HOUR;
        data.id = this.visit()!.id;
        data.departmentId = this.form().controls.departmentId.value;
        data.status = this.form().controls.status.value;
        data.countedMinutes = round(countedMinutesFromHour);
        data.vicariousMomVisit = this.form().controls.vicariousMomVisit.value;
        data.participantIds = this.form().controls.participantIds.value;
        data.dateTimeFrom = parseTimeWithDate(this.form().controls.timeFrom.value, this.form().controls.date.value).toISOString();
        data.dateTimeTo = parseTimeWithDate(this.form().controls.timeTo.value, this.form().controls.date.value).toISOString();
        return data;
    }

    private formatTimePart(value: number): string {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return `${value}`.padStart(2, '0');
    }

}
