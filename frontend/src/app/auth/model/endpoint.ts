import {isEmpty, isNil} from '@shared/util/util';

export enum HttpMethod {
    GET = 'GET', POST = 'POST', DELETE = 'DELETE', PUT = 'PUT', PATCH = 'PATCH'
}

export interface Endpoint {
    method: HttpMethod;
    url: string;
}

export class EndpointMap {

    private instance: { [method in HttpMethod]?: Array<string> } = {};

    public add(endpoint: Endpoint): EndpointMap {
        const urlsOfMethod = this.getUrlListByMethod(endpoint.method);
        urlsOfMethod.push(endpoint.url);

        return this;
    }

    public contains(endpoint: Endpoint | null): boolean {
        if (isNil(endpoint)) {
            return false;
        }
        return this.getUrlListByMethod(endpoint!.method).some(urlPattern => endpoint!.url.match(urlPattern));
    }

    private getUrlListByMethod(method: HttpMethod): Array<string> {
        if (isNil(this.instance[method]) || isEmpty(this.instance[method]!)) {
            this.instance[method] = [];
        }
        return this.instance[method]!;
    }

}
