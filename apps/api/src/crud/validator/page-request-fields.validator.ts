import {PageRequestValidator} from '@be/crud/validator/page-request.validator';
import {SortOptionsValidator} from '@be/crud/validator/sort-options.validator';
import {Validator} from '@shared/validator/validator';
import {FilterOptionsValidator} from '@be/crud/validator/filter-options.validator';
import {ValidatorChain} from '@shared/validator/validator-chain';
import {PageRequest} from '@be/crud/page-request';


export class PageRequestFieldsValidator implements PageRequestValidator {

    private readonly validator: Validator<PageRequest>;

    private constructor(sortableFields: Array<string>, filterableFields: Array<string>) {
        this.validator = ValidatorChain.of(
            SortOptionsValidator.of(sortableFields),
            FilterOptionsValidator.of(filterableFields)
        );
    }

    public static of(sortableFields: Array<string>, filterableFields: Array<string>): PageRequestFieldsValidator {
        return new PageRequestFieldsValidator(sortableFields, filterableFields);
    }

    public validate(request: PageRequest): void {
        this.validator.validate(request);
    }

}
