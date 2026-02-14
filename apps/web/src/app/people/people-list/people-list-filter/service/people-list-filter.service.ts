import {inject, Injectable} from '@angular/core';
import {ConjunctionFilterOptions, FilterOperationBuilder, FilterOptions} from '@shared/api-util/filter-options';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {BehaviorSubject, Observable} from 'rxjs';
import {PageInfo} from '@shared/api-util/pageable';
import {PeopleListQueryParamHandler} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-handler';
import {PeopleListQueryParamSettingsInitializer} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-param-settings-initializer';
import {ListPageSettingChangeReason} from '@fe/app/util/list-page-settings-change-reason';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {PeopleListFilterSensitiveDataHider} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter-sensitive-data-hider';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Injectable()
export class PeopleListFilterService {

    private readonly queryParamSettingsIntr = inject(PeopleListQueryParamSettingsInitializer);
    private readonly queryParamHandler = inject(PeopleListQueryParamHandler);
    private readonly filterHider = inject(PeopleListFilterSensitiveDataHider);

    private settingsChanged = new BehaviorSubject<ListPageSettingChangeReason>(ListPageSettingChangeReason.ALL);
    private page: PageInfo;
    private filter: PeopleFilter;

    constructor() {
        this.queryParamHandler.onChange().pipe(takeUntilDestroyed()).subscribe(() => {
            this.initFilter();
            this.initPageInfo();
            this.settingsChanged.next(ListPageSettingChangeReason.ALL);
        });
    }

    public onChange(): Observable<ListPageSettingChangeReason> {
        return this.settingsChanged.asObservable();
    }

    public getPageInfo(): PageInfo {
        if (isNil(this.page)) {
            this.initPageInfo();
        }
        return this.page;
    }

    public setPageInfo(newFilter: PageInfo): void {
        this.page = newFilter;
        this.queryParamHandler.saveSettings(this.filter, this.page);
        this.settingsChanged.next(ListPageSettingChangeReason.PAGE_DATA);
    }

    public getFilter(): PeopleFilter {
        if (isNil(this.filter)) {
            this.initFilter();
        }
        return this.filter;
    }

    public setFilter(newFilter: PeopleFilter): void {
        this.filter = this.filterHider.hideData(newFilter);
        this.queryParamHandler.saveSettings(this.filter, this.page);
        this.settingsChanged.next(ListPageSettingChangeReason.FILTERS);
    }

    public generateFilterOptions(): FilterOptions {
        return new PeopleListFilterOptionGenerator().generateFrom(this.getFilter());
    }

    private initFilter(): void {
        this.filter = this.filterHider.hideData(this.queryParamSettingsIntr.getFilters());
        this.queryParamHandler.saveSettings(this.filter, this.page);
    }

    private initPageInfo(): void {
        this.page = this.queryParamSettingsIntr.getPageInfo();
        this.queryParamHandler.saveSettings(this.filter, this.page);
    }

}

class PeopleListFilterOptionGenerator {

    private options: ConjunctionFilterOptions = {};

    public generateFrom(filter: PeopleFilter): FilterOptions {
        this.options = {};
        this.decorateEmail(filter);
        this.decoratePhone(filter);
        this.decorateIsActive(filter);
        this.decorateRoles(filter);
        this.decorateCities(filter);
        return this.generateWithNameOptions(filter);
    }

    private decorateEmail(filter: PeopleFilter): void {
        if (isNilOrEmpty(filter.email)) {
            return;
        }
        const likeExpr = `%${filter.email}%`;
        this.options.email = FilterOperationBuilder.ilike(likeExpr);
    }

    private decoratePhone(filter: PeopleFilter): void {
        if (isNilOrEmpty(filter.phone)) {
            return;
        }
        const likeExpr = `%${filter.phone}%`;
        this.options.phone = FilterOperationBuilder.ilike(likeExpr);
    }

    private decorateIsActive(filter: PeopleFilter): void {
        if (!filter.onlyActive) {
            return;
        }
        this.options['user.isActive'] = FilterOperationBuilder.eq(true);
    }

    private decorateRoles(filter: PeopleFilter): void {
        if (isNilOrEmpty(filter.roleNames)) {
            return;
        }
        this.options['user.roleNames'] = FilterOperationBuilder.in(filter.roleNames)
    }

    private decorateCities(filter: PeopleFilter): void {
        if (isNilOrEmpty(filter.cities)) {
            return;
        }
        this.options.cities = FilterOperationBuilder.jsonContains(filter.cities)
    }

    private generateWithNameOptions(filter: PeopleFilter): FilterOptions {
        if (isNilOrEmpty(filter.name)) {
            return this.options;
        }
        const likeExpr = `%${filter.name}%`;
        // Note: firstName and lastName should be put with an OR relation.
        return [
            {...this.options, firstName: FilterOperationBuilder.ilike(likeExpr)},
            {...this.options, lastName: FilterOperationBuilder.ilike(likeExpr)},
        ];
    }

}
