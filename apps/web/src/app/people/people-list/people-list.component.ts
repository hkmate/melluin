import {Component, effect, inject, signal} from '@angular/core';
import {FilterOptions, isEmpty, isNotNil, Pageable, PageQuery, Permission, Person, SortOptions} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {AppTitle} from '@fe/app/app-title.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {PeopleListQueryParamSettingsInitializer} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-settings-initializer';
import {PeopleListQueryParamHandler} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-handler';
import {PeopleListFilterSensitiveDataHider} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter-sensitive-data-hider';
import _ from 'lodash';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import {PeopleListFilterComponent} from '@fe/app/people/people-list/people-list-filter/people-list-filter.component';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable
} from '@angular/material/table';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatTooltip} from '@angular/material/tooltip';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {PeopleLastLoginStylePipe} from '@fe/app/people/people-list/people-last-login-style.pipe';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss'],
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        RouterLink,
        MatIcon,
        MatExpansionPanel,
        MatAccordion,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        PeopleListFilterComponent,
        MatTable,
        MatColumnDef,
        MatCellDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCell,
        PersonNamePipe,
        MatTooltip,
        OptionalPipe,
        PeopleLastLoginStylePipe,
        DatePipe,
        MatIconButton,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatPaginator
    ],
    providers: [
        UrlParamHandler,
        PeopleListFilterService,
        PeopleListQueryParamSettingsInitializer,
        PeopleListQueryParamHandler,
        PeopleListFilterSensitiveDataHider
    ]
})
export class PeopleListComponent {

    private readonly title = inject(AppTitle);
    protected readonly permissions = inject(PermissionService);
    private readonly peopleService = inject(PeopleService);
    private readonly filterService = inject(PeopleListFilterService);

    Permission = Permission;

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [20, 50, 100];
    protected readonly columns = ['name', 'status', 'email', 'phone', 'lastLogin', 'created', 'createdBy', 'options'];

    protected page: number;
    protected size: number;
    protected countOfAll: number;
    protected items = signal<Array<Person>>([]);
    protected creators = signal<Record<string, Person>>({});

    private sort: SortOptions = {
        lastName: 'ASC'
    };

    constructor() {
        this.title.setTitleByI18n('Titles.PeopleList');
        this.filterService.onChange().pipe(takeUntilDestroyed()).subscribe(() => {
            this.setUpPageInfo();
            this.loadData();
        });
        effect(() => this.setUpCreators(), {allowSignalWrites: true});
    }

    protected paginateHappened(event: PageEvent): void {
        this.filterService.setPageInfo({page: event.pageIndex + 1, size: event.pageSize});
    }

    private setUpPageInfo(): void {
        const pageInfo = this.filterService.getPageInfo();
        this.page = pageInfo.page;
        this.size = pageInfo.size;
    }

    private loadData(page?: number, size?: number): void {
        this.peopleService.findPeople(this.createPageRequest(page, size)).subscribe(
            (page: Pageable<Person>) => {
                this.items.set(page.items);
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

    private setUpCreators(): void {
        const creatorIds = this.items().map(person => person.createdByPersonId).filter(isNotNil);
        const uniqueCreatorIds = _.uniq(creatorIds);
        if (isEmpty(uniqueCreatorIds)) {
            this.creators.set({});
            return;
        }
        this.peopleService.findPeople({
            page: 1,
            size: 100,
            where: [{'id': {operator: 'in', operand: uniqueCreatorIds}}]
        }).subscribe(people => {
            this.creators.set(_.keyBy(people.items, 'id'));
        });
    }

}
