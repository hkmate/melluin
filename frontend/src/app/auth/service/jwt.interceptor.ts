import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {EndpointMap, HttpMethod} from '../model/endpoint';
import {environment} from '../../../environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private readonly PUBLIC_ENDPOINTS = new EndpointMap();

    constructor(private readonly authService: AuthenticationService) {
        this.initPublicEndpoints();
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isForOurBackend(request)) {
            return next.handle(request);
        }
        if (this.isOurPublicEndpoint(request)) {
            return next.handle(request);
        }
        if (this.authService.hasAuthenticatedUser()) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.token}`,
                }
            });
        }

        return next.handle(request);
    }

    private initPublicEndpoints(): void {
        this.PUBLIC_ENDPOINTS
            .add({method: HttpMethod.POST, url: `${environment.baseURL}/api/oauth/token`})
    }

    private isOurPublicEndpoint(request: HttpRequest<any>): boolean  {
        return this.PUBLIC_ENDPOINTS.contains({method: HttpMethod[request.method], url: request.url});
    }

    private isForOurBackend(request: HttpRequest<any>): boolean {
        return request.url.startsWith(environment.baseURL);
    }
}
