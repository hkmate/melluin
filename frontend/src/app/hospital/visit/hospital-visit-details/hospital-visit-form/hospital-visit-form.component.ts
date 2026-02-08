import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isNil, isNotNil, parseTime, parseTimeWithDate} from '@shared/util/util';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Department} from '@shared/department/department';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {Store} from '@ngrx/store';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import * as _ from 'lodash';
import {Platform} from '@angular/cdk/platform';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {getAllStatusOptionsOnlyEnable, SelectOption} from '@fe/app/util/hospital-visit-status-option';
import {EventVisibility} from '@shared/hospital-visit/event-visibility';


// TODO refactor: Form components should be refactored to new forms when updated Angular to 21
@Component({
    selector: 'app-hospital-visit-form',
    templateUrl: './hospital-visit-form.component.html',
    styleUrls: ['./hospital-visit-form.component.scss']
})
export class HospitalVisitFormComponent {

    private static readonly MS_ON_HOUR = 3600000; // 1000 * 60 * 60
    private static readonly MIN_ON_HOUR = 60;
    private static readonly MAX_COUNTED_HOURS = 24;
    private static readonly DECIMALS_IN_COUNTED_HOURS = 2;
    private static readonly defaultTimeFrom = '16:00';
    private static readonly defaultTimeTo = '18:00';

    private readonly platform = inject(Platform);
    private readonly store = inject(Store);
    private readonly permission = inject(PermissionService);
    private readonly departmentService = inject(DepartmentService);

    public readonly createNewAfterSave = input.required<boolean>();
    public readonly visit = input<HospitalVisit>();

    public readonly createNewAfterSaveChange = output<boolean>();
    public readonly submitted = output<HospitalVisitCreate | HospitalVisitRewrite>();
    public readonly canceled = output<void>();

    protected readonly createNewAfterOneSaved = signal(false);
    protected statusOptions: Array<SelectOption<HospitalVisitStatus>>;
    protected departmentOptions: Array<Department>;
    protected readonly form = computed(() => this.buildFormGroup());
    protected mobileScreen: boolean;
    private readonly hasConnections = computed(() => {
        const visit = this.visit();
        return isNotNil(visit) && visit.id !== visit.connectionGroupId;
    });

    private currentUser: User;

