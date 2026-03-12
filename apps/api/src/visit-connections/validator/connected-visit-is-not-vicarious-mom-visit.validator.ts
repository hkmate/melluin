import {BadRequestException} from '@nestjs/common';
import {
    VisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/visit-connections/validator/visit-connection-validator';
import {ApiErrors} from '@melluin/common';


export class ConnectedVisitIsNotVicariousMomVisitValidator implements VisitConnectionValidator {

    public validate({visit, connectCandidate}: VisitConnectionValidationData): Promise<void> {
        if (visit.vicariousMomVisit || connectCandidate.vicariousMomVisit) {
            throw new BadRequestException({
                message: 'Vicarious mom visit cannot be connected to another.',
                code: ApiErrors.VICARIOUS_MOM_VISIT_CANNOT_BE_CONNECTED
            });
        }
        return Promise.resolve();
    }

}
