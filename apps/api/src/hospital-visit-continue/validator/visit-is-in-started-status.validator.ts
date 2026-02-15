import {
    VisitContinueValidationData,
    VisitContinueValidator
} from '@be/hospital-visit-continue/validator/visit-continue-validator';
import {ApiError, HospitalVisitStatus} from '@melluin/common';
import {BadRequestException} from '@nestjs/common';

export class VisitIsInStartedStatusValidator implements VisitContinueValidator {

    public validate({originalVisit}: VisitContinueValidationData): Promise<void> {
        if (originalVisit.status === HospitalVisitStatus.STARTED) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Original visit is not in STARTED status',
            code: ApiError.ORIGINAL_VISIT_IS_NOT_IN_STARTED_STATUS_AT_CONTINUE
        })
    }

}
