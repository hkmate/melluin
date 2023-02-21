import {FilterOperation, FilterOptions} from '@shared/api-util/filter-options';
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere';
import {FindOperator} from 'typeorm/find-options/FindOperator';
import {Injectable} from '@nestjs/common';
import {WhereClosureOperationConvertFactory} from '@be/find-option-converter/where-closure-operation-convert.factory';


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
        if (this.isFieldSimply(key)) {
            previous[key] = value;
            return previous;
        }
        this.defineValueObject(previous, value, this.splitFieldName(key));
        return previous;
    }

    private isFieldSimply(fieldName: string): boolean {
        return fieldName.includes('.');
    }

    private splitFieldName(fieldName: string): Array<string> {
        return fieldName.split('.');
    }

    private defineValueObject(target: Record<string, unknown>, value: unknown, keys: Array<string>): void {
        if (keys.length === 1) {
            target[keys[0]] = value;
            return;
        }
        const innerTarget = (target[keys[0]] ?? {}) as Record<string, unknown>;
        this.defineValueObject(innerTarget, value, keys.slice(1));
        target[keys[0]] = innerTarget;
    }

}
