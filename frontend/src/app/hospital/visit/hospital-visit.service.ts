import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {getErrorHandler, utf8ToBase64} from '@fe/app/util/util';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';

@Injectable({providedIn: 'root'})
export class HospitalVisitService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private get hospitalVisitUrl(): string {
        return `${AppConfig.get('baseURL')}/hospital-visits`;
    }

    public addVisit(data: HospitalVisitCreate): Observable<HospitalVisit> {
        return this.http.post<HospitalVisit>(this.hospitalVisitUrl, data)
            .pipe(getErrorHandler<HospitalVisit>(this.msg));
    }

    public getVisit(visitId: string): Observable<HospitalVisit> {
        return this.http.get<HospitalVisit>(`${this.hospitalVisitUrl}/${visitId}`);
    }

    public updateVisit(visitId: string, data: HospitalVisitRewrite): Observable<HospitalVisit> {
        return this.http.put<HospitalVisit>(`${this.hospitalVisitUrl}/${visitId}`, data)
            .pipe(getErrorHandler<HospitalVisit>(this.msg));
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
