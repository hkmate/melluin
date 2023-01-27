import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNotNil} from '@shared/util/util';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {filter, map, Observable} from 'rxjs';

@Injectable()
export class RouteDataHandler extends UrlParamHandler {

    constructor(route: ActivatedRoute, router: Router) {
        super(route, router);
    }

    public getData<T>(key: string): Observable<T> {
        return this.route.data.pipe(
            filter(data => isNotNil(data[key])),
            map(data => data[key])
        );
    }

}
