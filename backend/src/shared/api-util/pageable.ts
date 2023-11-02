import {FilterOptions} from '@shared/api-util/filter-options';
import {SortOptions} from '@shared/api-util/sort-options';

export const PAGE_REQUEST_DEFAULT_SIZE = 20;

export const PAGE_QUERY_KEY = 'page';
export const PAGE_SIZE_QUERY_KEY = 'size';
export const QUERY_QUERY_KEY = 'query';

export interface PageInfo {
    page: number;
    size: number;
}

export interface PageQuery extends PageInfo {
    sort?: SortOptions;
    where?: FilterOptions;
}

export interface Pageable<T> {
    items: Array<T>;
    meta: {
        itemCount: number;
        totalItems?: number;
        itemsPerPage: number;
        totalPages?: number;
        currentPage: number;
    };
}
