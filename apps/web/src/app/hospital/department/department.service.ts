import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    Department,
    DepartmentCreation,
    PAGE_QUERY_KEY,
    PAGE_SIZE_QUERY_KEY,
    Pageable,
    PageQuery, UUID
} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/error/error-handler';
import {MessageService} from '@fe/app/util/message.service';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class DepartmentService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get departmentUrl(): string {
        return `${environment.baseURL}/departments`;
    }

    public saveDepartment(data: DepartmentCreation | Department): Observable<Department> {
        if ('id' in data) {
            return this.updateDepartment(data.id, data);
        }
        return this.addDepartment(data);
    }

    public addDepartment(data: DepartmentCreation): Observable<Department> {
        return this.http.post<Department>(this.departmentUrl, data)
            .pipe(getErrorHandler<Department>(this.msg));
    }

    public getDepartment(departmentId: UUID): Observable<Department> {
        return this.http.get<Department>(`${this.departmentUrl}/${departmentId}`)
            .pipe(getErrorHandler<Department>(this.msg));
    }

    public updateDepartment(departmentId: UUID, data: Department): Observable<Department> {
        return this.http.put<Department>(`${this.departmentUrl}/${departmentId}`, data)
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
