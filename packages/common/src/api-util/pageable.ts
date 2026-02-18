import {FilterOptions} from './filter-options';
import {SortOptions} from './sort-options';

export const PAGE_REQUEST_DEFAULT_SIZE = 20;

export const PAGE_QUERY_KEY = 'page';
export const PAGE_SIZE_QUERY_KEY = 'size';

export interface PageInfo {
    page: number;
    size: number;
}

export interface FilteringInfo {
    sort?: SortOptions;
    where?: FilterOptions;
}

export type PageQuery = PageInfo & FilteringInfo;

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
