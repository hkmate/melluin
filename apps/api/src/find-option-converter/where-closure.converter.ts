import {FilterOperation, FilterOptions} from '@shared/api-util/filter-options';
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere';
import {FindOperator} from 'typeorm/find-options/FindOperator';
import {Injectable} from '@nestjs/common';
import {WhereClosureOperationConvertFactory} from '@be/find-option-converter/where-closure-operation-convert.factory';
import * as _ from 'lodash';

@Injectable()
export class WhereClosureConverter {

    constructor(private readonly operationConverterFactory: WhereClosureOperationConvertFactory) {
    }

    public convertFilterOptions<T>(filterOptions: FilterOptions): Array<FindOptionsWhere<T>> | FindOptionsWhere<T> {
        if (Array.isArray(filterOptions)) {
            return filterOptions.map(option => this.convertConjunctionFilterOptionsToWhereClosure(option));
        }
        return this.convertConjunctionFilterOptionsToWhereClosure(filterOptions);
    }

    private convertConjunctionFilterOptionsToWhereClosure<T>(filterOptions: FilterOptions): FindOptionsWhere<T> {
        return Object.entries(filterOptions)
            .map(([key, value]) => ({key, value: this.convertOperationToTypeOrmFormat(value)}))
            .reduce(this.whereClosureFieldReducer.bind(this), {});
    }

    private convertOperationToTypeOrmFormat<T>(operation: FilterOperation<T>): FindOperator<T> {
        return this.operationConverterFactory.get(operation.operator)(operation.operand);
    }

    private whereClosureFieldReducer<T>(previous: FindOptionsWhere<T>, {key, value}): FindOptionsWhere<T> {
        _.set(previous, key, value);
        return previous;
    }

}
