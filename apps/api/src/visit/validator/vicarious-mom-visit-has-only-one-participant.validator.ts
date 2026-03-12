import {BadRequestException} from '@nestjs/common';
import {VisitSaveValidator, VisitValidationData} from '@be/visit/validator/visit-validator';
import {ApiErrors} from '@melluin/common';


export class VicariousMomVisitHasOnlyOneParticipantValidator implements VisitSaveValidator {

    public validate({item}: VisitValidationData): Promise<void> {
        const {vicariousMomVisit, participantIds} = item;
        if (vicariousMomVisit && participantIds.length !== 1) {
            throw new BadRequestException({
                message: 'VicariousMomVisit could be only when there is one participant',
                code: ApiErrors.VICARIOUS_MOM_VISIT_CANNOT_BE_WITH_MORE_PARTICIPANT
            });
        }
        return Promise.resolve();
    }

}
