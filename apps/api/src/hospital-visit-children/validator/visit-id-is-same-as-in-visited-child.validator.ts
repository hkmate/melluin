import {BadRequestException} from '@nestjs/common';
import {ApiError} from '@shared/api-util/api-error';
import {
    VisitedChildUpdateValidationData,
    VisitedChildUpdateValidator
} from '@be/hospital-visit-children/validator/visited-child-validator';

export class VisitIdIsSameAsInVisitedChildValidator implements VisitedChildUpdateValidator {

    public validate({visit, visitedChild}: VisitedChildUpdateValidationData): Promise<void> {
        if (visit.id === visitedChild.visitId) {
            return Promise.resolve();
        }
        throw new BadRequestException({
            message: 'Visit id not match with id in visited child',
            code: ApiError.VISIT_ID_NOT_SAME_AS_IN_VISITED_CHILD
        });
    }

}
