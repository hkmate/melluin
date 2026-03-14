import {Component, effect, inject, input, signal} from '@angular/core';
import {isNotNil, Person, User} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';

@Component({
    imports: [
        TranslatePipe,
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        DatePipe,
        MatCardContent
    ],
    selector: 'app-user-data-presenter',
    templateUrl: './user-data-presenter.component.html',
    host: {
        class: 'data-details'
    }
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
        });
    }

}
