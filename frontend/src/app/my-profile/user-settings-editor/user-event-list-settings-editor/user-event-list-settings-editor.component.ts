import {Component} from '@angular/core';
import {EventsDateFilterValues, UserSettings} from '@shared/user/user-settings';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {Department} from '@shared/department/department';
import {Store} from '@ngrx/store';
import {MessageService} from '@fe/app/util/message.service';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {UserService} from '@fe/app/people/user.service';
import {Pageable} from '@shared/api-util/pageable';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/user-settings-editor.component';
import {DateIntervalSpecifier} from '@shared/util/date-interval-generator';

@Component({
    selector: 'app-user-event-list-settings-editor',
    templateUrl: './user-event-list-settings-editor.component.html',
    styleUrls: ['./user-event-list-settings-editor.component.scss']
})
export class UserEventListSettingsEditorComponent extends CustomUserSettingsEditorBaseComponent {

    protected form: FormGroup;
    protected statusOptions: Array<HospitalVisitStatus> = Object.values(HospitalVisitStatus);
    protected departmentOptions: Array<Department>;
    protected dateOptions: Array<DateIntervalSpecifier> = EventsDateFilterValues;

    constructor(store: Store,
                msg: MessageService,
                userService: UserService,
                private readonly fb: FormBuilder,
                private readonly departmentService: DepartmentService) {
        super(store, msg, userService);
    }

    public ngOnInit(): void {
        this.initForm();
        this.initDepartmentOptions();
    }

    protected override isSaveBtnDisabled(): boolean {
        return this.form.invalid || super.isSaveBtnDisabled();
    }

    protected override generateNewSettings(): UserSettings {
        return {
            ...this.settings,
            eventList: {
                dateFilter: this.form.controls.dateFilter.value,
                statuses: this.form.controls.statuses.value,
                departmentIds: this.form.controls.departmentIds.value,
                participantIds: this.form.controls.participantIds.value,
                needHighlight: this.form.controls.needHighlight.value,
            }
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            dateFilter: [this.settings.eventList?.dateFilter],
            participantIds: [this.settings.eventList?.participantIds],
            statuses: [this.settings.eventList?.statuses],
            departmentIds: [this.settings.eventList?.departmentIds],
            needHighlight: [this.settings.eventList?.needHighlight],
        });
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe(
            (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        );
    }

}
