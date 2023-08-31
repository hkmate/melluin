import {ModuleWithProviders, NgModule} from '@angular/core';
import {AuthenticationService} from './service/authentication.service';
import {AuthGuard} from './service/auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './service/jwt.interceptor';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {JwtService} from './service/jwt.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
})
export class AuthModule {

    public static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                JwtService,
                AuthenticationService,
                CredentialStoreService,
                PermissionService,
                AuthGuard,
                {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
            ]
        };
    }

}
