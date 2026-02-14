import {inject, Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpStatusCode
} from '@angular/common/http';
import {catchError, Observable, of, OperatorFunction, throwError} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {EndpointMap, HttpMethod} from '../model/endpoint';
import {AppConfig} from '@fe/app/config/app-config';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private readonly authService = inject(AuthenticationService);

    private readonly PUBLIC_ENDPOINTS = new EndpointMap();

    constructor() {
        this.initPublicEndpoints();
    }

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown> | never> {
        return next.handle(this.prepareRequest(request))
            .pipe(this.createCatchUnauthorizedErrorOperator());
    }

    // eslint-disable-next-line max-lines-per-function
    private prepareRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
        if (!this.isForOurBackend(request)) {
            return request;
        }
        if (this.isOurPublicEndpoint(request)) {
            return request;
        }
        if (this.authService.hasAuthenticatedUser()) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.token}`,
                }
            });
        }
        return request;
    }

    private createCatchUnauthorizedErrorOperator(): OperatorFunction<HttpEvent<unknown>, HttpEvent<unknown> | never> {
        return catchError((err: HttpErrorResponse) => {
            if (err.status !== HttpStatusCode.Unauthorized) {
                return throwError(() => err);
            }
            this.authService.logout();
            return of();
        });
    }

    private initPublicEndpoints(): void {
        this.PUBLIC_ENDPOINTS
            .add({method: HttpMethod.POST, url: `${AppConfig.get('baseURL')}/auth/token`})
    }

    private isOurPublicEndpoint(request: HttpRequest<unknown>): boolean {
        return this.PUBLIC_ENDPOINTS.contains({method: HttpMethod[request.method], url: request.url});
    }

    private isForOurBackend(request: HttpRequest<unknown>): boolean {
        return request.url.startsWith(AppConfig.get('baseURL'));
    }

}