    constructor() {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        this.initCurrentUser();
        // TODO: change it to linkedSignal after upgraded to angular 19+
        effect(() => this.createNewAfterOneSaved.set(this.createNewAfterSave()), {allowSignalWrites: true});
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
        const hourValue = diff / HospitalVisitFormComponent.MS_ON_HOUR;
        this.form().controls.countedHours.setValue(_.round(hourValue, HospitalVisitFormComponent.DECIMALS_IN_COUNTED_HOURS));
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
            status: new FormControl(visit?.status ?? HospitalVisitStatus.SCHEDULED, [Validators.required]),
            date: new FormControl({
                value: this.getDate(visit?.dateTimeFrom),
                disabled: this.isDateChangeDisabled() || hasConnection
            }, [Validators.required]),
            timeFrom: new FormControl({
                value: this.getTime(visit?.dateTimeFrom, HospitalVisitFormComponent.defaultTimeFrom),
                disabled: timeChangeDisabled || hasConnection
            }, [Validators.required]),
            timeTo: new FormControl({
                value: this.getTime(visit?.dateTimeTo, HospitalVisitFormComponent.defaultTimeTo),
                disabled: timeChangeDisabled || hasConnection
            }, [Validators.required]),
            departmentId: new FormControl({
                value: visit?.department?.id,
                disabled: this.isDepartmentChangeDisabled() || hasConnection
            }, [Validators.required]),
            countedHours: new FormControl({
                value: 0,
                disabled: timeChangeDisabled || hasConnection
            }, [Validators.max(HospitalVisitFormComponent.MAX_COUNTED_HOURS), Validators.min(0)]),
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

    private initCurrentUser(): void {
        this.store.pipe(selectCurrentUser, takeUntilDestroyed()).subscribe(cu => {
                this.currentUser = cu;
            }
        );
    }

    private initStatusOptions(): void {
        const visit = this.visit();
        if (isNil(visit)) {
            this.statusOptions = [
                {value: HospitalVisitStatus.DRAFT, disabled: false},
                {value: HospitalVisitStatus.SCHEDULED, disabled: false}
            ];
        } else {
            this.statusOptions = this.calculateStatusOptions(visit);
        }
    }

    private calculateStatusOptions(visit: HospitalVisit): Array<SelectOption<HospitalVisitStatus>> {
        if (this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return Object.values(HospitalVisitStatus)
                .map(status => ({value: status, disabled: false}));
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return this.getStatusesCoordinatorChangeToFrom(visit.status);
        }
        return this.getStatusesVolunteerChangeToFrom(visit.status);
    }

    // eslint-disable-next-line max-lines-per-function
    private getStatusesCoordinatorChangeToFrom(currentStatus: HospitalVisitStatus): Array<SelectOption<HospitalVisitStatus>> {
        switch (currentStatus) {
            case HospitalVisitStatus.DRAFT:
                return getAllStatusOptionsOnlyEnable(HospitalVisitStatus.DRAFT, HospitalVisitStatus.SCHEDULED);
            case HospitalVisitStatus.SCHEDULED:
                return getAllStatusOptionsOnlyEnable(
                    HospitalVisitStatus.SCHEDULED,
                    HospitalVisitStatus.STARTED,
                    HospitalVisitStatus.CANCELED,
                    HospitalVisitStatus.FAILED_FOR_OTHER_REASON,
                    HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD
                );
            case HospitalVisitStatus.STARTED:
                return getAllStatusOptionsOnlyEnable(
                    HospitalVisitStatus.STARTED,
                    HospitalVisitStatus.ACTIVITIES_FILLED_OUT,
                    HospitalVisitStatus.CANCELED,
                    HospitalVisitStatus.FAILED_FOR_OTHER_REASON,
                    HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD
                );
            case HospitalVisitStatus.ACTIVITIES_FILLED_OUT:
                return getAllStatusOptionsOnlyEnable(HospitalVisitStatus.STARTED,
                    HospitalVisitStatus.ACTIVITIES_FILLED_OUT, HospitalVisitStatus.ALL_FILLED_OUT);
            default:
                return getAllStatusOptionsOnlyEnable(currentStatus);
        }
    }

    // eslint-disable-next-line max-lines-per-function
    private getStatusesVolunteerChangeToFrom(currentStatus: HospitalVisitStatus): Array<SelectOption<HospitalVisitStatus>> {
        switch (currentStatus) {
            case HospitalVisitStatus.SCHEDULED:
                return getAllStatusOptionsOnlyEnable(
                    HospitalVisitStatus.SCHEDULED,
                    HospitalVisitStatus.STARTED,
                    HospitalVisitStatus.CANCELED,
                    HospitalVisitStatus.FAILED_FOR_OTHER_REASON,
                    HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD
                );
            case HospitalVisitStatus.STARTED:
                return getAllStatusOptionsOnlyEnable(
                    HospitalVisitStatus.STARTED,
                    HospitalVisitStatus.ACTIVITIES_FILLED_OUT,
                    HospitalVisitStatus.CANCELED,
                    HospitalVisitStatus.FAILED_FOR_OTHER_REASON,
                    HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD
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
            return ![HospitalVisitStatus.DRAFT, HospitalVisitStatus.SCHEDULED].includes(this.visit()!.status);
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
        return visit.status !== HospitalVisitStatus.SCHEDULED && visit.status !== HospitalVisitStatus.STARTED;
    }

    private isDepartmentChangeDisabled(): boolean {
        if (isNil(this.visit()) || this.permission.has(Permission.canModifyAnyVisitUnrestricted)) {
            return false;
        }
        if (this.permission.has(Permission.canModifyAnyVisit)) {
            return this.isVisitFinalized();
        }
        return this.visit()!.status !== HospitalVisitStatus.SCHEDULED;
    }

    private isVisitFinalized(): boolean {
        if (isNil(this.visit())) {
            return false;
        }
        return ![
            HospitalVisitStatus.DRAFT,
            HospitalVisitStatus.SCHEDULED,
            HospitalVisitStatus.STARTED,
            HospitalVisitStatus.ACTIVITIES_FILLED_OUT
        ].includes(this.visit()!.status);
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
        const hourValue = countedMinutes / HospitalVisitFormComponent.MIN_ON_HOUR;
        this.form().controls.countedHours.setValue(_.round(hourValue, HospitalVisitFormComponent.DECIMALS_IN_COUNTED_HOURS));
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

    private createDataForSubmit(): HospitalVisitCreate | HospitalVisitRewrite {
        if (isNil(this.visit())) {
            return this.createCreation();
        }
        return this.createRewrite();
    }

    private createCreation(): HospitalVisitCreate {
        const data = {} as HospitalVisitCreate;
        const countedMinutesFromHour =this.form().controls.countedHours.value * HospitalVisitFormComponent.MIN_ON_HOUR;
        data.departmentId = this.form().controls.departmentId.value;
        data.status = this.form().controls.status.value;
        data.countedMinutes = _.round(countedMinutesFromHour);
        data.organizerId = this.currentUser.personId;
        data.visibility = EventVisibility.PUBLIC;
        data.vicariousMomVisit = this.form().controls.vicariousMomVisit.value;
        data.participantIds = this.form().controls.participantIds.value;
        data.dateTimeFrom = parseTimeWithDate(this.form().controls.timeFrom.value, this.form().controls.date.value).toISOString();
        data.dateTimeTo = parseTimeWithDate(this.form().controls.timeTo.value, this.form().controls.date.value).toISOString();

        return data;
    }

    private createRewrite(): HospitalVisitRewrite {
        const data = {} as HospitalVisitRewrite;
        const countedMinutesFromHour =this.form().controls.countedHours.value * HospitalVisitFormComponent.MIN_ON_HOUR;
        data.id = this.visit()!.id;
        data.departmentId = this.form().controls.departmentId.value;
        data.status = this.form().controls.status.value;
        data.countedMinutes = _.round(countedMinutesFromHour);
        data.visibility = EventVisibility.PUBLIC;
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
