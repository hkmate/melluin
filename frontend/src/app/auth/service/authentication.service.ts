import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {AuthToken} from '../model/auth-token';
import {isNilOrEmpty, isNotNil} from '../../util/util';
import {User} from '../model/user';
import {environment} from '../../../environment';
import {JwtService} from './jwt.service';

@Injectable()
export class AuthenticationService {

    private static readonly CURRENT_USER_KEY = 'currentUser';
    private static readonly AUTH_TOKEN_KEY = 'authToken';
    private static readonly USER_KEY_IN_TOKEN = 'user';

    private readonly _currentUser: Observable<User | null>;
    private readonly currentUserSubject: BehaviorSubject<User | null>;
    private authToken: string | null;

    constructor(private readonly http: HttpClient,
                private readonly jwtService: JwtService) {
        this.currentUserSubject = new BehaviorSubject<User | null>(this.loadCurrentUserFromStorage());
        this._currentUser = this.currentUserSubject.asObservable();

        this.authToken = localStorage.getItem(AuthenticationService.AUTH_TOKEN_KEY) ?? null;
    }

    public get token(): string | null {
        return this.authToken;
    }

    public get currentUser(): Observable<User | null> {
        return this._currentUser;
    }

    private get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public hasAuthenticatedUser(): boolean {
        return isNotNil(this.currentUserValue);
    }

    public login(username: string, password: string): Observable<User> {
        const authBody = {username, password};

        return this.http.post<AuthToken>(`${environment.baseURL}/auth/login`, authBody)
            .pipe(map(
                (token: AuthToken): User => {
                    this.storeToken(token);
                    const user: User = this.getUserFromToken(token);
                    this.storeCurrentUser(user);
                    return user;
                }
            ));
    }

    private storeToken(token: AuthToken): void {
        this.authToken = token.access_token;
        localStorage.setItem(AuthenticationService.AUTH_TOKEN_KEY, token.access_token);
    }

    private storeCurrentUser(user: User): void {
        localStorage.setItem(AuthenticationService.CURRENT_USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private loadCurrentUserFromStorage(): User | null {
        const currentUserRaw: string | null = localStorage.getItem(AuthenticationService.CURRENT_USER_KEY);
        if (isNilOrEmpty(currentUserRaw)) {
            return null;
        }
        return JSON.parse(currentUserRaw!);
    }

    private getUserFromToken(token: AuthToken): User {
        return this.jwtService.decodeToken(token.access_token)[AuthenticationService.USER_KEY_IN_TOKEN];
    }

}
