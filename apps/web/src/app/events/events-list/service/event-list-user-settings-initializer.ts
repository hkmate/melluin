import {computed, inject, Injectable} from '@angular/core';
import {dateIntervalGeneratorFactory, isNil, PageInfo} from '@melluin/common';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventsFilter} from '@fe/app/events/events-list/service/events-filter';
import {
    DefaultEventListSettingsInitializer,
    EventListSettingsInitializer
} from '@fe/app/events/events-list/service/event-list-settings-initializer';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';


@Injectable()
export class EventListUserSettingsInitializer implements EventListSettingsInitializer {

    private readonly currentUserService = inject(CurrentUserService);
    private readonly defaultInitializer = inject(DefaultEventListSettingsInitializer);

    private readonly userSettings = computed(() => this.currentUserService.userSettings()?.eventList ?? {});

    public available(): boolean {
        return true;
    }

    public getFilters(): EventsFilter {
        const result = this.defaultInitializer.getFilters();
        this.decorateDefault(result);
        return result;
    }

    public getPreferences(): EventsListPreferences {
        const result = this.defaultInitializer.getPreferences();
        const needHighlight = this.userSettings().needHighlight;
        if (!isNil(needHighlight)) {
            result.needHighlight = needHighlight;
        }
        return result;
    }

    public getPageInfo(): PageInfo {
        return this.defaultInitializer.getPageInfo();
    }

    private decorateDefault(filters: EventsFilter): void {
        this.decorateDateFilter(filters);
        this.decorateParticipantFilter(filters);
        this.decorateDepartmentFilter(filters);
        this.decorateStatusesFilter(filters);
    }

    private decorateDateFilter(filter: EventsFilter): void {
        const dateFilter = this.userSettings().dateFilter;
        if (isNil(dateFilter)) {
            return;
        }
        const filterGenerator = dateIntervalGeneratorFactory(dateFilter);
        const interval = filterGenerator.generate();
        filter.dateFrom = interval.dateFrom;
        filter.dateTo = interval.dateTo;
    }

    private decorateParticipantFilter(filter: EventsFilter): void {
        const participantIds = this.userSettings().participantIds;
        if (isNil(participantIds)) {
            return;
        }
        filter.participantIds = participantIds;
    }

    private decorateDepartmentFilter(filter: EventsFilter): void {
        const departmentIds = this.userSettings().departmentIds;
        if (isNil(departmentIds)) {
            return;
        }
        filter.departmentIds = departmentIds;
    }

    private decorateStatusesFilter(filter: EventsFilter): void {
        const statuses = this.userSettings().statuses;
        if (isNil(statuses)) {
            return;
        }
        filter.statuses = statuses;
    }

}
