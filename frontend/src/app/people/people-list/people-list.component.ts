import {Component, signal, OnInit} from '@angular/core';
import {Pageable, PageQuery} from '@shared/api-util/pageable';
import {Person} from '@shared/person/person';
import {PeopleService} from '@fe/app/people/people.service';
import {AppTitle} from '@fe/app/app-title.service';
import {PageEvent} from '@angular/material/paginator';
import {SortOptions} from '@shared/api-util/sort-options';
import {FilterOptions} from '@shared/api-util/filter-options';
import {TableDataSource} from '@fe/app/util/table-data-source';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {PeopleListQueryParamSettingsInitializer} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-settings-initializer';
import {PeopleListQueryParamHandler} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-handler';
import {PeopleListFilterSensitiveDataHider} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter-sensitive-data-hider';
import _ from 'lodash';

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss'],
    providers: [
        UrlParamHandler,
        PeopleListFilterService,
        PeopleListQueryParamSettingsInitializer,
        PeopleListQueryParamHandler,
        PeopleListFilterSensitiveDataHider
    ]
})
export class PeopleListComponent extends AutoUnSubscriber implements OnInit {

    Permission = Permission;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [20, 50, 100];
    protected readonly columns = ['name', 'email', 'phone', 'lastLogin', 'created', 'createdBy', 'options'];

    protected tableDataSource = new TableDataSource<Person>();
    protected page: number;
    protected size: number;
    protected countOfAll: number;

    protected creators = signal<Record<string, Person>>({});

    private sort: SortOptions = {
        lastName: 'ASC'
    };

    constructor(private readonly title: AppTitle,
                protected readonly permissions: PermissionService,
                private readonly peopleService: PeopleService,
                private readonly filterService: PeopleListFilterService) {
        super();
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.PeopleList');
        this.addSubscription(this.filterService.onChange(), () => {
            this.setUpPageInfo();
            this.loadData();
        });
    }

    protected paginateHappened(event: PageEvent): void {
        this.filterService.setPageInfo({ page: event.pageIndex + 1, size: event.pageSize });
    }

    private setUpPageInfo(): void {
        const pageInfo = this.filterService.getPageInfo();
        this.page = pageInfo.page;
        this.size = pageInfo.size;
    }

    private loadData(page?: number, size?: number): void {
        this.peopleService.findPeople(this.createPageRequest(page, size)).subscribe(
            (page: Pageable<Person>) => {
                this.tableDataSource.emit(page.items);
                this.setUpCreators(page.items);
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
            where: this.createWhereClosure()
        };
    }

    private createWhereClosure(): FilterOptions | undefined {
        return this.filterService.generateFilterOptions();
    }

    private setUpCreators(persons: Array<Person>): void {
        const creatorIds = persons.map(person => person.createdByPersonId);
        const uniqueCreatorIds = _.uniq(creatorIds);
        this.peopleService.findPeople({
            page: 1,
            size: 100,
            where: [{ 'id': { operator: 'in', operand: uniqueCreatorIds } }]
        }).subscribe(people => {
            this.creators.set(_.keyBy(people.items, 'id'));
        });
    }

}
