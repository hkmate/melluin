import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNil, parseTime, parseTimeWithDate} from '@shared/util/util';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Department} from '@shared/department/department';
import {Pageable} from '@shared/api-util/pageable';
import {EventVisibility} from '@shared/event/event-visibility';
import {User} from '@shared/user/user';
import {Store} from '@ngrx/store';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import * as _ from 'lodash';
import {Platform} from '@angular/cdk/platform';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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

    private readonly fb = inject(FormBuilder);
    private readonly platform = inject(Platform);
    private readonly store = inject(Store);
    private readonly departmentService = inject(DepartmentService);

    public readonly createNewAfterSave = input.required<boolean>();
    public readonly visit = input<HospitalVisit>();

    public createNewAfterSaveChange = output<boolean>();
    public submitted = output<HospitalVisitCreate | HospitalVisitRewrite>();
    public canceled = output<void>();

    protected createNewAfterOneSaved = signal(false);
    protected statusOptions: Array<HospitalVisitStatus>;
    protected departmentOptions: Array<Department>;
    protected readonly form = computed(() => this.buildFormGroup());
    protected mobileScreen: boolean;

    private currentUser: User;

    constructor() {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        this.initCurrentUser();
        // TODO: change it to linkedSignal after upgraded to angular 19+
        effect(() => this.createNewAfterOneSaved.set(this.createNewAfterSave()), {allowSignalWrites: true});
        effect(() => this.initFormOptions());
    }

    protected onSubmit(): void {
        if (this.form().valid && !this.needVicariousMomVisitWarning()) {
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

    protected needVicariousMomVisitWarning(): boolean {
        const vicariousMomVisit = this.form().controls.vicariousMomVisit.value as boolean;
        const participantCount = this.form().controls.participantIds.value?.length ?? 0;
        return vicariousMomVisit && participantCount !== 1;
    }

    private initFormOptions(): void {
        this.initStatusOptions();
        this.initDepartmentOptions();
        this.initCountedHours();
    }

    private buildFormGroup(): FormGroup {
        return this.fb.group({
            status: [this.visit()?.status ?? HospitalVisitStatus.SCHEDULED, [Validators.required]],
            date: [this.getDate(this.visit()?.dateTimeFrom), [Validators.required]],
            timeFrom: [this.getTime(this.visit()?.dateTimeFrom, HospitalVisitFormComponent.defaultTimeFrom),
                [Validators.required]],
            timeTo: [this.getTime(this.visit()?.dateTimeTo, HospitalVisitFormComponent.defaultTimeTo),
                [Validators.required]],
            departmentId: [this.visit()?.department?.id, [Validators.required]],
            countedHours: [0, [Validators.max(HospitalVisitFormComponent.MAX_COUNTED_HOURS), Validators.min(0)]],
            participantIds: [this.visit()?.participants.map(p => p.id), [Validators.required]],
            vicariousMomVisit: [this.visit()?.vicariousMomVisit ?? false],
        });
    }

    private initCurrentUser(): void {
        this.store.pipe(selectCurrentUser, takeUntilDestroyed()).subscribe(cu => {
                this.currentUser = cu;
            }
        );
    }

    private initStatusOptions(): void {
        this.statusOptions = isNil(this.visit())
            ? [HospitalVisitStatus.DRAFT, HospitalVisitStatus.SCHEDULED]
            : Object.values(HospitalVisitStatus);
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe(
            (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        );
    }

    private initCountedHours(): void {
        const countedMinutes = this.visit()?.countedMinutes
        if (isNil(countedMinutes)) {
            this.setCountedHours();
            return;
        }
        this.form().controls.countedHours.setValue(countedMinutes / HospitalVisitFormComponent.MIN_ON_HOUR);
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
        const data = new HospitalVisitCreate();
        data.departmentId = this.form().controls.departmentId.value;
        data.status = this.form().controls.status.value;
        data.countedMinutes = this.form().controls.countedHours.value * HospitalVisitFormComponent.MIN_ON_HOUR;
        data.organizerId = this.currentUser.personId;
        data.visibility = EventVisibility.PUBLIC;
        data.vicariousMomVisit = this.form().controls.vicariousMomVisit.value;
        data.participantIds = this.form().controls.participantIds.value;
        data.dateTimeFrom = parseTimeWithDate(this.form().controls.timeFrom.value, this.form().controls.date.value).toISOString();
        data.dateTimeTo = parseTimeWithDate(this.form().controls.timeTo.value, this.form().controls.date.value).toISOString();

        return data;
    }

    private createRewrite(): HospitalVisitRewrite {
        const data = new HospitalVisitRewrite();
        data.id = this.visit()!.id;
        data.departmentId = this.form().controls.departmentId.value;
        data.status = this.form().controls.status.value;
        data.countedMinutes = this.form().controls.countedHours.value * HospitalVisitFormComponent.MIN_ON_HOUR;
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
