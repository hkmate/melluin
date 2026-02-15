import {Component, computed, inject} from '@angular/core';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/user-settings-editor.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
    BoxStatusChangeReason,
    DateIntervalSpecifier,
    DepartmentBoxInfoSinceDateValues,
    DepartmentBoxWidgetSettings,
    isNotEmpty,
    UserSettings
} from '@melluin/common';
import * as _ from 'lodash';

@Component({
    selector: 'app-user-department-box-widget-settings',
    templateUrl: './user-department-box-widget-settings.component.html',
    styleUrl: './user-department-box-widget-settings.component.scss'
})
export class UserDepartmentBoxWidgetSettingsComponent extends CustomUserSettingsEditorBaseComponent {

    private static DEFAULT_LIMIT = 10;

    private readonly fb = inject(FormBuilder);

    protected form = computed(() => this.initForm());
    protected reasonOptions: Array<BoxStatusChangeReason> = Object.values(BoxStatusChangeReason);
    protected dateOptions: Array<DateIntervalSpecifier> = DepartmentBoxInfoSinceDateValues;

    protected override isSaveBtnDisabled(): boolean {
        return this.form().invalid || super.isSaveBtnDisabled();
    }

    protected override generateNewSettings(): UserSettings {
        const newSettings = _.defaultsDeep({}, this.settings());
        const reasons = this.form().value.reasons;
        _.set(newSettings, 'dashboard.widgets.departmentBox', {
            ...this.form().value,
            reasons: isNotEmpty(reasons) ? reasons : undefined,
            type: 'DEPARTMENT_BOX'
        } satisfies DepartmentBoxWidgetSettings);
        return newSettings;
    }

    private initForm(): FormGroup {
        const boxWidget = this.settings().dashboard?.widgets?.departmentBox;
        return this.fb.group({
            needed: [boxWidget?.needed ?? false],
            index: [boxWidget?.index ?? 1],
            limit: [boxWidget?.limit ?? UserDepartmentBoxWidgetSettingsComponent.DEFAULT_LIMIT],
            dateInterval: [boxWidget?.dateInterval],
            reasons: [boxWidget?.reasons ?? []],
        });
    }

}
