import {inject, Injectable} from '@angular/core';
import {QueryParams, UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, PageInfo} from '@shared/api-util/pageable';
import {filter, map, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {emptyToUndef, VoidNOOP} from '@shared/util/util';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {PeopleListQueryParams} from '@fe/app/people/people-list/people-list-filter/service/people-list-query-params';


@Injectable()
export class PeopleListQueryParamHandler {

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

    public saveSettings(filter?: PeopleFilter, pageInfo?: PageInfo): void {
        this.skipNextParamChangeEvent = true;
        const params: QueryParams = {
            [PAGE_QUERY_KEY]: pageInfo?.page + '',
            [PAGE_SIZE_QUERY_KEY]: pageInfo?.size + '',
            [PeopleListQueryParams.name]: emptyToUndef(filter?.name),
            [PeopleListQueryParams.email]: emptyToUndef(filter?.email),
            [PeopleListQueryParams.phone]: emptyToUndef(filter?.phone),
            [PeopleListQueryParams.onlyActive]: (filter?.onlyActive ? 'true' : undefined),
            [PeopleListQueryParams.role]: emptyToUndef(filter?.roleNames),
            [PeopleListQueryParams.city]: emptyToUndef(filter?.cities),
        };

        this.urlParamHandler.setParams(params);
    }

}
