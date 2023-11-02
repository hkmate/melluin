import {Injectable} from '@angular/core';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventsFilter} from '@fe/app/events/events-list/service/events-filter';
import {DefaultEventListSettingsInitializer} from '@fe/app/events/events-list/service/event-list-settings-initializer';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {EventListQueryParams} from '@fe/app/events/events-list/service/event-list-query-params';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, PageInfo} from '@shared/api-util/pageable';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';


@Injectable()
export class EventListQueryParamSettingsInitializer extends DefaultEventListSettingsInitializer {

    constructor(private readonly urlParamHandler: UrlParamHandler) {
        super();
    }

    public override available(): boolean {
        return this.isAnyQueryParam();
    }

    public override getFilters(): EventsFilter {
        if (!this.isAnyQueryParam()) {
            throw new Error('No query param about event list settings');
        }
        const result = super.getFilters();
        this.decorateDefault(result);
        return result;
    }

    public override getPreferences(): EventsListPreferences {
        if (!this.isAnyQueryParam()) {
            throw new Error('No query param about event list settings');
        }
        const result = super.getPreferences();
        this.decorateHighLight(result);
        return result;
    }

    public override getPageInfo(): PageInfo {
        if (!this.isAnyQueryParam()) {
            throw new Error('No query param about event list settings');
        }
        const result = super.getPageInfo();
        this.decoratePageNumber(result);
        this.decoratePageSize(result);
        return result;
    }

    private isAnyQueryParam(): boolean {
        return this.urlParamHandler.hasParam(EventListQueryParams.dateFrom)
            || this.urlParamHandler.hasParam(EventListQueryParams.dateTo)
            || this.urlParamHandler.hasParam(EventListQueryParams.departmentIds)
            || this.urlParamHandler.hasParam(EventListQueryParams.participantIds)
            || this.urlParamHandler.hasParam(EventListQueryParams.statuses)
            || this.urlParamHandler.hasParam(EventListQueryParams.highlight)
            || this.urlParamHandler.hasParam(PAGE_QUERY_KEY)
            || this.urlParamHandler.hasParam(PAGE_SIZE_QUERY_KEY);
    }

    private decorateDefault(filters: EventsFilter): void {
        this.decorateDateFromFilter(filters);
        this.decorateDateToFilter(filters);
        this.decorateParticipantFilter(filters);
        this.decorateDepartmentFilter(filters);
        this.decorateStatusesFilter(filters);
    }

    private decorateDateFromFilter(filter: EventsFilter): void {
        const dateFrom = this.urlParamHandler.getParam(EventListQueryParams.dateFrom);
        if (isNil(dateFrom)) {
            return;
        }
        filter.dateFrom = new Date(dateFrom);
    }

    private decorateDateToFilter(filter: EventsFilter): void {
        const dateTo = this.urlParamHandler.getParam(EventListQueryParams.dateTo);
        if (isNil(dateTo)) {
            return;
        }
        filter.dateTo = new Date(dateTo);
    }

    private decorateParticipantFilter(filter: EventsFilter): void {
        const participantIds = this.urlParamHandler.getParams(EventListQueryParams.participantIds);
        if (isNilOrEmpty(participantIds)) {
            return;
        }
        filter.participantIds = participantIds!;
    }

    private decorateDepartmentFilter(filter: EventsFilter): void {
        const departmentIds = this.urlParamHandler.getParams(EventListQueryParams.departmentIds);
        if (isNilOrEmpty(departmentIds)) {
            return;
        }
        filter.departmentIds = departmentIds!;
    }

    private decorateStatusesFilter(filter: EventsFilter): void {
        const statuses = this.urlParamHandler.getParams(EventListQueryParams.statuses);
        if (isNilOrEmpty(statuses)) {
            return;
        }
        filter.statuses = statuses! as Array<HospitalVisitStatus>;
    }

    private decorateHighLight(preferences: EventsListPreferences): void {
        const needHighlight = this.urlParamHandler.getParam(EventListQueryParams.highlight);
        if (isNil(needHighlight)) {
            return;
        }
        preferences.needHighlight = (needHighlight.toLowerCase() === 'true');
    }

    private decoratePageNumber(pageInfo: PageInfo): void {
        const page = this.urlParamHandler.getNumberParam(PAGE_QUERY_KEY);
        if (isNil(page)) {
            return;
        }
        pageInfo.page = page;
    }

    private decoratePageSize(pageInfo: PageInfo): void {
        const size = this.urlParamHandler.getNumberParam(PAGE_SIZE_QUERY_KEY);
        if (isNil(size)) {
            return;
        }
        pageInfo.size = size;
    }

}
