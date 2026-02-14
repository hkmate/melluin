import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';
import {RoleBrief} from '@shared/user/role';
import {isNil} from '@shared/util/util';

@Injectable({providedIn: 'root'})
export class GetRolesService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private cache?: Array<RoleBrief> = undefined;

    private get rolesUrl(): string {
        return `${AppConfig.get('baseURL')}/roles/:brief`;
    }

    public getAll(): Observable<Array<RoleBrief>> {
        if (isNil(this.cache)) {
            return this.http.get<Array<RoleBrief>>(`${this.rolesUrl}`)
                .pipe(
                    getErrorHandler<Array<RoleBrief>>(this.msg),
                    tap(roles => this.saveRoles(roles))
                );
        }
        return of([...this.cache]);
    }

    private saveRoles(roles: Array<RoleBrief>): void {
        this.cache = roles;
    }

}
