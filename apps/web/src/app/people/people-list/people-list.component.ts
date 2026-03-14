import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {isEmpty, isNotNil, Pageable, PageQuery, Permission, Person, SortOptions, UUID} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {AppTitle} from '@fe/app/app-title.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {PeopleListQueryParamSettingsInitializer} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-settings-initializer';
import {PeopleListQueryParamHandler} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-handler';
import {PeopleListFilterSensitiveDataHider} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter-sensitive-data-hider';
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
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from '@angular/material/table';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatTooltip} from '@angular/material/tooltip';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {PeopleLastLoginStylePipe} from '@fe/app/people/people-list/people-last-login-style.pipe';
import {DatePipe} from '@angular/common';
import {difference, keyBy, uniq} from 'lodash-es';
import {IsNilPipe} from '@fe/app/util/is-nil/is-nil.pipe';

@Component({
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
        MatPaginator,
        IsNilPipe
    ],
    providers: [
        UrlParamHandler,
        PeopleListFilterService,
        PeopleListQueryParamSettingsInitializer,
        PeopleListQueryParamHandler,
        PeopleListFilterSensitiveDataHider
    ],
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListComponent {

    protected readonly Permission = Permission;

    private readonly title = inject(AppTitle);
    protected readonly permissions = inject(PermissionService);
    private readonly peopleService = inject(PeopleService);
    private readonly filterService = inject(PeopleListFilterService);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    protected readonly sizeOptions = [20, 50, 100];
    protected readonly columns = ['name', 'status', 'email', 'phone', 'lastLogin', 'created', 'createdBy', 'options'];

    protected readonly page = signal(0);
    protected readonly size = signal(this.sizeOptions[1]);
    protected readonly countOfAll = signal(0);
    protected readonly items = signal<Array<Person>>([]);
    protected readonly creators = signal<Record<UUID, Person>>({});

    private readonly sort: SortOptions = {
        lastName: 'ASC'
    };

    constructor() {
        this.title.setTitleByI18n('Titles.PeopleList');
        this.filterService.onChange().pipe(takeUntilDestroyed()).subscribe(() => {
            this.setUpPageInfo();
            this.loadData();
        });
    }

    protected paginateHappened(event: PageEvent): void {
        this.filterService.setPageInfo({page: event.pageIndex + 1, size: event.pageSize});
    }

    private setUpPageInfo(): void {
        const pageInfo = this.filterService.getPageInfo();
        this.page.set(pageInfo.page);
        this.size.set(pageInfo.size);
    }

    private loadData(): void {
        this.peopleService.findPeople(this.createPageRequest()).subscribe(
            (page: Pageable<Person>) => {
                this.items.set(page.items);
                this.setUpCreators();
                this.page.set(page.meta.currentPage);
                this.size.set(page.meta.itemsPerPage);
                this.countOfAll.set(page.meta.totalItems!);
            }
        );
    }

    private createPageRequest(): PageQuery {
        return {
            page: this.page(),
            size: this.size(),
            sort: this.sort,
            where: this.filterService.generateFilterOptions()
        };
    }

    private setUpCreators(): void {
        const creatorIds = this.items().map(person => person.createdByPersonId).filter(isNotNil);
        const uniqueCreatorIds = uniq(creatorIds);
        const newCreatorIds = difference(uniqueCreatorIds, Object.keys(this.creators()) as Array<UUID>);
        if (isEmpty(newCreatorIds)) {
            return;
        }
        this.loadAndSetCreatorsById(newCreatorIds);
    }

    private loadAndSetCreatorsById(newCreatorIds: Array<UUID>): void {
        this.peopleService.findPeople({
            page: 1, size: 100,
            where: [{'id': {operator: 'in', operand: newCreatorIds}}]
        }).subscribe(people => {
            this.creators.update(prev => ({
                    ...prev, ...keyBy(people.items, 'id')
                })
            );
        });
    }

}
