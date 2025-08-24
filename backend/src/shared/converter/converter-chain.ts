import {Converter} from '@shared/converter/converter';

export class ConverterChain<T, R> implements Converter<T, R> {

    private constructor(private readonly converters: Array<Converter<unknown, unknown>> = []) {
    }

    // eslint-disable max-len
    public static of<T, R>(c1: Converter<T, R>): ConverterChain<T, R>;
    public static of<T, T1, R>(c1: Converter<T, T1>, c2: Converter<T1, R>): ConverterChain<T, R>;
    public static of<T, T1, T2, R>(c1: Converter<T, T1>, c2: Converter<T1, T2>, c3: Converter<T2, R>): ConverterChain<T, R>;
    public static of<T, T1, T2, T3, R>(c1: Converter<T, T1>, c2: Converter<T1, T2>, c3: Converter<T2, T3>, c4: Converter<T3, R>): ConverterChain<T, R>;
    public static of<T, T1, T2, T3, T4, R>(c1: Converter<T, T1>, c2: Converter<T1, T2>, c3: Converter<T2, T3>, c4: Converter<T3, T3>, c5: Converter<T4, R>): ConverterChain<T, R>;
    // eslint-enable max-len
    public static of(...converters: Array<Converter<unknown, unknown>>): ConverterChain<unknown, unknown> {
        return new ConverterChain(converters);
    }

    public convert(value: T): R;
    public convert(value: undefined): undefined;
    public convert(value?: T): R | undefined;
    public convert(value?: T): R | undefined {
        return this.converters.reduce((current, converter) => converter.convert(current), value as unknown) as R | undefined;
    }

}
