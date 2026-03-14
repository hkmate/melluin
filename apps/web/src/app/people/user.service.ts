import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, UserCreation, UserRewrite, UserSettings, UUID} from '@melluin/common';
import {getErrorHandler} from '@fe/app/util/error/error-handler';
import {MessageService} from '@fe/app/util/message.service';
import {environment} from '@fe/environment';

@Injectable()
export class UserService {

    private readonly http = inject(HttpClient);
    private readonly msg = inject(MessageService);

    private get userUrl(): string {
        return `${environment.baseURL}/users`;
    }

    public addUser(data: UserCreation): Observable<User> {
        return this.http.post<User>(this.userUrl, data)
            .pipe(getErrorHandler<User>(this.msg));
    }

    public get(userId: UUID): Observable<User> {
        return this.http.get<User>(`${this.userUrl}/${userId}`)
            .pipe(getErrorHandler<User>(this.msg));
    }

    public getSettings(userId: UUID): Observable<UserSettings> {
        return this.http.get<UserSettings>(`${this.userUrl}/${userId}/settings`)
            .pipe(getErrorHandler<UserSettings>(this.msg));
    }

    public updateUser(userId: UUID, data: UserRewrite): Observable<User> {
        return this.http.put<User>(`${this.userUrl}/${userId}`, data)
            .pipe(getErrorHandler<User>(this.msg));
    }

    public updateUserSettings(userId: UUID, data: UserSettings): Observable<UserSettings> {
        return this.http.put<UserSettings>(`${this.userUrl}/${userId}/settings`, data)
            .pipe(getErrorHandler<UserSettings>(this.msg));
    }

}
