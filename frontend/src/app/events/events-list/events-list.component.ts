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

@Component({
    selector: 'app-events-list',
    templateUrl: './events-list.component.html',
    styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent {

    Permission = Permission;
    private static readonly FIRST_PAGE = 1;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [10, 20, 50, 100];

    protected eventsList: Array<HospitalVisit>;
    protected page: number;
    protected size: number;
    protected countOfAll: number;
    private filter: EventsFilter;
    private sort: SortOptions = {
        dateTimeFrom: 'ASC'
    };

    constructor(private readonly title: AppTitle,
                protected readonly permissions: PermissionService,
                private readonly eventsService: HospitalVisitService) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.EventsList')
        this.page = EventsListComponent.FIRST_PAGE;
        this.size = this.sizeOptions[2];
    }

    protected paginateHappened(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.size = event.pageSize;
        this.loadData();
    }

    protected filterChanged(newFilter: EventsFilter): void {
        this.filter = newFilter;
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
            dateTimeFrom: {operator: 'lte', operand: this.filter.dateTo},
            dateTimeTo: {operator: 'gte', operand: this.filter.dateFrom}
        }];
    }

}
