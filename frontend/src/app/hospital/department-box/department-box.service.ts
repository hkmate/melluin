import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@fe/environment';
import {Observable} from 'rxjs';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {utf8ToBase64} from '@fe/app/util/util';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';

@Injectable({providedIn: 'root'})
export class DepartmentBoxService {

    constructor(private readonly http: HttpClient) {
    }

    private getDepartmentBoxUrl(departmentId): string {
        return `${environment.baseURL}/departments/${departmentId}/box-status`;
    }

    public addBoxStatus(departmentId: string, data: DepartmentBoxStatusReport): Observable<DepartmentBoxStatus> {
        return this.http.post<DepartmentBoxStatus>(this.getDepartmentBoxUrl(departmentId), data);
    }

    public findBoxStatuses(departmentId: string, filters: PageQuery): Observable<Pageable<DepartmentBoxStatus>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<DepartmentBoxStatus>>(this.getDepartmentBoxUrl(departmentId), {
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
