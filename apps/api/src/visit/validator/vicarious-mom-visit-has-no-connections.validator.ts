import {BadRequestException} from '@nestjs/common';
import {VisitRewriteValidationData, VisitRewriteValidator} from '@be/visit/validator/visit-validator';
import {ApiError} from '@melluin/common';


export class VicariousMomVisitHasNoConnectionsValidator implements VisitRewriteValidator {

    public validate({item, entity}: VisitRewriteValidationData): Promise<void> {
        if (!item.vicariousMomVisit) {
            return Promise.resolve();
        }
        if (entity.id === entity.connectionGroupId) {
            return Promise.resolve();
        }

        throw new BadRequestException({
            message: 'Vicarious mom visit cannot be connected to another.',
            code: ApiError.VICARIOUS_MOM_VISIT_CANNOT_BE_CONNECTED
        });
    }

}
