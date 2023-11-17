import {isNil, isNotNil} from '@shared/util/util';
import {ConjunctionFilterOptions, FilterOperation, FilterOptions} from '@shared/api-util/filter-options';
import {Converter} from '@shared/converter';

export type  FilterConverter = (value: FilterOperation<unknown>) => Promise<{
    key: string,
    value: FilterOperation<unknown>
}>;

export type FieldFilterConverters = Record<string, FilterConverter>;

class FilterConverterWrapper {

    constructor(private converter: FieldFilterConverters = {}) {
    }

    public get(key: string): FilterConverter {
        return isNotNil(this.converter[key]) ? this.converter[key] : (value => Promise.resolve({key, value}));
    }

    public has(key: string): boolean {
        return isNotNil(this.converter[key]);
    }

}

export class FilterOptionsFieldsConverter implements Converter<FilterOptions, Promise<FilterOptions>> {

    private readonly converters: FilterConverterWrapper;

    private constructor(converter: FieldFilterConverters) {
        this.converters = new FilterConverterWrapper(converter);
    }

    public static of(converter: FieldFilterConverters): FilterOptionsFieldsConverter {
        return new FilterOptionsFieldsConverter(converter);
    }

    public convert(value: FilterOptions): Promise<FilterOptions>;
    public convert(value: undefined): undefined;
    public convert(filter?: FilterOptions): Promise<FilterOptions> | undefined;
    public convert(filter?: FilterOptions): Promise<FilterOptions> | undefined {
        if (isNil(filter)) {
            return undefined;
        }
        return this.convertFilterOptions(filter);
    }

    private convertFilterOptions(filter: FilterOptions): Promise<FilterOptions> {
        if (Array.isArray(filter)) {
            return Promise.all(
                filter.map(conjunction => this.convertConjunctionFilterOptions(conjunction))
            );
        }
        return this.convertConjunctionFilterOptions(filter);
    }

    private async convertConjunctionFilterOptions(filterOptions: ConjunctionFilterOptions): Promise<ConjunctionFilterOptions> {
        const keysToConvert = Object.keys(filterOptions).filter(key => this.converters.has(key));
        await Promise.all(keysToConvert.map(async keyToConvert => {
            const operation = filterOptions[keyToConvert];
            const {key, value} = await this.converters.get(keyToConvert)(operation);
            delete filterOptions[keyToConvert];
            filterOptions[key] = value;
        }));
        return filterOptions;
    }

}

