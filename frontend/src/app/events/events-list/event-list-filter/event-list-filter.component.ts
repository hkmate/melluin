import {Component, OnInit} from '@angular/core';
import {Pageable} from '@shared/api-util/pageable';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {Department} from '@shared/department/department';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {EventsListPreferences} from '../service/events-list-preferences';
import {EventsFilter} from '../service/events-filter';
import {HospitalEventsSettingsService} from '@fe/app/events/events-list/service/hospital-events-settings.service';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {filter} from 'rxjs';
import {Platform} from '@angular/cdk/platform';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';

@Component({
    selector: 'app-event-list-filter',
    templateUrl: './event-list-filter.component.html',
    styleUrls: ['./event-list-filter.component.scss']
})
export class EventListFilterComponent extends AutoUnSubscriber implements OnInit {

    protected filters: EventsFilter;
    protected preferences: EventsListPreferences;
    protected departmentOptions: Array<Department>;
    protected statusOptions: Array<HospitalVisitStatus> = Object.values(HospitalVisitStatus);
    protected mobileScreen: boolean;

    constructor(private readonly platform: Platform,
                private readonly filterService: HospitalEventsSettingsService,
                private readonly departmentService: DepartmentService) {
        super();
    }

    public ngOnInit(): void {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        this.addSubscription(this.filterService.onChange().pipe(filter(reasonIsNotPageData)), () => {
            this.resetSettings()
        });
        this.resetSettings();
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

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe({
            next: (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        });
    }

}
