import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {getErrorHandler, utf8ToBase64} from '@fe/app/util/util';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {BoxStatusWithDepartmentBrief, DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';

@Injectable({providedIn: 'root'})
export class DepartmentBoxService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private getDepartmentBoxByDepartmentUrl(departmentId: string): string {
        return `${AppConfig.get('baseURL')}/departments/${departmentId}/box-status`;
    }

    private getDepartmentBoxByVisitUrl(visitId: string): string {
        return `${AppConfig.get('baseURL')}/hospital-visits/${visitId}/box-status`;
    }

    private getDepartmentBoxUrl(): string {
        return `${AppConfig.get('baseURL')}/departments-box-status`;
    }

    public addBoxStatus(departmentId: string, data: DepartmentBoxStatusReport): Observable<DepartmentBoxStatus> {
        return this.http.post<DepartmentBoxStatus>(this.getDepartmentBoxByDepartmentUrl(departmentId), data)
            .pipe(getErrorHandler<DepartmentBoxStatus>(this.msg));
    }

    public findBoxStatusesByDepartment(departmentId: string, filters: PageQuery): Observable<Pageable<DepartmentBoxStatus>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<DepartmentBoxStatus>>(this.getDepartmentBoxByDepartmentUrl(departmentId), {
            params: {
                [PAGE_QUERY_KEY]: filters.page,
                [PAGE_SIZE_QUERY_KEY]: filters.size,
                [QUERY_QUERY_KEY]: this.preparePageRequest({sort: filters.sort, where: filters.where})
            }
        })
            .pipe(getErrorHandler<Pageable<DepartmentBoxStatus>>(this.msg));
    }

    public findBoxStatuses(filters: PageQuery): Observable<Pageable<BoxStatusWithDepartmentBrief>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<BoxStatusWithDepartmentBrief>>(this.getDepartmentBoxUrl(), {
            params: {
                withDepartmentBrief: true,
                [PAGE_QUERY_KEY]: filters.page,
                [PAGE_SIZE_QUERY_KEY]: filters.size,
                [QUERY_QUERY_KEY]: this.preparePageRequest({sort: filters.sort, where: filters.where})
            }
        })
            .pipe(getErrorHandler<Pageable<BoxStatusWithDepartmentBrief>>(this.msg));
    }

    public findBoxStatusesByVisit(visitId: string): Observable<Array<DepartmentBoxStatus>> {
        return this.http.get<Array<DepartmentBoxStatus>>(this.getDepartmentBoxByVisitUrl(visitId))
            .pipe(getErrorHandler<Array<DepartmentBoxStatus>>(this.msg));
    }

    private preparePageRequest(pageRequest: Partial<PageQuery>): string {
        return utf8ToBase64(JSON.stringify(pageRequest));
    }

}
