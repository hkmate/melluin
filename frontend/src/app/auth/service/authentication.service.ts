import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {JwtService} from './jwt.service';
import {User} from '@shared/user/user';
import {isNilOrEmpty, isNotNil} from '@shared/util/util';
import {AuthToken} from '@shared/user/auth-token';
import {Router} from '@angular/router';
import {PATHS} from '@fe/app/app-paths';
import {AppConfig} from '@fe/app/config/app-config';
import {Store} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';

@Injectable()
export class AuthenticationService {

    private static readonly CURRENT_USER_KEY = 'currentUser';
    private static readonly AUTH_TOKEN_KEY = 'authToken';
    private static readonly USER_KEY_IN_TOKEN = 'user';

    private currentUser?: User;
    private authToken?: string;

    constructor(private readonly http: HttpClient,
                private readonly router: Router,
                private readonly store: Store,
                private readonly jwtService: JwtService) {
        this.initCurrentUserFromStorage();
        this.authToken = localStorage.getItem(AuthenticationService.AUTH_TOKEN_KEY) ?? undefined;
    }

    public get token(): string | undefined {
        return this.authToken;
    }

    public hasAuthenticatedUser(): boolean {
        return isNotNil(this.currentUser);
    }

    public login(username: string, password: string): Observable<User> {
        const authBody = {username, password};

        return this.http.post<AuthToken>(`${AppConfig.get('baseURL')}/auth/login`, authBody)
            .pipe(map(
                (token: AuthToken): User => {
                    this.storeToken(token);
                    const user: User = this.getUserFromToken(token);
                    this.storeCurrentUser(user);
                    return user;
                }
            ));
    }

    public logout(): void {
        this.clearStorage();
        this.authToken = undefined;
        this.currentUser = undefined;
        this.store.dispatch(AppActions.userLogout());
        this.router.navigate([PATHS.login.main]);
    }

    private storeToken(token: AuthToken): void {
        this.authToken = token.access_token;
        localStorage.setItem(AuthenticationService.AUTH_TOKEN_KEY, token.access_token);
    }

    private storeCurrentUser(user: User): void {
        this.currentUser = user;
        localStorage.setItem(AuthenticationService.CURRENT_USER_KEY, JSON.stringify(user));
        this.store.dispatch(AppActions.currentUserLoaded({user}));
    }

    private initCurrentUserFromStorage(): void {
        const currentUserRaw: string | null = localStorage.getItem(AuthenticationService.CURRENT_USER_KEY);
        if (isNilOrEmpty(currentUserRaw)) {
            return;
        }
        const user: User = JSON.parse(currentUserRaw!);
        this.store.dispatch(AppActions.currentUserLoaded({user}));
    }

    private getUserFromToken(token: AuthToken): User {
        return this.jwtService.decodeToken(token.access_token)[AuthenticationService.USER_KEY_IN_TOKEN];
    }

    private clearStorage(): void {
        localStorage.clear();
    }

}
