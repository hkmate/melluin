import {FilterOperation, FilterOptions} from '@shared/api-util/filter-options';
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere';
import {FindOperator} from 'typeorm/find-options/FindOperator';
import {Injectable} from '@nestjs/common';
import {WhereClosureOperationConvertFactory} from '@be/find-option-converter/where-closure-operation-convert.factory';


@Injectable()
export class WhereClosureConverter {

    constructor(private readonly operationConverterFactory: WhereClosureOperationConvertFactory) {
    }

    public convertFilterOptions<T>(filterOptions: FilterOptions<T>): Array<FindOptionsWhere<T>> | FindOptionsWhere<T> {
        if (Array.isArray(filterOptions)) {
            return filterOptions.map(option => this.convertConjunctionFilterOptionsToWhereClosure(option));
        }
        return this.convertConjunctionFilterOptionsToWhereClosure(filterOptions);
    }

    private convertConjunctionFilterOptionsToWhereClosure<T>(filterOptions: FilterOptions<T>): FindOptionsWhere<T> {
        return Object.entries(filterOptions)
            .map(([key, value]) => ({key, value: this.convertOperationToTypeOrmFormat(value)}))
            .reduce((previousValue, currentValue) => {
                previousValue[currentValue.key] = currentValue.value;
                return previousValue;
            }, {});
    }

    private convertOperationToTypeOrmFormat<T>(operation: FilterOperation<T>): FindOperator<T> {
        return this.operationConverterFactory.get(operation.operator)(operation.operand);
    }

}
