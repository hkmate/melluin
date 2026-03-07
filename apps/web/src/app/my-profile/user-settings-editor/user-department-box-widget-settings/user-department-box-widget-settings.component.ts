import {Component, computed, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
    BoxStatusChangeReason,
    DateIntervalSpecifier,
    DepartmentBoxInfoSinceDateValues,
    DepartmentBoxWidgetSettings,
    isNotEmpty,
    UserSettings
} from '@melluin/common';
import {MatCard, MatCardSubtitle} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/custom-user-settings-editor.base.component';
import {defaultsDeep, set} from 'lodash-es';

@Component({
    selector: 'app-user-department-box-widget-settings',
    templateUrl: './user-department-box-widget-settings.component.html',
    imports: [
        ReactiveFormsModule,
        MatCard,
        MatCardSubtitle,
        MatCheckbox,
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatInput,
        MatButton
    ],
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
        const newSettings = defaultsDeep({}, this.settings());
        const reasons = this.form().value.reasons;
        set(newSettings, 'dashboard.widgets.departmentBox', {
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
