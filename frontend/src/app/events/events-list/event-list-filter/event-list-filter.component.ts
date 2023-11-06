import {Component, OnInit} from '@angular/core';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {Pageable} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {PeopleService} from '@fe/app/people/people.service';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {Department} from '@shared/department/department';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {EventsListPreferences} from '../service/events-list-preferences';
import {EventsFilter} from '../service/events-filter';
import {HospitalEventsSettingsService} from '@fe/app/events/events-list/service/hospital-events-settings.service';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {filter} from 'rxjs';
import {reasonIsNotPageData} from '@fe/app/events/events-list/service/event-list-settings-change-reason';
import {Platform} from '@angular/cdk/platform';

@Component({
    selector: 'app-event-list-filter',
    templateUrl: './event-list-filter.component.html',
    styleUrls: ['./event-list-filter.component.scss']
})
export class EventListFilterComponent extends AutoUnSubscriber implements OnInit {

    protected filters: EventsFilter;
    protected preferences: EventsListPreferences;
    protected peopleOptions: Array<Person>;
    protected departmentOptions: Array<Department>;
    protected statusOptions: Array<HospitalVisitStatus> = Object.values(HospitalVisitStatus);
    protected mobileScreen: boolean;

    constructor(private readonly platform: Platform,
                private readonly filterService: HospitalEventsSettingsService,
                private readonly departmentService: DepartmentService,
                private readonly peopleService: PeopleService) {
        super();
    }

    public ngOnInit(): void {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        this.addSubscription(this.filterService.onChange().pipe(filter(reasonIsNotPageData)), () => {
            this.resetSettings()
        });
        this.resetSettings();
        this.initPersonOptions();
        this.initDepartmentOptions();
    }

    protected filterSet(): void {
        this.filterService.setFilter(this.filters);
    }

    protected preferenceSet(): void {
        this.filterService.setPreferences(this.preferences);
    }

    private resetSettings(): void {
        this.filters = this.filterService.getFilter();
        this.preferences = this.filterService.getPreferences();
    }

    private initPersonOptions(): void {
        this.peopleService.findPeople({
            page: 1, size: 100,
            sort: {'lastName': 'ASC', 'firstName': 'ASC'},
            where: {'user.isActive': FilterOperationBuilder.eq(true)}
        }).subscribe({
                next: (personPageable: Pageable<Person>) => {
                    this.peopleOptions = personPageable.items;
                }
            }
        );
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe({
            next: (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        });
    }

}
