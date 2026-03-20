import {isNil} from './is-nil';

export function orElse<T>(optionalValue: T | null | undefined, defaultValue: T): T {
    if (isNil(optionalValue)) {
        return defaultValue;
    }
    return optionalValue;
}
