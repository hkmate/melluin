import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNil, parseTime, parseTimeWithDate} from '@shared/util/util';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Department} from '@shared/department/department';
import {Person} from '@shared/person/person';
import {Pageable} from '@shared/api-util/pageable';
import {EventVisibility} from '@shared/event/event-visibility';
import {User} from '@shared/user/user';
import {Store} from '@ngrx/store';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import * as _ from 'lodash';
import {Platform} from '@angular/cdk/platform';

@Component({
    selector: 'app-hospital-visit-form',
    templateUrl: './hospital-visit-form.component.html',
    styleUrls: ['./hospital-visit-form.component.scss']
})
export class HospitalVisitFormComponent extends AutoUnSubscriber implements OnInit {

    private static readonly MS_ON_HOUR = 3600000; // 1000 * 60 * 60
    private static readonly MIN_ON_HOUR = 60;
    private static readonly MAX_COUNTED_HOURS = 24;
    private static readonly DECIMALS_IN_COUNTED_HOURS = 2;
    private static readonly defaultTimeFrom = '16:00';
    private static readonly defaultTimeTo = '18:00';

    @Input()
    public createNewAfterSave: boolean;

    @Output()
    public createNewAfterSaveChange = new EventEmitter<boolean>;

    @Output()
    public submitted = new EventEmitter<HospitalVisitCreate | HospitalVisitRewrite>;

    @Output()
    public canceled = new EventEmitter<void>;

    protected statusOptions: Array<HospitalVisitStatus>;
    protected departmentOptions: Array<Department>;
    protected personOptions: Array<Person>;
    protected form: FormGroup;
    protected visitToEdit?: HospitalVisit;
    protected mobileScreen: boolean;

    private currentUser: User;

    constructor(private readonly fb: FormBuilder,
                private readonly platform: Platform,
                private readonly store: Store,
                private readonly departmentService: DepartmentService) {
        super();
    }

    @Input()
    public set visit(visit: HospitalVisit | undefined) {
        this.visitToEdit = visit;
        this.initForm();
    }

    public get visit(): HospitalVisit | undefined {
        return this.visitToEdit;
    }

    public ngOnInit(): void {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        this.initCurrentUser();
    }

    protected onSubmit(): void {
        if (this.form.valid) {
            this.submitted.emit(this.createDataForSubmit());
        }
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    protected setCountedHours(): void {
        const from = parseTime(this.form.controls.timeFrom.value);
        const to = parseTime(this.form.controls.timeTo.value);
        const diff = to.getTime() - from.getTime();
        const hourValue = diff / HospitalVisitFormComponent.MS_ON_HOUR;
        this.form.controls.countedHours.setValue(_.round(hourValue, HospitalVisitFormComponent.DECIMALS_IN_COUNTED_HOURS));
    }

    protected setCreateOther(newValue: boolean): void {
        this.createNewAfterSave = newValue;
        this.createNewAfterSaveChange.emit(newValue);
    }

    private initForm(): void {
        this.buildFormGroup();
        this.initStatusOptions();
        this.initDepartmentOptions();
        this.initCountedHours();
    }

    private buildFormGroup(): void {
        this.form = this.fb.group({
            status: [this.visitToEdit?.status ?? HospitalVisitStatus.SCHEDULED, [Validators.required]],
            date: [this.getDate(this.visitToEdit?.dateTimeFrom), [Validators.required]],
            timeFrom: [this.getTime(this.visitToEdit?.dateTimeFrom, HospitalVisitFormComponent.defaultTimeFrom),
                [Validators.required]],
            timeTo: [this.getTime(this.visitToEdit?.dateTimeTo, HospitalVisitFormComponent.defaultTimeTo),
                [Validators.required]],
            departmentId: [this.visitToEdit?.department?.id, [Validators.required]],
            countedHours: [0, [Validators.max(HospitalVisitFormComponent.MAX_COUNTED_HOURS), Validators.min(0)]],
            participantIds: [this.visitToEdit?.participants.map(p => p.id), [Validators.required]],
        });
    }

    private initCurrentUser(): void {
        this.addSubscription(this.store.pipe(selectCurrentUser), cu => {
                this.currentUser = cu;
            }
        );
    }

    private initStatusOptions(): void {
        this.statusOptions = isNil(this.visitToEdit)
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
        if (isNil(this.visitToEdit?.countedMinutes)) {
            this.setCountedHours();
            return;
        }
        this.form.controls.countedHours.setValue(this!.visitToEdit!.countedMinutes / HospitalVisitFormComponent.MIN_ON_HOUR);
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
        if (isNil(this.visitToEdit)) {
            return this.createCreation();
        }
        return this.createRewrite();
    }

    private createCreation(): HospitalVisitCreate {
        const data = new HospitalVisitCreate();
        data.departmentId = this.form.controls.departmentId.value;
        data.status = this.form.controls.status.value;
        data.countedMinutes = this.form.controls.countedHours.value * HospitalVisitFormComponent.MIN_ON_HOUR;
        data.organizerId = this.currentUser.personId;
        data.visibility = EventVisibility.PUBLIC;
        data.participantIds = this.form.controls.participantIds.value;
        data.dateTimeFrom = parseTimeWithDate(this.form.controls.timeFrom.value, this.form.controls.date.value).toISOString();
        data.dateTimeTo = parseTimeWithDate(this.form.controls.timeTo.value, this.form.controls.date.value).toISOString();

        return data;
    }

    private createRewrite(): HospitalVisitRewrite {
        const data = new HospitalVisitRewrite();
        data.id = this.visitToEdit!.id;
        data.departmentId = this.form.controls.departmentId.value;
        data.status = this.form.controls.status.value;
        data.countedMinutes = this.form.controls.countedHours.value * HospitalVisitFormComponent.MIN_ON_HOUR;
        data.visibility = EventVisibility.PUBLIC;
        data.participantIds = this.form.controls.participantIds.value;
        data.dateTimeFrom = parseTimeWithDate(this.form.controls.timeFrom.value, this.form.controls.date.value).toISOString();
        data.dateTimeTo = parseTimeWithDate(this.form.controls.timeTo.value, this.form.controls.date.value).toISOString();
        return data;
    }

    private formatTimePart(value: number): string {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return `${value}`.padStart(2, '0');
    }

}
