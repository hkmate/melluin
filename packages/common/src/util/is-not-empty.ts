import {isEmpty} from './is-empty';

export function isNotEmpty<T extends string | Array<unknown>>(array: T): boolean {
    return !isEmpty(array);
}
