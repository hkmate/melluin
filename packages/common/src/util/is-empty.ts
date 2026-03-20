export function isEmpty<T extends string | Array<unknown>>(array: T): boolean {
    return array.length === 0;
}
