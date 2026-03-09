import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {UserSettings, UUID} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {UserEventListSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-event-list-settings-editor/user-event-list-settings-editor.component';
import {UserHomePageSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-home-page-settings-editor/user-home-page-settings-editor.component';
import {UserDepartmentBoxWidgetSettingsComponent} from '@fe/app/my-profile/user-settings-editor/user-department-box-widget-settings/user-department-box-widget-settings.component';

@Component({
    imports: [
        TranslatePipe,
        MatTabGroup,
        MatTab,
        UserEventListSettingsEditorComponent,
        UserHomePageSettingsEditorComponent,
        UserDepartmentBoxWidgetSettingsComponent
    ],
    selector: 'app-user-settings-editor',
    templateUrl: './user-settings-editor.component.html',
    styleUrls: ['./user-settings-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsEditorComponent {

    public userId = input.required<UUID>();
    public settings = input.required<UserSettings>();

}
