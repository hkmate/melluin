import {BadRequestException} from '@nestjs/common';
import {ApiError} from '@shared/api-util/api-error';
import {
    VisitedChildBasicValidationData,
    VisitedChildBasicValidator
} from '@be/hospital-visit-children/validator/visited-child-validator';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

export class VisitIsInStartedStatusValidator implements VisitedChildBasicValidator {

    public validate({visit}: VisitedChildBasicValidationData): Promise<void> {
        if (visit.status === HospitalVisitStatus.STARTED) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Cannot add child to a visit that has other status than STARTED',
            code: ApiError.CANNOT_CHANGE_CHILD_IN_VISIT_NOT_STARTED
        });
    }

}
