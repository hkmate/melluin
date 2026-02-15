import {FilterOptions, SortOptions} from '@melluin/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';

export interface PageRequest {
    pagination: IPaginationOptions;
    sort?: SortOptions;
    where?: FilterOptions
}
