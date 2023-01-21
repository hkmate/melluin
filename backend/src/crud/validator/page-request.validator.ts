import {PageRequest} from '@shared/api-util/pageable';
import {Validator} from '@shared/validator/validator';

export interface PageRequestValidator extends Validator<PageRequest>{

    validate(request: PageRequest): void | never;

}
