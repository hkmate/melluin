import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserCreation} from '@shared/user/user-creation';
import {User, UserSettings} from '@shared/user/user';
import {UserRewrite} from '@shared/user/user-rewrite';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {AppConfig} from '@fe/app/config/app-config';

@Injectable({providedIn: 'root'})
export class UserService {

    constructor(private readonly http: HttpClient,
                private readonly msg: MessageService) {
    }

    private get userUrl(): string {
        return `${AppConfig.get('baseURL')}/users`;
    }

    public addUser(data: UserCreation): Observable<User> {
        return this.http.post<User>(this.userUrl, data)
            .pipe(getErrorHandler<User>(this.msg));
    }

    public get(userId: string): Observable<User> {
        return this.http.get<User>(`${this.userUrl}/${userId}`)
            .pipe(getErrorHandler<User>(this.msg));
    }

    public getSettings(userId: string): Observable<UserSettings> {
        return this.http.get<UserSettings>(`${this.userUrl}/${userId}/settings`)
            .pipe(getErrorHandler<UserSettings>(this.msg));
    }

    public updateUser(userId: string, data: UserRewrite): Observable<User> {
        return this.http.put<User>(`${this.userUrl}/${userId}`, data)
            .pipe(getErrorHandler<User>(this.msg));
    }

    public updateUserSettings(userId: string, data: UserSettings): Observable<UserSettings> {
        return this.http.put<UserSettings>(`${this.userUrl}/${userId}/settings`, data)
            .pipe(getErrorHandler<UserSettings>(this.msg));
    }

}
