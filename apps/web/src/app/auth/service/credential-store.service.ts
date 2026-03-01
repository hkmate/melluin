import {inject, Injectable, Signal, signal} from '@angular/core';
import {JwtService} from './jwt.service';
import {AuthInfo, DateUtil, isNilOrEmpty, User, UserSettings} from '@melluin/common';

@Injectable({providedIn: 'root'})
export class CredentialStoreService {

    private static readonly AUTH_TOKEN_KEY = 'authToken';
    private static readonly USER_KEY = 'user';
    private static readonly USER_SETTINGS_KEY = 'userSettings';
    private static readonly EXPIRATION_KEY_IN_TOKEN = 'exp';

    private readonly jwtService = inject(JwtService);

    private readonly currentUser = signal<User | undefined>(undefined);
    private readonly authToken = signal<string | undefined>(undefined);
    private readonly userSettings = signal<UserSettings | undefined>(undefined);

    public init(): void {
        this.initCurrentUserFromStorage();
    }

    public getToken(): Signal<string | undefined> {
        return this.authToken.asReadonly();
    }

    public getUser(): Signal<User | undefined> {
        return this.currentUser.asReadonly();
    }

    public getUserSettings(): Signal<UserSettings | undefined> {
        return this.userSettings.asReadonly();
    }

    public clear(): void {
        this.authToken.set(undefined);
        this.currentUser.set(undefined);
        this.userSettings.set(undefined);
        localStorage.clear();
    }

    public useToken(authInfo: AuthInfo): void {
        this.clear();
        this.storeToken(authInfo.accessToken);
        this.setupUser(authInfo.user);
        this.setupUserSettings(authInfo.userSettings);
    }

    public setupUser(user: User): void {
        this.currentUser.set(user);
        localStorage.setItem(CredentialStoreService.USER_KEY, JSON.stringify(user));
    }

    public setupUserSettings(userSettings: UserSettings): void {
        this.userSettings.set(userSettings);
        localStorage.setItem(CredentialStoreService.USER_SETTINGS_KEY, JSON.stringify(userSettings));
    }

    private storeToken(accessToken: string): void {
        this.authToken.set(accessToken);
        localStorage.setItem(CredentialStoreService.AUTH_TOKEN_KEY, accessToken);
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
        this.currentUser.set(this.getUserFromStorage());
        this.authToken.set(tokenRaw!);
        this.userSettings.set(this.getUserSettingsFromStorage());
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
