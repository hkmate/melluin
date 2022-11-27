import {ModuleWithProviders, NgModule} from '@angular/core';
import {AuthenticationService} from './service/authentication.service';
import {AuthGuard} from './service/auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './service/jwt.interceptor';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {JwtService} from './service/jwt.service';

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
                AuthGuard,
                {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
            ]
        };
    }

}
