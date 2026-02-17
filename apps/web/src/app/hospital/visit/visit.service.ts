import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    Visit,
    VisitCreate,
    VisitRewrite,
    PAGE_QUERY_KEY,
    PAGE_SIZE_QUERY_KEY,
    Pageable,
    PageQuery,
    QUERY_QUERY_KEY
} from '@melluin/common';
import {getErrorHandler, utf8ToBase64} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {ContinueVisitInfo} from '@fe/app/hospital/visit/model/continue-visit-info';

@Injectable({providedIn: 'root'})
export class VisitService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get visitUrl(): string {
        return `${AppConfig.get('baseURL')}/visits`;
    }

    public addVisit(data: VisitCreate, options = {forceSameTimeVisit: false}): Observable<Visit> {
        const params = {} as Record<string, string | boolean>;
        if (options.forceSameTimeVisit) {
            params.forceSameTime = true;
        }
        return this.http.post<Visit>(this.visitUrl, data, {params});
    }

    public getVisit(visitId: string): Observable<Visit> {
        return this.http.get<Visit>(`${this.visitUrl}/${visitId}`);
    }

    public continueVisit(visitId: string, info: ContinueVisitInfo): Observable<Visit> {
        const params = {
            departmentId: info.departmentId,
            from: info.dateTimeFrom,
        };
        return this.http.post<Visit>(`${this.visitUrl}/${visitId}/continue`, {}, {params})
            .pipe(getErrorHandler<Visit>(this.msg));
    }

    public updateVisit(visitId: string, data: VisitRewrite, options = {forceSameTimeVisit: false}): Observable<Visit> {
        const params = {} as Record<string, string | boolean>;
        if (options.forceSameTimeVisit) {
            params.forceSameTime = true;
        }
        return this.http.put<Visit>(`${this.visitUrl}/${visitId}`, data, {params});
    }

    public findVisit(filters: PageQuery): Observable<Pageable<Visit>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<Visit>>(this.visitUrl, {
            params: {
                [PAGE_QUERY_KEY]: filters.page,
                [PAGE_SIZE_QUERY_KEY]: filters.size,
                [QUERY_QUERY_KEY]: this.preparePageRequest({sort: filters.sort, where: filters.where})
            }
        }).pipe(getErrorHandler<Pageable<Visit>>(this.msg));
    }

    private preparePageRequest(pageRequest: Partial<PageQuery>): string {
        return utf8ToBase64(JSON.stringify(pageRequest));
    }

}
