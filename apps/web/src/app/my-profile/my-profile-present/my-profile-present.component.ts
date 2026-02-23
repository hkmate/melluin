import {Component, input} from '@angular/core';
import {Person, User, UserSettings} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {UserSettingsPresenterComponent} from '@fe/app/my-profile/user-settings-presenter/user-settings-presenter.component';

@Component({
    selector: 'app-my-profile-present',
    templateUrl: './my-profile-present.component.html',
    imports: [
        TranslatePipe,
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        OptionalPipe,
        MatCardContent,
        MatCheckbox,
        FormsModule,
        DatePipe,
        UserSettingsPresenterComponent
    ],
    styleUrls: ['./my-profile-present.component.scss']
})
export class MyProfilePresentComponent {

    public readonly person = input.required<Person>();
    public readonly user = input.required<User>();
    public readonly userSettings = input.required<UserSettings>();

}
