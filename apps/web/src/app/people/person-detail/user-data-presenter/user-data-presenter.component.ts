import {Component, effect, inject, input, signal} from '@angular/core';
import {isNotNil, Person, User} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';

@Component({
    selector: 'app-user-data-presenter',
    templateUrl: './user-data-presenter.component.html',
    styleUrls: ['./user-data-presenter.component.scss']
})
export class UserDataPresenterComponent {

    private readonly peopleService = inject(PeopleService);

    public user = input<User>();

    protected creator = signal<Person | undefined>(undefined);

    constructor() {
        effect(() => {
            const creatorId = this.user()?.createdByPersonId;
            if (isNotNil(creatorId)) {
                this.peopleService.getPerson(creatorId).subscribe(person => {
                    this.creator.set(person);
                });
            }
        }, {allowSignalWrites: true});
    }

}
