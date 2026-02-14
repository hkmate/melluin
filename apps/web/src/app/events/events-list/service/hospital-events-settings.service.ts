import {inject, Injectable} from '@angular/core';
import {ConjunctionFilterOptions, FilterOperationBuilder} from '@shared/api-util/filter-options';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {EventsFilter} from './events-filter';
import {EventsListPreferences} from './events-list-preferences';
import {EventListQueryParamSettingsInitializer} from '@fe/app/events/events-list/service/event-list-query-param-settings-initializer';
import {EventListUserSettingsInitializer} from '@fe/app/events/events-list/service/event-list-user-settings-initializer';
import {EventListSettingsInitializer} from '@fe/app/events/events-list/service/event-list-settings-initializer';
import {EventListQueryParamHandler} from '@fe/app/events/events-list/service/event-list-query-param-handler';
import {BehaviorSubject, Observable} from 'rxjs';
import {PageInfo} from '@shared/api-util/pageable';
import {ListPageSettingChangeReason} from '@fe/app/util/list-page-settings-change-reason';


@Injectable()
export class HospitalEventsSettingsService {

    private readonly queryParamSettingsIntr = inject(EventListQueryParamSettingsInitializer);
    private readonly userSettingsIntr = inject(EventListUserSettingsInitializer);
    private readonly queryParamHandler = inject(EventListQueryParamHandler);

    private settingsChanged = new BehaviorSubject<ListPageSettingChangeReason>(ListPageSettingChangeReason.ALL);
    private page: PageInfo;
    private filter: EventsFilter;
    private preferences: EventsListPreferences;

    constructor() {
        this.queryParamHandler.onChange().subscribe(() => {
            this.initFilter();
            this.initPreferences();
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
        this.queryParamHandler.saveSettings(this.filter, this.preferences, this.page);
        this.settingsChanged.next(ListPageSettingChangeReason.PAGE_DATA);
    }

    public getFilter(): EventsFilter {
        if (isNil(this.filter)) {
            this.initFilter();
        }
        return this.filter;
    }

    public setFilter(newFilter: EventsFilter): void {
        this.filter = newFilter;
        this.queryParamHandler.saveSettings(this.filter, this.preferences, this.page);
        this.settingsChanged.next(ListPageSettingChangeReason.FILTERS);
    }

    public getPreferences(): EventsListPreferences {
        if (isNil(this.preferences)) {
            this.initPreferences();
        }
        return this.preferences;
    }

    public setPreferences(newPreferences: EventsListPreferences): void {
        this.preferences = newPreferences;
        this.queryParamHandler.saveSettings(this.filter, this.preferences, this.page);
        this.settingsChanged.next(ListPageSettingChangeReason.PREFERENCES);
    }

    public generateFilterOptions(): ConjunctionFilterOptions {
        return new EventListFilterOptionGenerator().generateFrom(this.getFilter());
    }

    private initFilter(): void {
        this.filter = this.getInitializer().getFilters();
        this.queryParamHandler.saveSettings(this.filter, this.preferences, this.page);
    }

    private initPreferences(): void {
        this.preferences = this.getInitializer().getPreferences();
        this.queryParamHandler.saveSettings(this.filter, this.preferences, this.page);
    }

    private initPageInfo(): void {
        this.page = this.getInitializer().getPageInfo();
        this.queryParamHandler.saveSettings(this.filter, this.preferences, this.page);
    }

    private getInitializer(): EventListSettingsInitializer {
        const initializers = [this.queryParamSettingsIntr, this.userSettingsIntr];
        return initializers.filter(initializer => initializer.available())[0];
    }

}

class EventListFilterOptionGenerator {

    private options: ConjunctionFilterOptions = {};

    public generateFrom(filter: EventsFilter): ConjunctionFilterOptions {
        this.options = {};
        this.decorateDates(filter);
        this.decorateStatuses(filter);
        this.decorateParticipantIds(filter);
        this.decorateDepartmentIds(filter);
        return this.options;
    }

    private decorateDates(filter: EventsFilter): void {
        const firstDay = filter.dateFrom;
        const lastDay = filter.dateTo;
        const nextAfterLastDay = new Date(lastDay);
        nextAfterLastDay.setDate(nextAfterLastDay.getDate() + 1);

        this.options.dateTimeFrom = FilterOperationBuilder.lt(nextAfterLastDay);
        this.options.dateTimeTo = FilterOperationBuilder.gte(firstDay);
    }

    private decorateStatuses(filter: EventsFilter): void {
        if (!isNilOrEmpty(filter.statuses)) {
            this.options.status = FilterOperationBuilder.in(filter.statuses)
        }
    }

    private decorateParticipantIds(filter: EventsFilter): void {
        if (!isNilOrEmpty(filter.participantIds)) {
            this.options['participants.id'] = FilterOperationBuilder.in(filter.participantIds)
        }
    }

    private decorateDepartmentIds(filter: EventsFilter): void {
        if (!isNilOrEmpty(filter.departmentIds)) {
            this.options['department.id'] = FilterOperationBuilder.in(filter.departmentIds)
        }
    }

}
