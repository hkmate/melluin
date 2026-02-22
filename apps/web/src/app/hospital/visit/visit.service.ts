import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    PAGE_QUERY_KEY,
    PAGE_SIZE_QUERY_KEY,
    Pageable,
    PageQuery,
    Visit,
    VisitCreate,
    VisitRewrite
} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {ContinueVisitInfo} from '@fe/app/hospital/visit/model/continue-visit-info';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class VisitService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get visitUrl(): string {
        return `${environment.baseURL}/visits`;
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
        return this.http.post<Pageable<Visit>>(`${this.visitUrl}/:list`,
            {sort: filters.sort, where: filters.where},
            {
                params: {
                    [PAGE_QUERY_KEY]: filters.page,
                    [PAGE_SIZE_QUERY_KEY]: filters.size,
                }
            }).pipe(getErrorHandler<Pageable<Visit>>(this.msg));
    }

}
