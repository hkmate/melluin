import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {Role, RoleCreation} from '@shared/user/role';

@Injectable({providedIn: 'root'})
export class RoleService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private get rolesUrl(): string {
        return `${AppConfig.get('baseURL')}/roles`;
    }

    public getAll(): Observable<Array<Role>> {
        return this.http.get<Array<Role>>(`${this.rolesUrl}`)
            .pipe(getErrorHandler<Array<Role>>(this.msg));
    }

    public create(data: RoleCreation): Observable<Role> {
        return this.http.post<Role>(`${this.rolesUrl}`, data)
            .pipe(getErrorHandler<Role>(this.msg));
    }

    public update(data: Role): Observable<Role> {
        return this.http.put<Role>(`${this.rolesUrl}/${data.id}`, data)
            .pipe(getErrorHandler<Role>(this.msg));
    }

    public delete(roleId: string): Observable<void> {
        return this.http.delete<void>(`${this.rolesUrl}/${roleId}`)
            .pipe(getErrorHandler<void>(this.msg));
    }

}
