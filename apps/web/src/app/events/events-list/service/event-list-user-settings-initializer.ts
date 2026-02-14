import {inject, Injectable} from '@angular/core';
import {EventListUserSettings, UserSettings} from '@shared/user/user-settings';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventsFilter} from '@fe/app/events/events-list/service/events-filter';
import {
    DefaultEventListSettingsInitializer,
    EventListSettingsInitializer
} from '@fe/app/events/events-list/service/event-list-settings-initializer';
import {Store} from '@ngrx/store';
import {selectUserSettings} from '@fe/app/state/selector/user-settings.selector';
import {isNil} from '@shared/util/util';
import {dateIntervalGeneratorFactory} from '@shared/util/date-interval-generator';
import {PageInfo} from '@shared/api-util/pageable';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Injectable()
export class EventListUserSettingsInitializer implements EventListSettingsInitializer {

    private readonly store = inject(Store);
    private readonly defaultInitializer = inject(DefaultEventListSettingsInitializer);

    private userSettings: EventListUserSettings;

    constructor() {
        this.store.pipe(selectUserSettings, takeUntilDestroyed()).subscribe((userSettings: UserSettings) => {
            this.userSettings = userSettings.eventList ?? {};
        });
    }

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
        if (!isNil(this.userSettings.needHighlight)) {
            result.needHighlight = this.userSettings.needHighlight;
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
        if (isNil(this.userSettings.dateFilter)) {
            return;
        }
        const filterGenerator = dateIntervalGeneratorFactory(this.userSettings.dateFilter);
        const interval = filterGenerator.generate();
        filter.dateFrom = interval.dateFrom;
        filter.dateTo = interval.dateTo;
    }

    private decorateParticipantFilter(filter: EventsFilter): void {
        if (isNil(this.userSettings.participantIds)) {
            return;
        }
        filter.participantIds = this.userSettings.participantIds;
    }

    private decorateDepartmentFilter(filter: EventsFilter): void {
        if (isNil(this.userSettings.departmentIds)) {
            return;
        }
        filter.departmentIds = this.userSettings.departmentIds;
    }

    private decorateStatusesFilter(filter: EventsFilter): void {
        if (isNil(this.userSettings.statuses)) {
            return;
        }
        filter.statuses = this.userSettings.statuses;
    }

}
