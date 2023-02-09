import {isNil} from '@shared/util/util';
import {Base64} from '@be/util/base64';
import {PageRequest} from '@be/crud/page-request';
import {PAGE_QUERY_KEY, PAGE_REQUEST_DEFAULT_SIZE, PAGE_SIZE_QUERY_KEY} from '@shared/api-util/pageable';
import {HttpRequestInfo} from '@be/util/http-request-info';


export class PageRequestParser {

    public parse(httpReq: HttpRequestInfo): PageRequest {
        if (isNil(httpReq)) {
            return this.getDefault();
        }

        const request = this.getDefault(httpReq.route.path,
            httpReq.query[PAGE_QUERY_KEY], httpReq.query[PAGE_SIZE_QUERY_KEY]);
        return {
            ...request,
            ...this.parseQuery(httpReq.query.query)
        };
    }

    private getDefault(route = '',
                       page: number | string = '1',
                       size: number | string = PAGE_REQUEST_DEFAULT_SIZE): PageRequest {
        return {
            pagination: {
                page,
                limit: size,
                route,
                routingLabels: {
                    pageLabel: PAGE_QUERY_KEY,
                    limitLabel: PAGE_SIZE_QUERY_KEY
                }
            }
        };
    }

    // Now the query is a base64 encoded PageRequest<T> object. In the future I want to change it to a proper
    // query string where the user (or the frontend) could specify filtering, soring, paging.
    private parseQuery(query: string): PageRequest {
        const rawJson = Base64.decode(query);
        return JSON.parse(rawJson);
    }

}
