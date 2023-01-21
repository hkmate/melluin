import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {PAGE_REQUEST_DEFAULT_SIZE, PageRequest} from '@shared/api-util/pageable';
import {isNil, Nullable} from '@shared/util/util';
import {Base64} from '@be/util/base64';


@Injectable()
export class PageRequestParserPipe implements PipeTransform<Nullable<string>, PageRequest> {

    public transform(value: Nullable<string>, metadata: ArgumentMetadata): PageRequest {
        if (isNil(value)) {
            return this.getDefault();
        }

        return this.parse(value);
    }

    private getDefault(): PageRequest {
        return {
            page: 0,
            size: PAGE_REQUEST_DEFAULT_SIZE
        }
    }

    // Now the query is a base64 encoded PageRequest<T> object. In the future I want to change it to a proper
    // query string where the user (or the frontend) could specify filtering, soring, paging.
    private parse(query: string): PageRequest {
        const rawJson = Base64.decode(query);
        return JSON.parse(rawJson);
    }

}
