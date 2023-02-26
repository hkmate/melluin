import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@fe/environment';
import {Observable} from 'rxjs';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {utf8ToBase64} from '@fe/app/util/util';
import {MelluinEvent} from '@shared/event/event';


@Injectable({providedIn: 'root'})
export class EventsService {

    constructor(private readonly http: HttpClient) {
    }

    private get eventsUrl(): string {
        return `${environment.baseURL}/events`;
    }

    public findEvents(filters: PageQuery): Observable<Pageable<MelluinEvent>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<MelluinEvent>>(this.eventsUrl, {
            params: {
                [PAGE_QUERY_KEY]: filters.page,
                [PAGE_SIZE_QUERY_KEY]: filters.size,
                [QUERY_QUERY_KEY]: this.preparePageRequest({sort: filters.sort, where: filters.where})
            }
        });
    }

    private preparePageRequest(pageRequest: Partial<PageQuery>): string {
        return utf8ToBase64(JSON.stringify(pageRequest));
    }

}
