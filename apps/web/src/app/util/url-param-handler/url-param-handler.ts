import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNil, NOOP, optionalArrayToArray} from '@shared/util/util';
import {map, Observable} from 'rxjs';

export type QueryParams = Record<string, string | Array<string> | undefined>;

@Injectable()
export class UrlParamHandler {

    constructor(protected route: ActivatedRoute, protected router: Router) {
    }

    public hasParam(paramName: string): boolean {
        return Object.hasOwn(this.route.snapshot.queryParams, paramName);
    }

    public getParams(paramName: string): Array<string> | undefined {
        const params = this.route.snapshot.queryParams[paramName];
        return isNil(params) ? undefined : optionalArrayToArray(params);
    }

    public getParam(paramName: string): string | undefined {
        return this.route.snapshot.queryParams[paramName];
    }

    public subscribeToParam(paramName: string): Observable<string | undefined> {
        return this.route.queryParams.pipe(
            map(params => params[paramName])
        );
    }

    public getNumberParam(paramName: string): number | undefined {
        const value = this.getParam(paramName);
        if (isNil(value)) {
            return undefined;
        }
        return +value;
    }

    public setParam<T>(paramName: string, paramValue: T): void {
        this.setParams({[paramName]: '' + paramValue});
    }

    public setParams(params: QueryParams): void {
        this.changeQueryParams({...this.getAllQueryParam(), ...params});
    }

    public removeParam(paramName: string): void {
        this.removeParams([paramName]);
    }

    public removeParams(paramNames: Array<string>): void {
        const params = this.getAllQueryParam();
        const paramsWithoutDeleted = Object.keys(this.getAllQueryParam())
            .filter(key => !paramNames.includes(key))
            .reduce<QueryParams>((previousValue, currentValue) => {
                previousValue[currentValue] = params[currentValue];
                return previousValue;
            }, {});

        if (!this.hadChangeInPropertyCount(paramsWithoutDeleted, params)) {
            return;
        }

        this.changeQueryParams(paramsWithoutDeleted);
    }

    private getAllQueryParam(): QueryParams {
        return {...this.route.snapshot.queryParams};
    }

    private changeQueryParams(queryParams: QueryParams): void {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams,
                queryParamsHandling: null
            }).then(NOOP).catch(NOOP);
    }

    private hadChangeInPropertyCount<T extends object>(obj1: T, obj2: T): boolean {
        return Object.keys(obj1).length !== Object.keys(obj2).length;
    }

}
