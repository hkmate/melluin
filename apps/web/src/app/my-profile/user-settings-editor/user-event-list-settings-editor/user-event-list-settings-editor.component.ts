import {Component, computed, inject} from '@angular/core';
import {EventsDateFilterValues, UserSettings} from '@shared/user/user-settings';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {Department} from '@shared/department/department';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Pageable} from '@shared/api-util/pageable';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/user-settings-editor.component';
import {DateIntervalSpecifier} from '@shared/util/date-interval-generator';

@Component({
    selector: 'app-user-event-list-settings-editor',
    templateUrl: './user-event-list-settings-editor.component.html',
    styleUrls: ['./user-event-list-settings-editor.component.scss']
})
export class UserEventListSettingsEditorComponent extends CustomUserSettingsEditorBaseComponent {

    private readonly fb = inject(FormBuilder);
    private readonly departmentService = inject(DepartmentService);

    protected form = computed(() => this.initForm());
    protected statusOptions: Array<HospitalVisitStatus> = Object.values(HospitalVisitStatus);
    protected departmentOptions: Array<Department>;
    protected dateOptions: Array<DateIntervalSpecifier> = EventsDateFilterValues;

    constructor() {
        super();
        this.initDepartmentOptions();
    }

    protected override isSaveBtnDisabled(): boolean {
        return this.form().invalid || super.isSaveBtnDisabled();
    }

    protected override generateNewSettings(): UserSettings {
        return {
            ...this.settings(),
            eventList: {
                dateFilter: this.form().controls.dateFilter.value,
                statuses: this.form().controls.statuses.value,
                departmentIds: this.form().controls.departmentIds.value,
                participantIds: this.form().controls.participantIds.value,
                needHighlight: this.form().controls.needHighlight.value,
            }
        }
    }

    private initForm(): FormGroup {
        const eventList = this.settings().eventList;
        return this.fb.group({
            dateFilter: [eventList?.dateFilter],
            participantIds: [eventList?.participantIds],
            statuses: [eventList?.statuses],
            departmentIds: [eventList?.departmentIds],
            needHighlight: [eventList?.needHighlight],
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
