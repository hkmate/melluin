export function includeAny<T>(arr: Array<T>, ...values: Array<T>): boolean {
    return values.some(value => arr.includes(value));
}
