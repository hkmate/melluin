import {isNil, PAGE_QUERY_KEY, PAGE_REQUEST_DEFAULT_SIZE, PAGE_SIZE_QUERY_KEY} from '@melluin/common';
import {PageRequest} from '@be/crud/page-request';
import {HttpRequestInfo} from '@be/util/http-request-info';


export class PageRequestParser {

    public parse(httpReq: HttpRequestInfo): PageRequest {
        if (isNil(httpReq)) {
            return this.getDefault();
        }

        const request = this.getDefault(httpReq.url,
            httpReq.query[PAGE_QUERY_KEY], httpReq.query[PAGE_SIZE_QUERY_KEY]);
        return {
            ...request,
            ...this.parseQuery(httpReq.body as object)
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

    private parseQuery(query: object): Partial<PageRequest> {
        if (isNil(query)) {
            return {};
        }
        return query
    }

}
