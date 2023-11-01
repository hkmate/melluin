import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EventsFilter} from '@fe/app/events/events-list/event-list-filter/events-filter';
import {
    HospitalEventsSettingsService
} from '@fe/app/events/events-list/event-list-filter/hospital-events-settings.service';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {Pageable} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {PeopleService} from '@fe/app/people/people.service';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {Department} from '@shared/department/department';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {EventsListPreferences} from '@fe/app/events/events-list/event-list-filter/events-list-preferences';

@Component({
    selector: 'app-event-list-filter',
    templateUrl: './event-list-filter.component.html',
    styleUrls: ['./event-list-filter.component.scss']
})
export class EventListFilterComponent implements OnInit {

    @Output()
    public filtersChanged = new EventEmitter<void>();

    @Output()
    public preferencesChanged = new EventEmitter<void>();

    protected filters: EventsFilter;
    protected preferences: EventsListPreferences;
    protected peopleOptions: Array<Person>;
    protected departmentOptions: Array<Department>;
    protected statusOptions: Array<HospitalVisitStatus> = Object.values(HospitalVisitStatus);

    constructor(private readonly filterService: HospitalEventsSettingsService,
                private readonly departmentService: DepartmentService,
                private readonly peopleService: PeopleService) {
    }

    public ngOnInit(): void {
        this.filters = this.filterService.getFilter();
        this.preferences = this.filterService.getPreferences();
        this.initPersonOptions();
        this.initDepartmentOptions();
        this.normalizeDates();
        this.filtersChanged.emit();
        this.preferencesChanged.emit();
    }

    protected filterSet(): void {
        this.normalizeDates();
        this.filterService.setFilter(this.filters);
        this.filtersChanged.emit();
    }

    protected preferenceSet(): void {
        this.filterService.setPreferences(this.preferences);
        this.preferencesChanged.emit();
    }

    private normalizeDates(): void {
        this.filters.dateFrom.setHours(0, 0, 0, 0);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.filters.dateTo.setHours(23, 59, 59, 999);
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
