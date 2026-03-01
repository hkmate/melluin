import {inject, Injectable, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {AuthCredentials, AuthInfo, isNotNil, User} from '@melluin/common';
import {Router} from '@angular/router';
import {PATHS} from '@fe/app/app-paths';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {environment} from '@fe/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly credentialStoreService = inject(CredentialStoreService);

    public get token(): Signal<string | undefined> {
        return this.credentialStoreService.getToken();
    }

    public hasAuthenticatedUser(): boolean {
        return isNotNil(this.credentialStoreService.getUser()());
    }

    public login(data: AuthCredentials): Observable<User> {
        return this.http.post<AuthInfo>(`${environment.baseURL}/auth/login`, data)
            .pipe(map(
                (token: AuthInfo): User => {
                    this.credentialStoreService.useToken(token);
                    return this.credentialStoreService.getUser()()!;
                }
            ));
    }

    public logout(): void {
        sessionStorage.clear();
        this.credentialStoreService.clear();
        this.router.navigate([PATHS.login.main]);
    }

}
