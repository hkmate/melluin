import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {Department} from '@shared/department/department';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {getErrorHandler, utf8ToBase64} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';

@Injectable({providedIn: 'root'})
export class DepartmentService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get departmentUrl(): string {
        return `${AppConfig.get('baseURL')}/departments`;
    }

    public addDepartment(data: DepartmentCreation): Observable<Department> {
        return this.http.post<Department>(this.departmentUrl, data)
            .pipe(getErrorHandler<Department>(this.msg));
    }

    public getDepartment(departmentId: string): Observable<Department> {
        return this.http.get<Department>(`${this.departmentUrl}/${departmentId}`)
            .pipe(getErrorHandler<Department>(this.msg));
    }

    public updateDepartment(departmentId: string, data: DepartmentUpdateChangeSet): Observable<Department> {
        return this.http.patch<Department>(`${this.departmentUrl}/${departmentId}`, data)
            .pipe(getErrorHandler<Department>(this.msg));
    }

    public findDepartments(filters: PageQuery): Observable<Pageable<Department>> {
        // TODO: remove debug when we'll use query expressions instead of base64 encoded json.
        console.debug('PageRequest to send: ', filters);
        return this.http.get<Pageable<Department>>(this.departmentUrl, {
            params: {
                [PAGE_QUERY_KEY]: filters.page,
                [PAGE_SIZE_QUERY_KEY]: filters.size,
                [QUERY_QUERY_KEY]: this.preparePageRequest({sort: filters.sort, where: filters.where})
            }
        })
            .pipe(getErrorHandler<Pageable<Department>>(this.msg));
    }

    private preparePageRequest(pageRequest: Partial<PageQuery>): string {
        return utf8ToBase64(JSON.stringify(pageRequest));
    }

}
