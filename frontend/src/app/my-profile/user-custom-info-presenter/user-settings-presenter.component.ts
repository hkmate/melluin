import {Component, Input} from '@angular/core';
import {UserSettings} from '@shared/user/user';

@Component({
    selector: 'app-user-custom-info-presenter',
    templateUrl: './user-settings-presenter.component.html',
    styleUrls: ['./user-settings-presenter.component.scss']
})
export class UserSettingsPresenterComponent {

    @Input()
    settings: UserSettings;

}
