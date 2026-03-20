import {Nil} from './type/nil';

export function isNil<T>(value: T | Nil): value is Nil {
    return value === null || value === undefined;
}
