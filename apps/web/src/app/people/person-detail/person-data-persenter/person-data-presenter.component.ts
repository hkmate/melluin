import {ChangeDetectionStrategy, Component, effect, inject, input, signal} from '@angular/core';
import {isNotNil, Person} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {DatePipe} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
    imports: [
        TranslatePipe,
        MatCard,
        MatCardSubtitle,
        MatCardHeader,
        MatCardTitle,
        OptionalPipe,
        DatePipe,
        MatCardContent,
        MatCheckbox,
    ],
    selector: 'app-person-data-presenter',
    templateUrl: './person-data-presenter.component.html',
    styleUrls: ['./person-data-presenter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'data-details'
    }
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
        });
    }

}
