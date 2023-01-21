export interface Converter<T, R> {

    convert(value: T): R;
    convert(value: undefined): undefined;
    convert(value?: T): T | undefined;

}
