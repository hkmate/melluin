import {Validator} from '@shared/validator/validator';
import {PageRequest} from '@be/crud/page-request';

export interface PageRequestValidator extends Validator<PageRequest>{

    validate(request: PageRequest): void | never;

}
