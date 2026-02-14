import { Component, effect, inject, input, signal } from '@angular/core';
import { User } from '@shared/user/user';
import { PeopleService } from '@fe/app/people/people.service';
import { Person } from '@shared/person/person';
import { isNotNil } from '@shared/util/util';

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
