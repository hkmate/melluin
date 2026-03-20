import {isNilOrEmpty} from './is-nil-or-empty';
import {Nil} from './type/nil';

export function emptyToUndef<T extends string | Array<unknown>>(value: T | Nil): T | undefined {
    return isNilOrEmpty(value) ? undefined : value as T;
}
