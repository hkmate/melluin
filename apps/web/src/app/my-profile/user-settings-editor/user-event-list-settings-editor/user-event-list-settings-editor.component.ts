import {Component, computed, inject} from '@angular/core';
import {
    DateIntervalSpecifier,
    Department,
    EventsDateFilterValues,
    VisitStatus,
    Pageable,
    UserSettings
} from '@melluin/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {PersonSelectComponent} from '@fe/app/util/person-select/person-select.component';
import {MatCard, MatCardSubtitle} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/custom-user-settings-editor.base.component';

@Component({
    selector: 'app-user-event-list-settings-editor',
    templateUrl: './user-event-list-settings-editor.component.html',
    imports: [
        ReactiveFormsModule,
        MatLabel,
        MatFormField,
        MatSelect,
        TranslatePipe,
        MatOption,
        PersonSelectComponent,
        MatCard,
        MatCardSubtitle,
        MatCheckbox,
        MatButton
    ],
    styleUrls: ['./user-event-list-settings-editor.component.scss']
})
export class UserEventListSettingsEditorComponent extends CustomUserSettingsEditorBaseComponent {

    private readonly fb = inject(FormBuilder);
    private readonly departmentService = inject(DepartmentService);

    protected form = computed(() => this.initForm());
    protected statusOptions: Array<VisitStatus> = Object.values(VisitStatus);
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
