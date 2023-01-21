import {FilterOptions} from '@shared/api-util/filter-options';
import {SortOptions} from '@shared/api-util/sort-options';

export const PAGE_REQUEST_DEFAULT_SIZE = 20;

export interface PageRequest {
    page: number;
    size: number;
    sort?: SortOptions;
    where?: FilterOptions
}

export interface Pageable<T> {
    readonly page: number;
    readonly size: number;
    readonly content: Array<T>;
    readonly sort?: SortOptions;
    readonly countOfAll: number;
}
