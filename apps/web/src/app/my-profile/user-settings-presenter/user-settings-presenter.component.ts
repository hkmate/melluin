import {ChangeDetectionStrategy, Component, effect, inject, input, signal} from '@angular/core';
import {Department, FilterOperationBuilder, isNilOrEmpty, Person, UserSettings} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatChip} from '@angular/material/chips';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {IsNilPipe} from '@fe/app/util/is-nil/is-nil.pipe';

@Component({
    imports: [
        MatTabGroup,
        TranslatePipe,
        MatTab,
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        PersonNamePipe,
        MatChip,
        MatCardContent,
        OptionalPipe,
        IsNilPipe
    ],
    selector: 'app-user-settings-presenter',
    templateUrl: './user-settings-presenter.component.html',
    styleUrls: ['./user-settings-presenter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsPresenterComponent {

    private readonly peopleService = inject(PeopleService);
    private readonly departmentService = inject(DepartmentService);

    public readonly userSettings = input.required<UserSettings>();

    protected readonly participants = signal<Array<Person>>([]);
    protected readonly departments = signal<Array<Department>>([]);

    constructor() {
        effect(() => this.init());
    }

    private init(): void {
        this.initParticipants();
        this.initDepartments();
    }

    private initParticipants(): void {
        const participantIds = this.userSettings().eventList?.participantIds;
        if (isNilOrEmpty(participantIds)) {
            return;
        }
        this.peopleService.findPeople({
            where: {'id': FilterOperationBuilder.in(participantIds!)},
            sort: {'lastName': 'ASC'},
            page: 1, size: 50
        }).subscribe(people => {
            this.participants.set(people.items);
        });
    }

    private initDepartments(): void {
        const departmentIds = this.userSettings().eventList?.departmentIds;
        if (isNilOrEmpty(departmentIds)) {
            return;
        }
        this.departmentService.findDepartments({
            where: {'id': FilterOperationBuilder.in(departmentIds!)},
            sort: {'name': 'ASC'},
            page: 1, size: 50
        }).subscribe(departments => {
            this.departments.set(departments.items);
        });
    }

}
