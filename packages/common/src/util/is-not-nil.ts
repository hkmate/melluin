import {Nil} from './type/nil';
import {isNil} from './is-nil';

export function isNotNil<T>(value: T | Nil): value is T {
    return !isNil(value);
}
