import {Injectable} from '@nestjs/common';
import {PageRequestValidator} from '@be/crud/validator/page-request.validator';
import {PageRequest} from '@shared/api-util/pageable';
import {personFilterableFields, personSortableFields} from '@shared/person/person-filterable-fields';
import {SortOptionsValidator} from '@be/crud/validator/sort-options.validator';
import {Validator} from '@shared/validator/validator';
import {FilterOptionsValidator} from '@be/crud/validator/filter-options.validator';
import {ValidatorChain} from '@shared/validator/validator-chain';

@Injectable()
export class PersonFieldsPageRequestValidator implements PageRequestValidator {

    private validator: Validator<PageRequest> = ValidatorChain.of(
        SortOptionsValidator.of(personSortableFields),
        FilterOptionsValidator.of(personFilterableFields)
    );

    public validate(request: PageRequest): void {
        this.validator.validate(request);
    }

}
