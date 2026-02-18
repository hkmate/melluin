import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    Department,
    DepartmentCreation,
    DepartmentUpdateChangeSet,
    PAGE_QUERY_KEY,
    PAGE_SIZE_QUERY_KEY,
    Pageable,
    PageQuery
} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/util';
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
        return this.http.post<Pageable<Department>>(`${this.departmentUrl}/:list`,
            {sort: filters.sort, where: filters.where},
            {
                params: {
                    [PAGE_QUERY_KEY]: filters.page,
                    [PAGE_SIZE_QUERY_KEY]: filters.size
                }
            })
            .pipe(getErrorHandler<Pageable<Department>>(this.msg));
    }

}
