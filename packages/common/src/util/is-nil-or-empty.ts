import {Nil} from './type/nil';
import {isNil} from './is-nil';

export function isNilOrEmpty<T extends string | Array<unknown>>(value: T | Nil): boolean {
    return isNil(value) || value!.length === 0;
}
