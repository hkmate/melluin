import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {RolePermission} from '@shared/user/role.enum';

@Injectable({providedIn: 'root'})
export class RoleService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private get rolesUrl(): string {
        return `${AppConfig.get('baseURL')}/roles`;
    }

    public getAll(): Observable<Array<RolePermission>> {
        return this.http.get<Array<RolePermission>>(`${this.rolesUrl}`)
            .pipe(getErrorHandler<Array<RolePermission>>(this.msg));
    }

    public update(data: RolePermission): Observable<RolePermission> {
        return this.http.put<RolePermission>(`${this.rolesUrl}/${data.role}`, data)
            .pipe(getErrorHandler<RolePermission>(this.msg));
    }

}
