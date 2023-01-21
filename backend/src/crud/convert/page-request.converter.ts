import {PageRequest} from '@shared/api-util/pageable';
import {Converter} from '@shared/converter';

export type PageRequestConverter = Converter<PageRequest, PageRequest>;

export class DefaultPageRequestConverter implements PageRequestConverter {

    public convert(value: PageRequest): PageRequest;
    public convert(value: undefined): undefined;
    public convert(value?: PageRequest): PageRequest | undefined;
    public convert(value?: PageRequest): PageRequest | undefined {
        return
    }

}
