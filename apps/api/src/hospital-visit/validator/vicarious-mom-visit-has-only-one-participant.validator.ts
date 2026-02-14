import {BadRequestException} from '@nestjs/common';
import {VisitSaveValidator, VisitValidationData} from '@be/hospital-visit/validator/visit-validator';
import {ApiError} from '@shared/api-util/api-error';


export class VicariousMomVisitHasOnlyOneParticipantValidator implements VisitSaveValidator {

    public validate({item}: VisitValidationData): Promise<void> {
        const {vicariousMomVisit, participantIds} = item;
        if (vicariousMomVisit && participantIds.length !== 1) {
            throw new BadRequestException({
                message: 'VicariousMomVisit could be only when there is one participant',
                code: ApiError.VICARIOUS_MOM_VISIT_CANNOT_BE_WITH_MORE_PARTICIPANT
            });
        }
        return Promise.resolve();
    }

}
