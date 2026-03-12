import {Component, inject} from '@angular/core';
import {FilterOptions, Visit, Pageable, PageQuery, Permission, SortOptions} from '@melluin/common';
import {AppTitle} from '@fe/app/app-title.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {EventsSettingsService} from '@fe/app/events/events-list/service/events-settings.service';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventListUserSettingsInitializer} from '@fe/app/events/events-list/service/event-list-user-settings-initializer';
import {DefaultEventListSettingsInitializer} from '@fe/app/events/events-list/service/event-list-settings-initializer';
import {EventListQueryParamSettingsInitializer} from '@fe/app/events/events-list/service/event-list-query-param-settings-initializer';
import {EventListQueryParamHandler} from '@fe/app/events/events-list/service/event-list-query-param-handler';
import {filter} from 'rxjs';
import {reasonIsPreferences} from '@fe/app/util/list-page-settings-change-reason';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {MatMiniFabButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import {EventListFilterComponent} from '@fe/app/events/events-list/event-list-filter/event-list-filter.component';
import {VisitListComponent} from '@fe/app/hospital/visit/visit-list/visit-list.component';

@Component({
    selector: 'app-events-list',
    templateUrl: './events-list.component.html',
    styleUrls: ['./events-list.component.scss'],
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        RouterLink,
        MatIcon,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        EventListFilterComponent,
        VisitListComponent,
        MatPaginator
    ],
    providers: [
        UrlParamHandler,
        EventListQueryParamHandler,
        DefaultEventListSettingsInitializer,
        EventListUserSettingsInitializer,
        EventListQueryParamSettingsInitializer,
        EventsSettingsService
    ]
})
export class EventsListComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);
    private readonly title = inject(AppTitle);
    private readonly eventsService = inject(VisitService);
    private readonly filterService = inject(EventsSettingsService);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50, 100];

    protected eventsList: Array<Visit> = [];
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected preferences: EventsListPreferences = {needHighlight: true};
    private sort: SortOptions = {
        dateTimeFrom: 'ASC',
        'department.name': 'ASC',
    };

    constructor() {
        this.title.setTitleByI18n('Titles.EventsList');
        this.filterService.onChange().pipe(takeUntilDestroyed(), filter(reasonIsPreferences)).subscribe(() => {
            this.preferences = this.filterService.getPreferences();
        });
        this.filterService.onChange().pipe(takeUntilDestroyed()).subscribe(() => {
            this.preferences = this.filterService.getPreferences();
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
            (page: Pageable<Visit>) => {
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
