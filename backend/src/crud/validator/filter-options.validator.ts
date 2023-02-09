import {BadRequestException} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Validator} from '@shared/validator/validator';
import {ConjunctionFilterOptions, FilterOptions} from '@shared/api-util/filter-options';
import {PageRequest} from '@be/crud/page-request';

export class FilterOptionsValidator implements Validator<PageRequest> {

    private constructor(private readonly filterableFields: Array<string>) {
    }

    public static of(filterableFields: Array<string>): FilterOptionsValidator {
        return new FilterOptionsValidator(filterableFields);
    }

    public validate(value: PageRequest): void {
        this.validateFilterOptions(value.where);
    }

    private validateFilterOptions(filter?: FilterOptions): void {
        if (isNil(filter)) {
            return;
        }
        if (Array.isArray(filter)) {
            filter.forEach(conjunction => this.validateConjunctionFilterOptions(conjunction));
        } else {
            this.validateConjunctionFilterOptions(filter);
        }
    }

    private validateConjunctionFilterOptions(filterOptions: ConjunctionFilterOptions): void {
        if (!this.isEveryFilterKeyEnabled(filterOptions)) {
            throw new BadRequestException(
                `Filter options has invalid fields. Enabled: (${this.filterableFields.join(', ')})`);
        }
    }

    private isEveryFilterKeyEnabled(filterOptions: ConjunctionFilterOptions): boolean {
        return Object.keys(filterOptions)
            .every(filterKey => this.filterableFields.includes(filterKey));
    }

}
