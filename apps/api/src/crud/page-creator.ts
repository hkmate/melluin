import {Pageable} from '@shared/api-util/pageable';
import {FindManyOptions} from 'typeorm/find-options/FindManyOptions';
import {FindOptionsOrder, ObjectLiteral, Repository} from 'typeorm';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {isNotNil} from '@shared/util/util';
import {PageRequest} from '@be/crud/page-request';
import {paginate} from 'nestjs-typeorm-paginate';
import * as _ from 'lodash';
import {SortOptions} from '@shared/api-util/sort-options';


export abstract class PageCreator<T extends ObjectLiteral> {

    protected constructor(protected readonly repository: Repository<T>,
                          protected readonly whereClosureConverter: WhereClosureConverter) {
    }

    protected createOptions(pageRequest: PageRequest): Partial<FindManyOptions<T>> {
        const result: Partial<FindManyOptions<T>> = {};
        if (isNotNil(pageRequest.sort)) {
            result.order = this.convertSortOptionsToFindOrder(pageRequest.sort);
        }
        if (isNotNil(pageRequest.where)) {
            result.where = this.whereClosureConverter.convertFilterOptions(pageRequest.where);
        }
        return result;
    }

    protected convertSortOptionsToFindOrder(sortOptions: SortOptions): FindOptionsOrder<T> {
        return Object.entries(sortOptions)
            .reduce((prev, [key, value]) => {
                _.set(prev, key, value);
                return prev;
            }, {});
    }

    protected getPage(request: PageRequest,
                      otherOptions: Partial<FindManyOptions<T>>): Promise<Pageable<T>> {
        return paginate(this.repository, request.pagination, {
            ...this.createOptions(request),
            ...otherOptions
        });
    }

}
