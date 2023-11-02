import {Injectable} from '@angular/core';
import {dateIntervalGeneratorFactory} from '@shared/util/date-interval-generator';
import {EventsDateFilter} from '@shared/user/user-settings';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventsFilter} from '@fe/app/events/events-list/service/events-filter';
import {PageInfo} from '@shared/api-util/pageable';


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
        const dateInterval = dateIntervalGeneratorFactory(EventsDateFilter.MONTH).generate();
        const result = new EventsFilter();
        result.departmentIds = [];
        result.participantIds = [];
        result.statuses = [];
        result.dateFrom = dateInterval.dateFrom;
        result.dateTo = dateInterval.dateTo;
        return result;
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
