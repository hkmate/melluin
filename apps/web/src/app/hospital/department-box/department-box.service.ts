import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    BoxStatusWithDepartmentBrief,
    DepartmentBoxStatus,
    DepartmentBoxStatusReport,
    PAGE_QUERY_KEY,
    PAGE_SIZE_QUERY_KEY,
    Pageable,
    PageQuery, UUID
} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {environment} from '@fe/environment';

@Injectable()
export class DepartmentBoxService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    public addBoxStatus(departmentId: UUID, data: DepartmentBoxStatusReport): Observable<DepartmentBoxStatus> {
        return this.http
            .post<DepartmentBoxStatus>(`${environment.baseURL}/departments/${departmentId}/box-status`, data)
            .pipe(getErrorHandler<DepartmentBoxStatus>(this.msg));
    }

    public findBoxStatusesByDepartment(departmentId: UUID, filters: PageQuery): Observable<Pageable<DepartmentBoxStatus>> {
        return this.http.post<Pageable<DepartmentBoxStatus>>(
            `${environment.baseURL}/departments/${departmentId}/box-status/:list`, {
                sort: filters.sort,
                where: filters.where
            }, {
                params: {
                    [PAGE_QUERY_KEY]: filters.page,
                    [PAGE_SIZE_QUERY_KEY]: filters.size,
                }
            })
            .pipe(getErrorHandler<Pageable<DepartmentBoxStatus>>(this.msg));
    }

    public findBoxStatuses(filters: PageQuery): Observable<Pageable<BoxStatusWithDepartmentBrief>> {
        return this.http.post<Pageable<BoxStatusWithDepartmentBrief>>(
            `${environment.baseURL}/departments-box-status/:list`, {
                sort: filters.sort,
                where: filters.where
            },
            {
                params: {
                    withDepartmentBrief: true,
                    [PAGE_QUERY_KEY]: filters.page,
                    [PAGE_SIZE_QUERY_KEY]: filters.size,
                }
            })
            .pipe(getErrorHandler<Pageable<BoxStatusWithDepartmentBrief>>(this.msg));
    }

    public findBoxStatusesByVisit(visitId: UUID): Observable<Array<DepartmentBoxStatus>> {
        return this.http.get<Array<DepartmentBoxStatus>>(`${environment.baseURL}/visits/${visitId}/box-status`)
            .pipe(getErrorHandler<Array<DepartmentBoxStatus>>(this.msg));
    }

}
