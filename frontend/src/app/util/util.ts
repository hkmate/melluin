export function isNotNil<T>(value: T): boolean {
    return !isNil(value);
}

export function isNil<T>(value: T): boolean {
    return value === null || value === undefined;
}

export function isEmpty<T>(array: Array<T> | string): boolean {
    return array.length === 0;
}

export function isNotEmpty<T>(array: Array<T> | string): boolean {
    return !isEmpty(array);
}

export function isNilOrEmpty<T>(array: Array<T> | string): boolean {
    return isNil(array) || array.length === 0;
}

export function optionalArrayToArray<T>(element: T | Array<T>): Array<T> {
    return (element instanceof Array) ? element : [element];
}

export function capitalizeFirstLetter(text: string): string {
    if (isNilOrEmpty(text)) {
        return text;
    }
    return text[0].toUpperCase() + text.slice(1);
}

// Because Array.flat() is not in Angular
// It works in arrays what are 'deeper' than 1
export function flatten<T>(arr: Array<T | Array<T>>): Array<T> {
    const stack = [...arr];
    const res = [];
    while (stack.length) {
        const next = stack.pop();
        if (Array.isArray(next)) {
            stack.push(...next);
        } else {
            res.push(next);
        }
    }
    return res.reverse();
}

