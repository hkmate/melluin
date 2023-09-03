import {Injectable} from '@angular/core';
import {JwtService} from './jwt.service';
import {User} from '@shared/user/user';
import {isNilOrEmpty} from '@shared/util/util';
import {AuthToken} from '@shared/user/auth-token';
import {Store} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {DateUtil} from '@shared/util/date-util';

@Injectable()
export class CredentialStoreService {

    private static readonly AUTH_TOKEN_KEY = 'authToken';
    private static readonly USER_KEY_IN_TOKEN = 'user';
    private static readonly EXPIRATION_KEY_IN_TOKEN = 'exp';

    private currentUser?: User;
    private authToken?: string;

    constructor(private readonly store: Store,
                private readonly jwtService: JwtService) {
    }

    public init(): void {
        this.initCurrentUserFromStorage();
    }

    public getToken(): string | undefined {
        return this.authToken;
    }

    public getUser(): User | undefined {
        return this.currentUser;
    }

    public clear(): void {
        this.currentUser = undefined;
        this.authToken = undefined;
        localStorage.clear();
        this.store.dispatch(AppActions.userLogout());
    }

    public useToken(token: AuthToken): void {
        this.clear();
        this.authToken = token.access_token;
        this.setupUser(this.getUserFromToken(token));
        this.storeToken(token.access_token);
    }

    private storeToken(accessToken: string): void {
        this.authToken = accessToken;
        localStorage.setItem(CredentialStoreService.AUTH_TOKEN_KEY, accessToken);
    }

    private setupUser(user: User): void {
        this.currentUser = user;
        this.store.dispatch(AppActions.currentUserLoaded({user}));
    }

    private initCurrentUserFromStorage(): void {
        const tokenRaw: string | null = localStorage.getItem(CredentialStoreService.AUTH_TOKEN_KEY);
        if (isNilOrEmpty(tokenRaw)) {
            return;
        }
        if (this.isTokenExpired(tokenRaw!)) {
            return;
        }
        this.useToken({access_token: tokenRaw!});
    }

    private getUserFromToken(token: AuthToken): User {
        return this.jwtService.decodeToken(token.access_token)[CredentialStoreService.USER_KEY_IN_TOKEN];
    }

    private isTokenExpired(accessToken: string): boolean {
        const expTimestamp = this.jwtService.decodeToken(accessToken)[CredentialStoreService.EXPIRATION_KEY_IN_TOKEN];
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return (expTimestamp * 1000) < DateUtil.now().getTime();
        // Note: *1000 needs because exp is epoch seconds and Date uses ms.
    }

}
