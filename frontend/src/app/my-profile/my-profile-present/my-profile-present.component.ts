import {Component, Input} from '@angular/core';
import {User, UserSettings} from '@shared/user/user';
import {Person} from '@shared/person/person';

@Component({
    selector: 'app-my-profile-present',
    templateUrl: './my-profile-present.component.html',
    styleUrls: ['./my-profile-present.component.scss']
})
export class MyProfilePresentComponent {

    @Input()
    public person: Person;

    @Input()
    public user: User;

    @Input()
    public userSettings: UserSettings;

}
