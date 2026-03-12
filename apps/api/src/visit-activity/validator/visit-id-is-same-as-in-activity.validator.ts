import {BadRequestException} from '@nestjs/common';
import {ApiErrors} from '@melluin/common';
import {
    VisitActivityUpdateValidationData,
    VisitActivityUpdateValidator
} from '@be/visit-activity/validator/visit-activity-validator';

export class VisitIdIsSameAsInActivityValidator implements VisitActivityUpdateValidator {

    public validate({visit, activity}: VisitActivityUpdateValidationData): Promise<void> {
        if (visit.id === activity.visit.id) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visit id not match with id in activity',
            code: ApiErrors.VISIT_ID_NOT_SAME_AS_IN_ACTIVITY
        });
    }

}
