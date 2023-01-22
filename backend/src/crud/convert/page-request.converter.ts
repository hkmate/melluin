import {PageRequest} from '@shared/api-util/pageable';
import {Converter} from '@shared/converter';

export type PageRequestConverter = Converter<PageRequest, PageRequest>;
