import * as _ from 'lodash';

export type Camelize<T> = T extends `${infer A}_${infer B}` ? `${A}${Camelize<Capitalize<B>>}` : T
export type CamelizeKeys<T extends object> = {
    [key in keyof T as key extends string ? Camelize<key> : key]: T[key]
}

export function camelizeKeys<T extends object>(item: T): CamelizeKeys<T> {
    return _.mapKeys(item, (value, key) => _.camelCase(key)) as CamelizeKeys<T>;
}
