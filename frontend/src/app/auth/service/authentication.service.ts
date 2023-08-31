import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {AuthToken} from '@shared/user/auth-token';
import {Router} from '@angular/router';
import {PATHS} from '@fe/app/app-paths';
import {AppConfig} from '@fe/app/config/app-config';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {AuthCredentials} from '@shared/user/auth-credentials';

@Injectable()
export class AuthenticationService {

    constructor(private readonly http: HttpClient,
                private readonly router: Router,
                private readonly credentialStoreService: CredentialStoreService) {
    }

    public get token(): string | undefined {
        return this.credentialStoreService.getToken();
    }

    public hasAuthenticatedUser(): boolean {
        return isNotNil(this.credentialStoreService.getUser());
    }

    public login(username: string, password: string): Observable<User> {
        const authBody: AuthCredentials = {username, password};

        return this.http.post<AuthToken>(`${AppConfig.get('baseURL')}/auth/login`, authBody)
            .pipe(map(
                (token: AuthToken): User => {
                    this.credentialStoreService.useToken(token);
                    return this.credentialStoreService.getUser()!;
                }
            ));
    }

    public logout(): void {
        this.credentialStoreService.clear();
        this.router.navigate([PATHS.login.main]);
    }

}
