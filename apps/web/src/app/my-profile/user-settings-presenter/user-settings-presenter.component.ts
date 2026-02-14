import {Component, effect, inject, input} from '@angular/core';
import {UserSettings} from '@shared/user/user-settings';
import {PeopleService} from '@fe/app/people/people.service';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Person} from '@shared/person/person';
import {Department} from '@shared/department/department';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {isNil, isNilOrEmpty} from '@shared/util/util';

@Component({
    selector: 'app-user-settings-presenter',
    templateUrl: './user-settings-presenter.component.html',
    styleUrls: ['./user-settings-presenter.component.scss']
})
export class UserSettingsPresenterComponent {

    private readonly peopleService = inject(PeopleService);
    private readonly departmentService = inject(DepartmentService);

    protected isNil = isNil;

    public readonly userSettings = input.required<UserSettings>();

    protected participants: Array<Person>;
    protected departments: Array<Department>;

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
            this.participants = people.items;
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
            this.departments = departments.items;
        });
    }

}
