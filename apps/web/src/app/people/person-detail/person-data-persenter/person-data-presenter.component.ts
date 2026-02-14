import { Component, effect, inject, input, signal } from '@angular/core';
import { Person } from '@shared/person/person';
import { PeopleService } from '@fe/app/people/people.service';
import { isNotNil } from '@shared/util/util';

@Component({
    selector: 'app-person-data-presenter',
    templateUrl: './person-data-presenter.component.html',
    styleUrls: ['./person-data-presenter.component.scss']
})
export class PersonDataPresenterComponent {

    private readonly peopleService = inject(PeopleService);

    public person = input<Person>();

    protected creator = signal<Person | undefined>(undefined);

    constructor() {
        effect(() => {
            const creatorId = this.person()?.createdByPersonId;
            if (isNotNil(creatorId)) {
                this.peopleService.getPerson(creatorId).subscribe(person => {
                    this.creator.set(person);
                });
            }
        }, {allowSignalWrites: true});
    }

}
