import {Component, input} from '@angular/core';
import {Person, User, UserSettings} from '@melluin/common';

@Component({
    selector: 'app-my-profile-present',
    templateUrl: './my-profile-present.component.html',
    styleUrls: ['./my-profile-present.component.scss']
})
export class MyProfilePresentComponent {

    public readonly person = input.required<Person>();
    public readonly user = input.required<User>();
    public readonly userSettings = input.required<UserSettings>();

}
