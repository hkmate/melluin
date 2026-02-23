import {Component, input} from '@angular/core';
import {UserSettings} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {UserEventListSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-event-list-settings-editor/user-event-list-settings-editor.component';
import {UserHomePageSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-home-page-settings-editor/user-home-page-settings-editor.component';
import {UserDepartmentBoxWidgetSettingsComponent} from '@fe/app/my-profile/user-settings-editor/user-department-box-widget-settings/user-department-box-widget-settings.component';

@Component({
    selector: 'app-user-settings-editor',
    templateUrl: './user-settings-editor.component.html',
    imports: [
        TranslatePipe,
        MatTabGroup,
        MatTab,
        UserEventListSettingsEditorComponent,
        UserHomePageSettingsEditorComponent,
        UserDepartmentBoxWidgetSettingsComponent
    ],
    styleUrls: ['./user-settings-editor.component.scss']
})
export class UserSettingsEditorComponent {

    public userId = input.required<string>();
    public settings = input.required<UserSettings>();

}
