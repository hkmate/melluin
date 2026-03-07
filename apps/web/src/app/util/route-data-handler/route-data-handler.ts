import {Injectable} from '@angular/core';
import {isNotNil} from '@melluin/common';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {filter, map, Observable} from 'rxjs';

@Injectable()
export class RouteDataHandler extends UrlParamHandler {

    public getData<T>(key: string): Observable<T> {
        return this.route.data.pipe(
            filter(data => isNotNil(data[key])),
            map(data => data[key])
        );
    }

}
