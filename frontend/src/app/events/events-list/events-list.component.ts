import {Component} from '@angular/core';
import {SortOptions} from '@shared/api-util/sort-options';
import {AppTitle} from '@fe/app/app-title.service';
import {PageEvent} from '@angular/material/paginator';
import {isNotNil} from '@shared/util/util';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {ConjunctionFilterOptions, FilterOptions} from '@shared/api-util/filter-options';
import {EventsFilter} from '@fe/app/events/events-list/event-list-filter/events-filter';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {ViewType} from '@fe/app/util/view-type-selector/view-type';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {DateUtil} from '@shared/util/date-util';

@Component({
    selector: 'app-events-list',
    templateUrl: './events-list.component.html',
    styleUrls: ['./events-list.component.scss'],
    providers: [UrlParamHandler]
})
export class EventsListComponent {

    ViewType = ViewType;
    Permission = Permission;
    private static readonly FIRST_PAGE = 1;
    private static readonly PAGE_PARAM_KEY = 'page';
    private static readonly SIZE_PARAM_KEY = 'size';
    private static readonly DATE_FROM_PARAM_KEY = 'dateFrom';
    private static readonly DATE_TO_PARAM_KEY = 'dateTo';

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50, 100];

    protected eventsList: Array<HospitalVisit>;
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected viewType: ViewType = ViewType.TABLE;
    protected filter: EventsFilter;
    private sort: SortOptions = {
        dateTimeFrom: 'ASC'
    };

    constructor(private readonly title: AppTitle,
                protected readonly permissions: PermissionService,
                private readonly eventsService: HospitalVisitService,
                private readonly urlParam: UrlParamHandler) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.EventsList')
        this.page = this.urlParam.getNumberParam(EventsListComponent.PAGE_PARAM_KEY) ?? EventsListComponent.FIRST_PAGE;
        this.size = this.urlParam.getNumberParam(EventsListComponent.SIZE_PARAM_KEY) ?? this.sizeOptions[2];
        this.filter = this.initFilter();
        this.loadData();
    }

    protected paginateHappened(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.size = event.pageSize;
        this.urlParam.setParams({
            [EventsListComponent.PAGE_PARAM_KEY]: this.page + '',
            [EventsListComponent.SIZE_PARAM_KEY]: this.size + ''
        });
        this.loadData();
    }

    protected filterChanged(newFilter: EventsFilter): void {
        this.filter = newFilter;
        this.urlParam.setParams({
            [EventsListComponent.DATE_FROM_PARAM_KEY]: this.filter.dateFrom.toISOString(),
            [EventsListComponent.DATE_TO_PARAM_KEY]: this.filter.dateTo.toISOString()
        });
        this.loadData();
    }

    private loadData(page?: number, size?: number): void {
        this.eventsService.findVisit(this.createPageRequest(page, size)).subscribe(
            (page: Pageable<HospitalVisit>) => {
                this.eventsList = page.items;
                this.page = page.meta.currentPage;
                this.countOfAll = page.meta.totalItems!;
                this.size = page.meta.itemsPerPage;
            }
        );
    }

    private createPageRequest(pageIndex?: number, pageSize?: number): PageQuery {
        return {
            page: pageIndex ?? this.page,
            size: pageSize ?? this.size,
            sort: this.sort,
            where: isNotNil(this.filter) ? this.createWhereClosure() : undefined
        };
    }

    private createWhereClosure(): FilterOptions | undefined {
        return this.createDateFilters();
    }

    private createDateFilters(): Array<ConjunctionFilterOptions> {
        return [{
            dateTimeFrom: {operator: 'lte', operand: this.filter.dateTo.toISOString()},
            dateTimeTo: {operator: 'gte', operand: this.filter.dateFrom.toISOString()}
        }];
    }

    private initFilter(): EventsFilter {
        return {
            dateFrom: DateUtil.parse(this.urlParam.getParam(EventsListComponent.DATE_FROM_PARAM_KEY), this.getStartOfMonth()),
            dateTo: DateUtil.parse(this.urlParam.getParam(EventsListComponent.DATE_TO_PARAM_KEY), this.getEndOfTheMonth())
        }
    }

    private getStartOfMonth(): Date {
        const date = DateUtil.now();
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    private getEndOfTheMonth(): Date {
        const date = DateUtil.now();
        date.setMonth(date.getMonth() + 1, 1);
        date.setHours(0, 0, 0, 0);
        return date;
    }

}
