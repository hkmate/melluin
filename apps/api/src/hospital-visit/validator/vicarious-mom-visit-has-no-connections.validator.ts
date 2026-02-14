import {BadRequestException} from '@nestjs/common';
import {HospitalVisitRewriteValidationData, VisitRewriteValidator} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';


export class VicariousMomVisitHasNoConnectionsValidator implements VisitRewriteValidator {

    public validate({item, entity}: HospitalVisitRewriteValidationData): Promise<void> {
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
