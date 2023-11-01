import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {selectUserSettings} from '@fe/app/state/selector/user-settings.selector';
import {EventListUserSettings, EventsDateFilter, UserSettings} from '@shared/user/user-settings';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {EventsFilter} from '@fe/app/events/events-list/event-list-filter/events-filter';
import {dateIntervalGeneratorFactory} from '@shared/util/date-interval-generator';
import {ConjunctionFilterOptions, FilterOperationBuilder} from '@shared/api-util/filter-options';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {EventsListPreferences} from '@fe/app/events/events-list/event-list-filter/events-list-preferences';

@Injectable()
export class HospitalEventsSettingsService extends AutoUnSubscriber {

    private filter: EventsFilter = new EventsFilter();
    private preferences: EventsListPreferences = new EventsListPreferences();

    constructor(private readonly store: Store) {
        super();

        this.addSubscription(this.store.pipe(selectUserSettings), (userSettings: UserSettings) => {
            this.initFilters(userSettings.eventList ?? {})
            this.initSettings(userSettings.eventList ?? {})
        });
    }

    public getFilter(): EventsFilter {
        return this.filter;
    }

    public setFilter(newFilter: EventsFilter): void {
        this.filter = newFilter;
    }

    public getPreferences(): EventsListPreferences {
        return this.preferences;
    }

    public setPreferences(newPreferences: EventsListPreferences): void {
        this.preferences = newPreferences;
    }

    public generateFilterOptions(): ConjunctionFilterOptions {
        return new EventListFilterOptionGenerator().generateFrom(this.filter);
    }

    private initSettings(defaultFilters: EventListUserSettings): void {
        this.preferences.needHighlight = isNil(defaultFilters.needHighlight) ? true : defaultFilters.needHighlight;
    }

    private initFilters(defaultFilters: EventListUserSettings): void {
        this.setUpDateFilter(defaultFilters.dateFilter ?? EventsDateFilter.MONTH);
        this.setUpParticipantFilter(defaultFilters.participantIds ?? []);
        this.setUpDepartmentFilter(defaultFilters.departmentIds ?? []);
        this.setUpStatusesFilter(defaultFilters.statuses ?? []);
    }

    private setUpDateFilter(eventsDateFilter: EventsDateFilter): void {
        const filterGenerator = dateIntervalGeneratorFactory(eventsDateFilter);
        const interval = filterGenerator.generate();
        this.filter.dateFrom = interval.dateFrom;
        this.filter.dateTo = interval.dateTo;
    }

    private setUpParticipantFilter(participantIds: Array<string>): void {
        this.filter.participantIds = participantIds;
    }

    private setUpDepartmentFilter(departmentIds: Array<string>): void {
        this.filter.departmentIds = departmentIds;
    }

    private setUpStatusesFilter(statuses: Array<HospitalVisitStatus>): void {
        this.filter.statuses = statuses;
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
        this.options.dateTimeFrom = FilterOperationBuilder.lte(filter.dateToStr);
        this.options.dateTimeTo = FilterOperationBuilder.gte(filter.dateFromStr);
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
