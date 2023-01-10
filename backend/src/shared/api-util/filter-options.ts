import {Nullable} from '@shared/util/util';


export type FilterOperator = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte'
    | 'like' | 'ilike' | 'between' | 'in' | 'isNull' | 'notNull';

export interface FilterOperation<T> {
    operator: FilterOperator,
    operand: Nullable<T> | Array<T>,
}

/**
 * In simple object the operations will be processed with AND.
 * If they are in array the operation objects will be processed with OR.
 *
 * Example 1:
 *      { firstName: {operator: 'eq', operand: 'Timber'}, lastName: "{operator: 'eq', operand: 'Smith'} }
 *     goes to: firstName == 'Timber' AND lastName == 'Smith'
 * Example 2:
 *      [
 *          { firstName: {operator: 'eq', operand: 'Timber'} },
 *          { lastName: "{operator: 'eq', operand: 'Smith'} }
 *      ]
 *     goes to: firstName == 'Timber' OR lastName == 'Smith'
 * Example 3:
 *      [
 *          { firstName: {operator: 'eq', operand: 'John'}, lastName: "{operator: 'eq', operand: 'Smith'} }
 *          { firstName: {operator: 'eq', operand: 'James'}, lastName: "{operator: 'eq', operand: 'Boyd'} }
 *      ]
 *     goes to:  (firstName == 'John' AND lastName == 'Smith') OR ( firstName == 'James' AND lastName == 'Boyd')
 */
export type ConjunctionFilterOptions<T> = Partial<Record<keyof T, FilterOperation<unknown>>>;
export type FilterOptions<T> = Array<ConjunctionFilterOptions<T>> | ConjunctionFilterOptions<T>;

export class FilterOperationBuilder {

    public static eq = <T>(value: T): FilterOperation<T> => ({operator: 'eq', operand: value});
    public static neq = <T>(value: T): FilterOperation<T> => ({operator: 'neq', operand: value});
    public static lt = <T>(value: T): FilterOperation<T> => ({operator: 'lt', operand: value});
    public static lte = <T>(value: T): FilterOperation<T> => ({operator: 'lte', operand: value});
    public static gt = <T>(value: T): FilterOperation<T> => ({operator: 'gt', operand: value});
    public static gte = <T>(value: T): FilterOperation<T> => ({operator: 'gte', operand: value});
    public static like = <T>(value: T): FilterOperation<T> => ({operator: 'like', operand: value});
    public static ilike = <T>(value: T): FilterOperation<T> => ({operator: 'ilike', operand: value});
    public static between = <T>(begin: T, end: T): FilterOperation<T> => ({operator: 'between', operand: [begin, end]});
    public static in = <T>(values: Array<T>): FilterOperation<T> => ({operator: 'in', operand: values});
    public static isNull = (): FilterOperation<null> => ({operator: 'isNull', operand: null});
    public static notNull = (): FilterOperation<null> => ({operator: 'notNull', operand: null});

}
