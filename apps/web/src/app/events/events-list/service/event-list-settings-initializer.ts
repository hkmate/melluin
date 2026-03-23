import {Injectable} from '@angular/core';
import {dateIntervalGeneratorFactory, DateIntervalSpecifiers, PageInfo} from '@melluin/common';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventsFilter} from '@fe/app/events/events-list/service/events-filter';


export interface EventListSettingsInitializer {

    available(): boolean;

    getFilters(): EventsFilter;

    getPreferences(): EventsListPreferences;

    getPageInfo(): PageInfo;
}

@Injectable()
export class DefaultEventListSettingsInitializer implements EventListSettingsInitializer {

    public available(): boolean {
        return true;
    }

    public getFilters(): EventsFilter {
        const dateInterval = dateIntervalGeneratorFactory(DateIntervalSpecifiers.WEEK).generate();
        return {
            departmentIds: [],
            participantIds: [],
            statuses: [],
            dateFrom: dateInterval.dateFrom,
            dateTo: dateInterval.dateTo
        } satisfies EventsFilter;
    }

    public getPreferences(): EventsListPreferences {
        return {needHighlight: true};
    }

    public getPageInfo(): PageInfo {
        return {
            page: 1,
            size: 50
        }
    }

}
