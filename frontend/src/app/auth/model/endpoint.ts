import {isNil} from '../../util/util';

export enum HttpMethod {
    GET = 'GET', POST = 'POST', DELETE = 'DELETE', PUT = 'PUT', PATCH = 'PATCH'
}

export class Endpoint {
    method: HttpMethod;
    url: string;
}

export class EndpointMap {

    private instance: { [method in HttpMethod]?: string[] } = {};

    public add(endpoint: Endpoint): EndpointMap {
        const urlsOfMethod = this.getUrlListByMethod(endpoint.method);
        urlsOfMethod.push(endpoint.url);

        return this;
    }

    public contains(endpoint: Endpoint): boolean {
        if (isNil(endpoint)) {
            return false;
        }
        // need to check with startsWith because of endpoints with path param
        return this.getUrlListByMethod(endpoint.method).some(urlPattern => !!endpoint.url.match(urlPattern));
    }

    private getUrlListByMethod(method: HttpMethod): string[] {
        if (!this.instance[method] || !this.instance[method].length) {
            this.instance[method] = [];
        }
        return this.instance[method];
    }

}
