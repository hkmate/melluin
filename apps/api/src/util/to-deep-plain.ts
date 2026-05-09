import {isNotNil, isNil} from '@melluin/common';

export function toDeepPlain<T extends object | undefined | null>(a: T): T;
export function toDeepPlain<T extends object>(a: Array<T>): Array<T>;
export function toDeepPlain<T extends object | undefined | null>(a: T | Array<T>): T | Array<T> {
    if (isNil(a)) {
        return a;
    }
    if (Array.isArray(a)) {
        return a.map(item => toDeepPlain(item));
    }
    return Object.fromEntries(Object.entries(a).map(entry => {
        if (isNotNil(entry[1])
            && typeof entry[1] === 'object'
            && entry[1].constructor.name !== 'Object') {
            return [entry[0], toDeepPlain(entry[1] as object)];
        }
        return entry;
    })) as T;
}
