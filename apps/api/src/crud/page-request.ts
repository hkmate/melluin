import {SortOptions} from '@shared/api-util/sort-options';
import {FilterOptions} from '@shared/api-util/filter-options';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';

export interface PageRequest {
    pagination: IPaginationOptions;
    sort?: SortOptions;
    where?: FilterOptions
}
