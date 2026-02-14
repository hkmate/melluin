export interface Validator<T> {
    validate(value: T): void;
}

export interface AsyncValidator<T> {
    validate(value: T): Promise<void>
}
