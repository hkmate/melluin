import {BadRequestException} from '@nestjs/common';
import {ApiError} from '@shared/api-util/api-error';
import {
    VisitActivityUpdateValidationData,
    VisitActivityUpdateValidator
} from '@be/hospital-visit-activity/validator/visit-activity-validator';

export class VisitIdIsSameAsInActivityValidator implements VisitActivityUpdateValidator {

    public validate({visit, activity}: VisitActivityUpdateValidationData): Promise<void> {
        if (visit.id === activity.hospitalVisit.id) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visit id not match with id in activity',
            code: ApiError.VISIT_ID_NOT_SAME_AS_IN_ACTIVITY
        });
    }

}
