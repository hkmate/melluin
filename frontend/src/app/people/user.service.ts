import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@fe/environment';
import {UserCreation} from '@shared/user/user-creation';
import {User} from '@shared/user/user';
import {UserRewrite} from '@shared/user/user-rewrite';

@Injectable({providedIn: 'root'})
export class UserService {

    constructor(private readonly http: HttpClient) {
    }

    private get userUrl(): string {
        return `${environment.baseURL}/users`;
    }

    public addUser(data: UserCreation): Observable<User> {
        return this.http.post<User>(this.userUrl, data);
    }

    public get(userId: string): Observable<User> {
        return this.http.get<User>(`${this.userUrl}/${userId}`);
    }

    public updateUser(userId: string, data: UserRewrite): Observable<User> {
        return this.http.put<User>(`${this.userUrl}/${userId}`, data);
    }

}
