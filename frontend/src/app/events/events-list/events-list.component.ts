import {Component} from '@angular/core';
import {SortOptions} from '@shared/api-util/sort-options';
import {AppTitle} from '@fe/app/app-title.service';
import {PageEvent} from '@angular/material/paginator';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {FilterOptions} from '@shared/api-util/filter-options';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {ViewType} from '@fe/app/util/view-type-selector/view-type';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {HospitalEventsSettingsService} from '@fe/app/events/events-list/service/hospital-events-settings.service';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventListUserSettingsInitializer} from '@fe/app/events/events-list/service/event-list-user-settings-initializer';
import {DefaultEventListSettingsInitializer} from '@fe/app/events/events-list/service/event-list-settings-initializer';
import {EventListQueryParamSettingsInitializer} from '@fe/app/events/events-list/service/event-list-query-param-settings-initializer';
import {EventListQueryParamHandler} from '@fe/app/events/events-list/service/event-list-query-param-handler';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {filter} from 'rxjs';
import {reasonIsNotPreferences, reasonIsPreferences} from '@fe/app/util/list-page-settings-change-reason';

@Component({
    selector: 'app-events-list',
    templateUrl: './events-list.component.html',
    styleUrls: ['./events-list.component.scss'],
    providers: [
        UrlParamHandler,
        EventListQueryParamHandler,
        DefaultEventListSettingsInitializer,
        EventListUserSettingsInitializer,
        EventListQueryParamSettingsInitializer,
        HospitalEventsSettingsService
    ]
})
export class EventsListComponent extends AutoUnSubscriber {

    ViewType = ViewType;
    Permission = Permission;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50, 100];

    protected eventsList: Array<HospitalVisit> = [];
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected preferences: EventsListPreferences = {needHighlight: true};
    protected viewType: ViewType = ViewType.TABLE;
    private sort: SortOptions = {
        dateTimeFrom: 'ASC',
        'department.name': 'ASC'
    };

    constructor(private readonly title: AppTitle,
                protected readonly permissions: PermissionService,
                private readonly eventsService: HospitalVisitService,
                private readonly filterService: HospitalEventsSettingsService) {
        super();
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.EventsList');
        this.addSubscription(this.filterService.onChange().pipe(filter(reasonIsPreferences)), () => {
            this.preferences = this.filterService.getPreferences();
        });
        this.addSubscription(this.filterService.onChange().pipe(filter(reasonIsNotPreferences)), () => {
            this.setUpPageInfo();
            this.loadData();
        });
    }

    protected paginateHappened(event: PageEvent): void {
        this.filterService.setPageInfo({page: event.pageIndex + 1, size: event.pageSize});
    }

    private setUpPageInfo(): void {
        const pageInfo = this.filterService.getPageInfo();
        this.page = pageInfo.page;
        this.size = pageInfo.size;
    }

    private loadData(): void {
        this.eventsService.findVisit(this.createPageRequest()).subscribe(
            (page: Pageable<HospitalVisit>) => {
                this.eventsList = page.items;
                this.page = page.meta.currentPage;
                this.countOfAll = page.meta.totalItems!;
                this.size = page.meta.itemsPerPage;
            }
        );
    }

    private createPageRequest(): PageQuery {
        return {
            page: this.page,
            size: this.size,
            sort: this.sort,
            where: this.createWhereClosure()
        };
    }

    private createWhereClosure(): FilterOptions | undefined {
        return this.filterService.generateFilterOptions();
    }

}
