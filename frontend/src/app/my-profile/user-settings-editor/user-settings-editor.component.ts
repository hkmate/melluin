import {Component, Input} from '@angular/core';
import {UserSettings} from '@shared/user/user-settings';

@Component({
    selector: 'app-user-settings-editor',
    templateUrl: './user-settings-editor.component.html',
    styleUrls: ['./user-settings-editor.component.scss']
})
export class UserSettingsEditorComponent {

    @Input()
    public userId: string;

    @Input()
    public settings: UserSettings;

}
