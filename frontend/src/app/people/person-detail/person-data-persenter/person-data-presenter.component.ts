import {Component, Input} from '@angular/core';
import {Person} from '@shared/person/person';

@Component({
    selector: 'app-person-data-presenter',
    templateUrl: './person-data-presenter.component.html',
    styleUrls: ['./person-data-presenter.component.scss']
})
export class PersonDataPresenterComponent {

    @Input()
    public person?: Person;

}
