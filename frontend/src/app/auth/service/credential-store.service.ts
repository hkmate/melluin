import {Injectable} from '@angular/core';
import {JwtService} from './jwt.service';
import {User} from '@shared/user/user';
import {isNilOrEmpty} from '@shared/util/util';
import {AuthInfo} from '@shared/user/auth-info';
import {Store} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {DateUtil} from '@shared/util/date-util';
import {UserSettings} from '@shared/user/user-settings';

@Injectable()
export class CredentialStoreService {

    private static readonly AUTH_TOKEN_KEY = 'authToken';
    private static readonly USER_KEY = 'user';
    private static readonly USER_SETTINGS_KEY = 'userSettings';
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

    public useToken(token: AuthInfo): void {
        this.clear();
        this.storeToken(token.accessToken);
        this.setupUser(token.user);
        this.setupUserSettings(token.userSettings);
    }

    public storeUser(user: User): void {
        this.currentUser = user;
        localStorage.setItem(CredentialStoreService.USER_KEY, JSON.stringify(user));
    }

    public storeUserSettings(userSettings: UserSettings): void {
        localStorage.setItem(CredentialStoreService.USER_SETTINGS_KEY, JSON.stringify(userSettings));
    }

    private storeToken(accessToken: string): void {
        this.authToken = accessToken;
        localStorage.setItem(CredentialStoreService.AUTH_TOKEN_KEY, accessToken);
    }

    private setupUser(user: User): void {
        this.currentUser = user;
        this.store.dispatch(AppActions.currentUserLoaded({user}));
    }

    private setupUserSettings(userSettings: UserSettings): void {
        this.store.dispatch(AppActions.userSettingsLoaded({userSettings}));
    }

    private initCurrentUserFromStorage(): void {
        const tokenRaw: string | null = localStorage.getItem(CredentialStoreService.AUTH_TOKEN_KEY);
        if (isNilOrEmpty(tokenRaw)) {
            return;
        }
        if (this.isTokenExpired(tokenRaw!)) {
            localStorage.clear();
            return;
        }
        this.setupUser(this.getUserFromStorage());
        this.setupUserSettings(this.getUserSettingsFromStorage());
        this.storeToken(tokenRaw!);
    }

    private getUserFromStorage(): User {
        const userRaw: string | null = localStorage.getItem(CredentialStoreService.USER_KEY);
        if (isNilOrEmpty(userRaw)) {
            this.clear();
        }
        return JSON.parse(userRaw!);
    }

    private getUserSettingsFromStorage(): UserSettings {
        const userSettingsRaw: string | null = localStorage.getItem(CredentialStoreService.USER_SETTINGS_KEY);
        if (isNilOrEmpty(userSettingsRaw)) {
            this.clear();
        }
        return JSON.parse(userSettingsRaw!);
    }

    private isTokenExpired(accessToken: string): boolean {
        const expTimestamp = this.jwtService.decodeToken(accessToken)[CredentialStoreService.EXPIRATION_KEY_IN_TOKEN];
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return (expTimestamp * 1000) < DateUtil.now().getTime();
        // Note: *1000 needs because exp is epoch seconds and Date uses ms.
    }

}
