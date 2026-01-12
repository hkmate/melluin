import {BadRequestException} from '@nestjs/common';
import {
    HospitalVisitConnectionValidationData,
    VisitConnectionValidator
} from '@be/hospital-visit-connections/validator/visit-connection-validator';
import {ApiError} from '@shared/api-util/api-error';


export class ConnectedVisitIsNotVicariousMomVisitValidator implements VisitConnectionValidator {

    public validate({visit, connectCandidate}: HospitalVisitConnectionValidationData): Promise<void> {
        if (visit.vicariousMomVisit || connectCandidate.vicariousMomVisit) {
            throw new BadRequestException({
                message: 'Vicarious mom visit cannot be connected to another.',
                code: ApiError.VICARIOUS_MOM_VISIT_CANNOT_BE_CONNECTED
            });
        }
        return Promise.resolve();
    }

}
