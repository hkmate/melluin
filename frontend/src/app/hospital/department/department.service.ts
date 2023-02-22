import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@fe/environment';
import {Observable} from 'rxjs';
import {PAGE_QUERY_KEY, PAGE_SIZE_QUERY_KEY, Pageable, PageQuery, QUERY_QUERY_KEY} from '@shared/api-util/pageable';
import {Department} from '@shared/department/department';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';

@Injectable({providedIn: 'root'})
export class DepartmentService {

    constructor(private readonly http: HttpClient) {
    }

    private get departmentUrl(): string {
        return `${environment.baseURL}/departments`;
    }

    public addPerson(data: DepartmentCreation): Observable<Department> {
        return this.http.post<Department>(this.departmentUrl, data);
    }

    public getDepartment(departmentId: string): Observable<Department> {
        return this.http.get<Department>(`${this.departmentUrl}/${departmentId}`);
    }

    public updatePerson(departmentId: string, data: DepartmentUpdateChangeSet): Observable<Department> {
        return this.http.patch<Department>(`${this.departmentUrl}/${departmentId}`, data);
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
        });
    }

    private preparePageRequest(pageRequest: Partial<PageQuery>): string {
        return btoa(JSON.stringify(pageRequest));
    }

}
