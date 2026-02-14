import {Pageable} from '@shared/api-util/pageable';
import {Converter} from '@shared/converter/converter';
import {isNil} from '@shared/util/util';


export class PageConverter<T, R> implements Converter<Pageable<T>, Pageable<R>> {

    private constructor(private readonly itemConverter: Converter<T, R>) {
    }

    public static of<T, R>(itemConverter: Converter<T, R>): PageConverter<T, R> {
        return new PageConverter(itemConverter);
    }

    public convert(pageable: undefined): undefined;
    public convert(pageable: Pageable<T>): Pageable<R>;
    public convert(pageable?: Pageable<T>): Pageable<R> | undefined {
        if (isNil(pageable)) {
            return undefined;
        }
        return {
            ...pageable,
            items: pageable.items?.map(item => this.itemConverter.convert(item))
        };
    }

}
