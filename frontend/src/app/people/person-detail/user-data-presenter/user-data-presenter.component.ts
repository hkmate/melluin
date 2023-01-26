import {Component, Input} from '@angular/core';
import {User} from '@shared/user/user';

@Component({
    selector: 'app-user-data-presenter',
    templateUrl: './user-data-presenter.component.html',
    styleUrls: ['./user-data-presenter.component.scss']
})
export class UserDataPresenterComponent {

    @Input()
    public user?: User;

}
