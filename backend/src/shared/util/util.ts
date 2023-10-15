export type VoidFunc = () => void;
export const NOOP = (): unknown => ({});
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const VoidNOOP = (): void => {};

export type Nil = null | undefined;

export type Nullable<T> = T | null;

export function isNotNil<T>(value: T | Nil): value is T {
    return !isNil(value);
}

export function isNil<T>(value: T | Nil): value is Nil {
    // eslint-disable-next-line no-undefined
    return value === null || value === undefined;
}

export function allNil<T>(...values: Array<T | Nil>): boolean {
    return values.every(item => isNil(item));
}

export function isEmpty<T>(array: Array<T> | string): boolean {
    return array.length === 0;
}

export function isNotEmpty<T>(array: Array<T> | string): boolean {
    return !isEmpty(array);
}

export function isNilOrEmpty<T>(value: Array<T> | string | Nil): boolean {
    return isNil(value) || value!.length === 0;
}

export function isNilOrEmptyObj<T extends object>(value: T | Nil): boolean {
    return isNil(value) || isEmpty(Object.keys(value));
}

export function isNotNilOrEmptyObj<T extends object>(value: T | Nil): value is T {
    return !isNilOrEmptyObj(value);
}

export function emptyToUndef(value?: string): string | undefined {
    return isNilOrEmpty(value) ? undefined : value;
}

export function includeAny<T>(arr: Array<T>, ...values: Array<T>): boolean {
    return values.some(value => arr.includes(value));
}

export function optionalArrayToArray<T>(element: T | Array<T>): Array<T> {
    return (element instanceof Array) ? element : [element];
}

export function parseTime(time: string): Date {
    return parseTimeWithDate(time, new Date());
}

export function parseTimeWithDate(time: string, date: Date): Date {
    const [hour, min] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(+hour, +min, 0, 0);
    return dateTime;
}

export function capitalizeFirstLetter(text: string): string {
    if (isNilOrEmpty(text)) {
        return text;
    }
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return text[0].toUpperCase() + text.slice(1);
}

// Because Array.flat() is not in Angular
// It works in arrays what are 'deeper' than 1
export function flatten<T>(arr: Array<T | Array<T>>): Array<T> {
    const stack = [...arr];
    const res: Array<T> = [];
    while (isNotEmpty(stack)) {
        const next: T | Array<T> = stack.pop()!;
        if (Array.isArray(next)) {
            stack.push(...next);
        } else {
            res.push(next);
        }
    }
    return res.reverse();
}
