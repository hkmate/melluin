import {FilterOperator} from '@shared/api-util/filter-options';
import {
    Between,
    Equal,
    ILike,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Raw
} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {FindOperator} from 'typeorm/find-options/FindOperator';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WhereClosureOperationConvert = (_: any) => FindOperator<any>;

@Injectable()
export class WhereClosureOperationConvertFactory {

    private static readonly mapper: Record<FilterOperator, WhereClosureOperationConvert> = {
        eq: <T>(value: T) => Equal(value),
        neq: <T>(value: T) => Not(Equal(value)),
        lt: <T>(value: T) => LessThan(value),
        lte: <T>(value: T) => LessThanOrEqual(value),
        gt: <T>(value: T) => MoreThan(value),
        gte: <T>(value: T) => MoreThanOrEqual(value),
        like: <T>(value: T) => Like(value),
        ilike: <T>(value: T) => ILike(value),
        between: <T>([from, to]: Array<T>) => Between(from, to),
        in: <T>(values: Array<T>) => In(values),
        isNull: () => IsNull(),
        notNull: () => Not(IsNull()),
        jsonContains: <T>(value: Array<T>) => Raw(alias => `${alias} ?| array[${value.map(x => `'${x}'`).join(', ')}]`)
    }

    public get(operator: FilterOperator): WhereClosureOperationConvert {
        return WhereClosureOperationConvertFactory.mapper[operator]
    }

}
