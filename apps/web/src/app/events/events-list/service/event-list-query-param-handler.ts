import {inject, Injectable} from '@angular/core';
import {EventsListPreferences} from '@fe/app/events/events-list/service/events-list-preferences';
import {EventsFilter} from '@fe/app/events/events-list/service/events-filter';
import {QueryParams, UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {EventListQueryParams} from '@fe/app/events/events-list/service/event-list-query-params';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, PageInfo} from '@shared/api-util/pageable';
import {filter, map, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {VoidNOOP} from '@shared/util/util';


@Injectable()
export class EventListQueryParamHandler {

    private readonly route = inject(ActivatedRoute);
    private readonly urlParamHandler = inject(UrlParamHandler);

    /*
     Note: This needed because when we set query params the router will trigger an event and the route.queryParams
     observable will be triggered also. We manually set the params, so we don't want to reload the settings from
     query params. Because of this we skip this changing event.
     */
    private skipNextParamChangeEvent = false;

    public onChange(): Observable<void> {
        return this.route.queryParams.pipe(
            filter(() => {
                if (this.skipNextParamChangeEvent) {
                    this.skipNextParamChangeEvent = false;
                    return false;
                }
                return true;
            }),
            map(VoidNOOP)
        );
    }

    public saveSettings(filter?: EventsFilter, preferences?: EventsListPreferences, pageInfo?: PageInfo): void {
        this.skipNextParamChangeEvent = true;
        const params: QueryParams = {
            [PAGE_QUERY_KEY]: pageInfo?.page + '',
            [PAGE_SIZE_QUERY_KEY]: pageInfo?.size + '',
            [EventListQueryParams.dateFrom]: filter?.dateFromStr,
            [EventListQueryParams.dateTo]: filter?.dateToStr,
            [EventListQueryParams.participantIds]: filter?.participantIds,
            [EventListQueryParams.departmentIds]: filter?.departmentIds,
            [EventListQueryParams.statuses]: filter?.statuses,
            [EventListQueryParams.highlight]: preferences?.needHighlight + ''
        };

        this.urlParamHandler.setParams(params);
    }

}
