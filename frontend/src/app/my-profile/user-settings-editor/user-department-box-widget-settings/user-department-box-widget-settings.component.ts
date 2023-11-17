import {Component} from '@angular/core';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/user-settings-editor.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DateIntervalSpecifier} from '@shared/util/date-interval-generator';
import {DepartmentBoxInfoSinceDateValues, DepartmentBoxWidgetSettings, UserSettings} from '@shared/user/user-settings';
import {Store} from '@ngrx/store';
import {MessageService} from '@fe/app/util/message.service';
import {UserService} from '@fe/app/people/user.service';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import * as  _ from 'lodash';

@Component({
    selector: 'app-user-department-box-widget-settings',
    templateUrl: './user-department-box-widget-settings.component.html',
    styleUrl: './user-department-box-widget-settings.component.scss'
})
export class UserDepartmentBoxWidgetSettingsComponent extends CustomUserSettingsEditorBaseComponent {

    private static DEFAULT_LIMIT = 10;

    protected form: FormGroup;
    protected reasonOptions: Array<BoxStatusChangeReason> = Object.values(BoxStatusChangeReason);
    protected dateOptions: Array<DateIntervalSpecifier> = DepartmentBoxInfoSinceDateValues;

    constructor(store: Store,
                msg: MessageService,
                userService: UserService,
                private readonly fb: FormBuilder) {
        super(store, msg, userService);
    }

    public ngOnInit(): void {
        this.initForm();
    }

    protected override isSaveBtnDisabled(): boolean {
        return this.form.invalid || super.isSaveBtnDisabled();
    }

    protected override generateNewSettings(): UserSettings {
        const newSettings = _.defaultsDeep({}, this.settings);
        _.set(newSettings, 'dashboard.widgets.departmentBox', {
            ...this.form.value,
            type: 'DEPARTMENT_BOX'
        } satisfies DepartmentBoxWidgetSettings);
        return newSettings;
    }

    private initForm(): void {
        const boxWidget = this.settings.dashboard?.widgets?.departmentBox;
        this.form = this.fb.group({
            needed: [boxWidget?.needed ?? false],
            index: [boxWidget?.index ?? 1],
            limit: [boxWidget?.limit ?? UserDepartmentBoxWidgetSettingsComponent.DEFAULT_LIMIT],
            dateInterval: [boxWidget?.dateInterval],
            reasons: [boxWidget?.reasons ?? []],
        });
    }

}
