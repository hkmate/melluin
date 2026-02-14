import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {getErrorHandler, utf8ToBase64} from '@fe/app/util/util';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {ContinueVisitInfo} from '@fe/app/hospital/visit/model/continue-visit-info';

@Injectable({providedIn: 'root'})
export class HospitalVisitService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get hospitalVisitUrl(): string {
        return `${AppConfig.get('baseURL')}/hospital-visits`;
    }

    public addVisit(data: HospitalVisitCreate, options = {forceSameTimeVisit: false}): Observable<HospitalVisit> {
        const params = {} as Record<string, string | boolean>;
        if (options.forceSameTimeVisit) {
            params.forceSameTime = true;
        }
        return this.http.post<HospitalVisit>(this.hospitalVisitUrl, data, {params});
    }

    public getVisit(visitId: string): Observable<HospitalVisit> {
        return this.http.get<HospitalVisit>(`${this.hospitalVisitUrl}/${visitId}`);
    }

    public continueVisit(visitId: string, info: ContinueVisitInfo): Observable<HospitalVisit> {
        const params = {
            departmentId: info.departmentId,
            from: info.dateTimeFrom,
        };
        return this.http.post<HospitalVisit>(`${this.hospitalVisitUrl}/${visitId}/continue`, {}, {params})
            .pipe(getErrorHandler<HospitalVisit>(this.msg));
    }

    public updateVisit(visitId: string, data: HospitalVisitRewrite, options = {forceSameTimeVisit: false}): Observable<HospitalVisit> {
        const params = {} as Record<string, string | boolean>;
        if (options.forceSameTimeVisit) {
            params.forceSameTime = true;
        }
        return this.http.put<HospitalVisit>(`${this.hospitalVisitUrl}/${visitId}`, data, {params});
    }

    public findVisit(filters: PageQuery): Observable<Pageable<HospitalVisit>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<HospitalVisit>>(this.hospitalVisitUrl, {
            params: {
                [PAGE_QUERY_KEY]: filters.page,
                [PAGE_SIZE_QUERY_KEY]: filters.size,
                [QUERY_QUERY_KEY]: this.preparePageRequest({sort: filters.sort, where: filters.where})
            }
        }).pipe(getErrorHandler<Pageable<HospitalVisit>>(this.msg));
    }

    private preparePageRequest(pageRequest: Partial<PageQuery>): string {
        return utf8ToBase64(JSON.stringify(pageRequest));
    }

}
