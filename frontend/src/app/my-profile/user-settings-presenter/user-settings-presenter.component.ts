import {Component, Input} from '@angular/core';
import {UserSettings} from '@shared/user/user-settings';
import {PeopleService} from '@fe/app/people/people.service';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {Person} from '@shared/person/person';
import {Department} from '@shared/department/department';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {isNilOrEmpty} from '@shared/util/util';

@Component({
    selector: 'app-user-settings-presenter',
    templateUrl: './user-settings-presenter.component.html',
    styleUrls: ['./user-settings-presenter.component.scss']
})
export class UserSettingsPresenterComponent {

    protected settings: UserSettings;
    protected participants: Array<Person>;
    protected departments: Array<Department>;

    @Input()
    public set userSettings(settings: UserSettings) {
        this.settings = settings;
        this.init();
    }

    constructor(private readonly peopleService: PeopleService,
                private readonly departmentService: DepartmentService) {
    }

    private init(): void {
        this.initParticipants();
        this.initDepartments();
    }

    private initParticipants(): void {
        const participantIds = this.settings.eventList?.participantIds;
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
        const departmentIds = this.settings.eventList?.departmentIds;
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
