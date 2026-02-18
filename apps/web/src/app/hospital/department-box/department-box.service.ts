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
    PageQuery
} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';

@Injectable({providedIn: 'root'})
export class DepartmentBoxService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getDepartmentBoxByDepartmentUrl(departmentId: string): string {
        return `${AppConfig.get('baseURL')}/departments/${departmentId}/box-status`;
    }

    private getDepartmentBoxListByDepartmentUrl(departmentId: string): string {
        return `${AppConfig.get('baseURL')}/departments/${departmentId}/box-status/:list`;
    }

    private getDepartmentBoxByVisitUrl(visitId: string): string {
        return `${AppConfig.get('baseURL')}/visits/${visitId}/box-status`;
    }

    private getDepartmentBoxUrl(): string {
        return `${AppConfig.get('baseURL')}/departments-box-status/:list`;
    }

    public addBoxStatus(departmentId: string, data: DepartmentBoxStatusReport): Observable<DepartmentBoxStatus> {
        return this.http.post<DepartmentBoxStatus>(this.getDepartmentBoxByDepartmentUrl(departmentId), data)
            .pipe(getErrorHandler<DepartmentBoxStatus>(this.msg));
    }

    public findBoxStatusesByDepartment(departmentId: string, filters: PageQuery): Observable<Pageable<DepartmentBoxStatus>> {
        return this.http.post<Pageable<DepartmentBoxStatus>>(this.getDepartmentBoxListByDepartmentUrl(departmentId), {
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
        return this.http.post<Pageable<BoxStatusWithDepartmentBrief>>(this.getDepartmentBoxUrl(), {
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

    public findBoxStatusesByVisit(visitId: string): Observable<Array<DepartmentBoxStatus>> {
        return this.http.get<Array<DepartmentBoxStatus>>(this.getDepartmentBoxByVisitUrl(visitId))
            .pipe(getErrorHandler<Array<DepartmentBoxStatus>>(this.msg));
    }

}
