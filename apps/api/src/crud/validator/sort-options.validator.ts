import {BadRequestException} from '@nestjs/common';
import {SortOptions} from '@shared/api-util/sort-options';
import {isNil} from '@shared/util/util';
import {Validator} from '@shared/validator/validator';
import {PageRequest} from '@be/crud/page-request';

export class SortOptionsValidator implements Validator<PageRequest> {

    private constructor(private readonly sortableFields: Array<string>) {
    }

    public static of(sortableFields: Array<string>): SortOptionsValidator {
        return new SortOptionsValidator(sortableFields);
    }

    public validate(value: PageRequest): void {
        this.validateSortOptions(value.sort);
    }

    private validateSortOptions(sort?: SortOptions): void {
        if (isNil(sort)) {
            return;
        }
        if (!this.isEverySortKeyEnabled(sort)) {
            throw new BadRequestException(
                `Sort options has invalid fields. Enabled: (${this.sortableFields.join(', ')})`);
        }
        if (!this.isEveryOrderWayEnabled(sort)) {
            throw new BadRequestException(
                'Sort options has invalid way of ordering. Enabled: DESC, ASC');
        }
    }

    private isEverySortKeyEnabled(sort: SortOptions): boolean {
        return Object.keys(sort)
            .every(sortKey => this.sortableFields.includes(sortKey));
    }

    private isEveryOrderWayEnabled(sort: SortOptions): boolean {
        return Object.values(sort)
            .every(orderWay => ['DESC', 'ASC'].includes(orderWay));
    }

}
