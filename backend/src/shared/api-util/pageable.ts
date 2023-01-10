import {FilterOptions} from '@shared/api-util/filter-options';
import {SortOptions} from '@shared/api-util/sort-options';

export interface PageRequest<T> {
    page: number;
    size: number;
    sort: SortOptions<T>;
    where?: FilterOptions<T>
}

export interface Pageable<T> {
    readonly page: number;
    readonly size: number;
    readonly content: Array<T>;
    readonly sort: SortOptions<T>;
    readonly countOfAll: number;
}
